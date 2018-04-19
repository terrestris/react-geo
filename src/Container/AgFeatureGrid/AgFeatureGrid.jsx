import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import {
  isEqual,
  isFunction,
  kebabCase
} from 'lodash';
import OlStyle from 'ol/style/style';
import OlStyleFill from 'ol/style/fill';
import OlStyleCircle from 'ol/style/circle';
import OlStyleStroke from 'ol/style/stroke';
import OlMap from 'ol/map';
import OlFeature from 'ol/feature';
import OlSourceVector from 'ol/source/vector';
import OlLayerVector from 'ol/layer/vector';
import OlGeomGeometry from 'ol/geom/geometry';
import OlGeomGeometryCollection from 'ol/geom/geometrycollection';

import { MapUtil } from '../../index';
import { CSS_PREFIX } from '../../constants';

import './AgFeatureGrid.less';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

/**
 * The AgFeatureGrid.
 *
 * @class The AgFeatureGrid
 * @extends React.Component
 */
export class AgFeatureGrid extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  _className = `${CSS_PREFIX}ag-feature-grid`

  /**
   * The class name to add to each table row.
   * @type {String}
   * @private
   */
  _rowClassName = `${CSS_PREFIX}ag-feature-grid-row`;

  /**
   * The prefix to use for each table row class.
   * @type {String}
   * @private
   */
  _rowKeyClassNamePrefix = 'row-key-';

  /**
   * The hover class name.
   * @type {String}
   * @private
   */
  _rowHoverClassName = 'ag-row-hover';

  /**
   * The source holding the features of the grid.
   * @type {ol.source.Vector}
   * @private
   */
  _source = null;

  /**
   * The layer representing the features of the grid.
   * @type {ol.layer.Vector}
   * @private
   */
  _layer = null;

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * An optional CSS class which should be added to the table.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * The height of the grid.
     *
     * @type {Number}
     */
    height: PropTypes.number,

    /**
     * The width of the grid.
     *
     * @type {Number}
     */
    width: PropTypes.number,

    /**
     * The theme to use for the grid. See
     * https://www.ag-grid.com/javascript-grid-styling/ for available options.
     * Note: CSS must be loaded to use the theme!
     */
    theme: PropTypes.string,

    /**
     * An optional CSS class to add to each table row or a function that
     * is evaluated for each record.
     * @type {String|Function}
     */
    rowClassName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),

    /**
     * The features to show in the grid and the map (if set).
     * @type {Array}
     */
    features: PropTypes.arrayOf(PropTypes.instanceOf(OlFeature)),

    /**
     * The map the features should be rendered on. If not given, the features
     * will be rendered in the table only.
     * @type {ol.Map}
     */
    map: PropTypes.instanceOf(OlMap),

    /**
     * A list of attribute names to hide in the table.
     * @type {Array}
     */
    attributeBlacklist: PropTypes.arrayOf(PropTypes.string),

    /**
     * Optional callback function, that will be called on rowclick.
     * @type {Function}
     */
    onRowClick: PropTypes.func,

    /**
     * Optional callback function, that will be called on rowmouseover.
     * @type {Function}
     */
    onRowMouseOver: PropTypes.func,

    /**
     * Optional callback function, that will be called on rowmouseout.
     * @type {Function}
     */
    onRowMouseOut: PropTypes.func,

    /**
     * Optional callback function, that will be called if the selection changes.
     * @type {Function}
     */
    onRowSelectionChange: PropTypes.func,

    /**
     * Whether the map should center on the current feature's extent on init or
     * not.
     * @type {Boolean}
     */
    zoomToExtent: PropTypes.bool,

    /**
     * Whether features should be selectable via a map click or not. If you want
     * to enable/disable a checkbox, please set checkboxSelection on a column
     * in columnDefs.
     *
     * @type {Boolean}
     */
    selectable: PropTypes.bool,

    /**
     * The default style to apply to the features.
     * @type {ol.Style|ol.FeatureStyleFunction}
     */
    featureStyle: PropTypes.oneOfType([
      PropTypes.instanceOf(OlStyle),
      PropTypes.func
    ]),

    /**
     * The highlight style to apply to the features.
     * @type {ol.Style|ol.FeatureStyleFunction}
     */
    highlightStyle: PropTypes.oneOfType([
      PropTypes.instanceOf(OlStyle),
      PropTypes.func
    ]),

    /**
     * The select style to apply to the features.
     * @type {ol.Style|ol.FeatureStyleFunction}
     */
    selectStyle: PropTypes.oneOfType([
      PropTypes.instanceOf(OlStyle),
      PropTypes.func
    ]),

    /**
     * The name of the vector layer presenting the features in the grid.
     * @type {String}
     */
    layerName: PropTypes.string,

    /**
     * Custom column definitions to apply to the given column (mapping via key).
     * See https://ant.design/components/table/#Column.
     * @type {Object}
     */
    columnDefs: PropTypes.object,

    /**
     * The children to render.
     * @type {Element}
     */
    children: PropTypes.element,

    /**
     * A Function that creates the rowkey from the given feature.
     * Receives the feature as property.
     * Default is: feature => feature.ol_uid
     *
     * @type {Function}
     */
    keyFunction: PropTypes.func
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    theme: 'ag-theme-balham',
    height: 250,
    features: [],
    attributeBlacklist: [],
    featureStyle: new OlStyle({
      fill: new OlStyleFill({
        color: 'rgba(255, 255, 255, 0.5)'
      }),
      stroke: new OlStyleStroke({
        color: 'rgba(73, 139, 170, 0.9)',
        width: 1
      }),
      image: new OlStyleCircle({
        radius: 6,
        fill: new OlStyleFill({
          color: 'rgba(255, 255, 255, 0.5)'
        }),
        stroke: new OlStyleStroke({
          color: 'rgba(73, 139, 170, 0.9)',
          width: 1
        })
      })
    }),
    highlightStyle: new OlStyle({
      fill: new OlStyleFill({
        color: 'rgba(230, 247, 255, 0.8)'
      }),
      stroke: new OlStyleStroke({
        color: 'rgba(73, 139, 170, 0.9)',
        width: 1
      }),
      image: new OlStyleCircle({
        radius: 6,
        fill: new OlStyleFill({
          color: 'rgba(230, 247, 255, 0.8)'
        }),
        stroke: new OlStyleStroke({
          color: 'rgba(73, 139, 170, 0.9)',
          width: 1
        })
      })
    }),
    selectStyle: new OlStyle({
      fill: new OlStyleFill({
        color: 'rgba(230, 247, 255, 0.8)'
      }),
      stroke: new OlStyleStroke({
        color: 'rgba(73, 139, 170, 0.9)',
        width: 2
      }),
      image: new OlStyleCircle({
        radius: 6,
        fill: new OlStyleFill({
          color: 'rgba(230, 247, 255, 0.8)'
        }),
        stroke: new OlStyleStroke({
          color: 'rgba(73, 139, 170, 0.9)',
          width: 2
        })
      })
    }),
    layerName: 'react-geo-feature-grid-layer',
    columnDefs: {},
    keyFunction: feature => feature.ol_uid
  }

  /**
   * The constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      grid: null
    };
  }

  /**
   * Called on lifecycle phase componentDidMount.
   */
  componentDidMount() {
    const {
      map,
      features,
      zoomToExtent
    } = this.props;

    this.initVectorLayer(map);
    this.initMapEventHandlers(map);

    if (zoomToExtent) {
      this.zoomToFeatures(features);
    }
  }

  /**
   * Called on lifecycle phase componentWillReceiveProps.
   *
   * @param {Object} nextProps The next props.
   */
  componentWillReceiveProps(nextProps) {
    const {
      map,
      features,
      selectable
    } = this.props;

    if (!(isEqual(nextProps.map, map))) {
      this.initVectorLayer(nextProps.map);
      this.initMapEventHandlers(nextProps.map);
    }

    if (!(isEqual(nextProps.features, features))) {
      if (this._source) {
        this._source.clear();
        this._source.addFeatures(nextProps.features);
      }

      if (nextProps.zoomToExtent) {
        this.zoomToFeatures(nextProps.features);
      }
    }

    if (!(isEqual(nextProps.selectable, selectable))) {
      if (nextProps.selectable && map) {
        map.on('singleclick', this.onMapSingleClick);
      } else {
        if (map) {
          map.un('singleclick', this.onMapSingleClick);
        }
      }
    }
  }

  /**
   * Called on lifecycle phase componentWillUnmount.
   */
  componentWillUnmount() {
    this.deinitVectorLayer();
    this.deinitMapEventHandlers();
  }

  /**
   * Initialized the vector layer that will be used to draw the input features
   * on and adds it to the map (if any).
   *
   * @param {ol.Map} map The map to add the layer to.
   */
  initVectorLayer = map => {
    const {
      features,
      featureStyle,
      layerName
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    if (MapUtil.getLayerByName(map, layerName)) {
      return;
    }

    const source = new OlSourceVector({
      features: features
    });

    const layer = new OlLayerVector({
      name: layerName,
      source: source,
      style: featureStyle
    });

    map.addLayer(layer);

    this._source = source;
    this._layer = layer;
  }

  /**
   * Adds map event callbacks to highlight and select features in the map (if
   * given) on pointermove and singleclick. Hovered and selected features will
   * be highlighted and selected in the grid as well.
   *
   * @param {ol.Map} map The map to register the handlers to.
   */
  initMapEventHandlers = map => {
    const {
      selectable
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    map.on('pointermove', this.onMapPointerMove);

    if (selectable) {
      map.on('singleclick', this.onMapSingleClick);
    }
  }

  /**
   * Highlights the feature beneath the cursor on the map and in the grid.
   *
   * @param {ol.MapBrowserEvent} olEvt The ol event.
   */
  onMapPointerMove = olEvt => {
    const {
      map,
      features,
      highlightStyle,
      selectStyle
    } = this.props;

    const {
      grid
    } = this.state;

    // TODO Move to own method
    const selectedRows = grid.api.getSelectedRows();
    const selectedRowKeys = selectedRows.map(row => row.key);

    const selectedFeatures = map.getFeaturesAtPixel(olEvt.pixel, {
      layerFilter: layerCand => layerCand === this._layer
    }) || [];

    const rowRenderer = grid.api.rowRenderer;

    features.forEach(feature => {
      const key = this.props.keyFunction(feature);

      let rc;
      rowRenderer.forEachRowComp((idx, rowComp) => {
        if (rowComp.getRowNode().data.key === feature.ol_uid) {
          rc = rowComp;
        }
      });

      const el = rc.getBodyRowElement();

      if (el) {
        el.classList.remove(this._rowHoverClassName);
      }
      if (selectedRowKeys.includes(key)) {
        feature.setStyle(selectStyle);
      } else {
        feature.setStyle(null);
      }
    });

    selectedFeatures.forEach(feature => {
      let rc;
      rowRenderer.forEachRowComp((idx, rowComp) => {
        if (rowComp.getRowNode().data.key === feature.ol_uid) {
          rc = rowComp;
        }
      });

      const el = rc.getBodyRowElement();

      if (el) {
        el.classList.add(this._rowHoverClassName);
      }
      feature.setStyle(highlightStyle);
    });
  }

  /**
   * Selects the selected feature in the map and in the grid.
   *
   * @param {ol.MapBrowserEvent} olEvt The ol event.
   */
  onMapSingleClick = olEvt => {
    const {
      map,
      selectStyle
    } = this.props;

    const {
      grid
    } = this.state;

    // TODO Move to own method
    const selectedRows = grid.api.getSelectedRows();
    const selectedRowKeys = selectedRows.map(row => row.key);

    const selectedFeatures = map.getFeaturesAtPixel(olEvt.pixel, {
      layerFilter: layerCand => layerCand === this._layer
    }) || [];

    selectedFeatures.forEach(selectedFeature => {
      const key = this.props.keyFunction(selectedFeature);
      if (selectedRowKeys.includes(key)) {
        // rowKeys = rowKeys.filter(rowKey => rowKey !== key);
        selectedFeature.setStyle(null);
        grid.api.forEachNode(node => {
          if (node.data.key === selectedFeature.ol_uid) {
            node.setSelected(false);
          }
        });
      } else {
        // rowKeys.push(key);
        selectedFeature.setStyle(selectStyle);
        // TODO move to method getRowFromFeature
        grid.api.forEachNode(node => {
          if (node.data.key === selectedFeature.ol_uid) {
            node.setSelected(true);
          }
        });
      }
    });
  }

  /**
   * Removes the vector layer from the given map (if any).
   */
  deinitVectorLayer = () => {
    const {
      map
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    map.removeLayer(this._layer);
  }

  /**
   * Unbinds the pointermove and click event handlers from the map (if given).
   */
  deinitMapEventHandlers = () => {
    const {
      map,
      selectable
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    map.un('pointermove', this.onMapPointerMove);

    if (selectable) {
      map.un('singleclick', this.onMapSingleClick);
    }
  }

  /**
   * Returns the column definitions out of the attributes of the first
   * given feature.
   *
   * @return {Array} The column definitions.
   */
  getColumnDefs = () => {
    const {
      attributeBlacklist,
      features,
      columnDefs
    } = this.props;

    let columns = [];
    const feature = features[0];

    if (!(feature instanceof OlFeature)) {
      return columns;
    }

    const props = feature.getProperties();

    Object.keys(props).forEach(key => {
      if (attributeBlacklist.includes(key)) {
        return;
      }

      if (props[key] instanceof OlGeomGeometry) {
        return;
      }

      columns.push({
        headerName: key,
        field: key,
        ...columnDefs[key]
      });
    });

    return columns;
  }

  /**
   * Returns the table row data from all of the given features.
   *
   * @return {Array} The table data.
   */
  getRowData = () => {
    const {
      features
    } = this.props;

    let data = [];

    features.forEach(feature => {
      const properties = feature.getProperties();
      const filtered = Object.keys(properties)
        .filter(key => !(properties[key] instanceof OlGeomGeometry))
        .reduce((obj, key) => {
          obj[key] = properties[key];
          return obj;
        }, {});

      data.push({
        key: feature.ol_uid, //this.props.keyFunction(feature),
        ...filtered
      });
    });

    return data;
  }

  /**
   * Returns the correspondig feature for the given table row key.
   *
   * @param {Number} key The row key to obtain the feature from.
   * @return {ol.Feature} The feature candidate.
   */
  getFeatureFromRowKey = key => {
    const {
      features,
      keyFunction
    } = this.props;

    const feature = features.filter(feature => keyFunction(feature) === key);

    return feature[0];
  }

  /**
   * Called on row click and zooms the the corresponding feature's extent.
   *
   * @param {Object} row The clicked row.
   */
  onRowClick = evt => {
    const {
      onRowClick
    } = this.props;

    const row = evt.data;
    const feature = this.getFeatureFromRowKey(row.key);

    if (isFunction(onRowClick)) {
      onRowClick(row, feature);
    }

    this.zoomToFeatures([feature]);
  }

  /**
   * Called on row mouseover and hightlights the corresponding feature's
   * geometry.
   *
   * @param {Object} row The highlighted row.
   */
  onRowMouseOver = evt => {
    const {
      onRowMouseOver
    } = this.props;

    const row = evt.data;
    const feature = this.getFeatureFromRowKey(row.key);

    if (isFunction(onRowMouseOver)) {
      onRowMouseOver(row, feature);
    }

    this.highlightFeatures([feature]);
  }

  /**
   * Called on mouseout and unhightlights any highlighted feature.
   *
   * @param {Object} row The unhighlighted row.
   */
  onRowMouseOut = evt => {
    const {
      onRowMouseOut
    } = this.props;

    const row = evt.data;
    const feature = this.getFeatureFromRowKey(row.key);

    if (isFunction(onRowMouseOut)) {
      onRowMouseOut(row, feature);
    }

    this.unhighlightFeatures([feature]);
  }

  /**
   * Fits the map's view to the extent of the passed features.
   *
   * @param {ol.Feature[]} features The features to zoom to.
   */
  zoomToFeatures = features => {
    const {
      map
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    let featGeometries = [];
    features.forEach(feature => {
      featGeometries.push(feature.getGeometry());
    });

    if (featGeometries.length > 0) {
      const geomCollection = new OlGeomGeometryCollection(featGeometries);
      map.getView().fit(geomCollection.getExtent());
    }
  }

  /**
   * Highlights the given features in the map.
   *
   * @param {ol.Feature[]} highlightFeatures The features to highlight.
   */
  highlightFeatures = highlightFeatures => {
    const {
      map,
      highlightStyle
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    highlightFeatures.forEach(feature => feature.setStyle(highlightStyle));
  }

  /**
   * Unhighlights the given features in the map.
   *
   * @param {ol.Feature[]} unhighlightFeatures The features to unhighlight.
   */
  unhighlightFeatures = unhighlightFeatures => {
    const {
      map,
      selectStyle
    } = this.props;

    const {
      grid
    } = this.state;

    if (!(map instanceof OlMap)) {
      return;
    }

    // TODO Move to own method
    const selectedRows = grid.api.getSelectedRows();
    const selectedRowKeys = selectedRows.map(row => row.key);

    unhighlightFeatures.forEach(feature => {
      const key = this.props.keyFunction(feature);
      if (selectedRowKeys.includes(key)) {
        feature.setStyle(selectStyle);
      } else {
        feature.setStyle(null);
      }
    });
  }

  /**
   * Sets the select style to the given features in the map.
   *
   * @param {ol.Feature[]} features The features to select.
   */
  selectFeatures = features => {
    const {
      map,
      selectStyle
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    features.forEach(feature => feature.setStyle(selectStyle));
  }

  /**
   * Resets the style of all features.
   */
  resetFeatureStyles = () => {
    const {
      map,
      features
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    features.forEach(feature => feature.setStyle(null));
  }

  /**
   * Called if the selection changes.
   */
  onSelectionChanged = () => {
    const {
      onRowSelectionChange
    } = this.props;

    const {
      grid
    } = this.state;

    const selectedRows = grid.api.getSelectedRows();
    const selectedFeatures = selectedRows.map(row => this.getFeatureFromRowKey(row.key));

    if (isFunction(onRowSelectionChange)) {
      onRowSelectionChange(selectedRows, selectedFeatures);
    }

    this.resetFeatureStyles();
    this.selectFeatures(selectedFeatures);
  }

  /**
   *
   * @param {*} grid
   */
  onGridReady(grid) {
    this.setState({
      grid
    }, this.onVisiblityChange);
  }

  /**
   *
   */
  onVisiblityChange() {
    if (this.state.grid) {
      this.state.grid.api.sizeColumnsToFit();
    }
  }

  /**
   * The render method.
   */
  render() {
    const {
      className,
      height,
      width,
      theme,
      rowClassName,
      features,
      map,
      attributeBlacklist,
      onRowClick,
      onRowMouseOver,
      onRowMouseOut,
      zoomToExtent,
      selectable,
      featureStyle,
      highlightStyle,
      selectStyle,
      layerName,
      columnDefs,
      children,
      ...passThroughProps
    } = this.props;

    // const {
    //   selectedRowKeys
    // } = this.state;

    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange
    // };

    const finalClassName = className
      ? `${className} ${this._className} ${theme}`
      : `${this._className} ${theme}`;

    let rowClassNameFn;
    if (isFunction(rowClassName)) {
      rowClassNameFn = record => `${this._rowClassName} ${rowClassName(record)}`;
    } else {
      const finalRowClassName = rowClassName
        ? `${rowClassName} ${this._rowClassName}`
        : this._rowClassName;
      rowClassNameFn = record => `${finalRowClassName} ${this._rowKeyClassNamePrefix}${kebabCase(record.key)}`;
    }

    return (
      <div
        className={finalClassName}
        style={{
          height: height,
          width: width
        }}
      >
        <AgGridReact
          columnDefs={this.getColumnDefs()}
          rowData={this.getRowData()}
          onGridReady={this.onGridReady.bind(this)}
          rowSelection='multiple'
          suppressRowClickSelection={true}
          onSelectionChanged={this.onSelectionChanged.bind(this)}
          onRowClicked={this.onRowClick.bind(this)}
          onCellMouseOver={this.onRowMouseOver.bind(this)}
          onCellMouseOut={this.onRowMouseOut.bind(this)}
          ref={ref => this._ref = ref}

          rowClassName={rowClassNameFn}
          {...passThroughProps}
        >
          {children}
        </AgGridReact>
      </div>
    );
  }
}

export default AgFeatureGrid;

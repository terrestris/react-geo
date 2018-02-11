import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import {
  isEqual,
  isFunction
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

import './FeatureGrid.less';

/**
 * * The FeatureGrid.
 *
 * @class The FeatureGrid
 * @extends React.Component
 */
export class FeatureGrid extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = 'react-geo-feature-grid'

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
     * Whether the map should center on the current feature's extent on init or
     * not.
     * @type {Boolean}
     */
    zoomToExtent: PropTypes.bool,

    /**
     * Whether rows should be selectable or not.
     *
     * @type {Boolean}
     */
    selectableRows: PropTypes.bool,

    /**
     * The default style to apply to the features.
     * @type {ol.Style}
     */
    featureStyle: PropTypes.instanceOf(OlStyle),

    /**
     * The highlight style to apply to the features.
     * @type {ol.Style}
     */
    highlightStyle: PropTypes.instanceOf(OlStyle),

    /**
     * The select style to apply to the features.
     * @type {ol.Style}
     */
    selectStyle: PropTypes.instanceOf(OlStyle),

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
    children: PropTypes.element
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
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
    columnDefs: {}
  }

  /**
   * The constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: []
    };
  }

  /**
   * Called on lifecycle phase componentDidMount.
   */
  componentDidMount() {
    const {
      zoomToExtent,
      features
    } = this.props;

    this.initVectorLayer();

    if (zoomToExtent) {
      this.zoomToFeatures(features);
    }
  }

  /**
   * Called on lifecycle phase componentWillUnmount.
   */
  componentWillUnmount() {
    this.deinitVectorLayer();
  }

  /**
   * Initialized the vector layer that will be used to draw the input features
   * on and adds it to the map (if any).
   */
  initVectorLayer = () => {
    const {
      map,
      features,
      featureStyle,
      layerName
    } = this.props;

    if (!(map instanceof OlMap)) {
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
        title: key,
        dataIndex: key,
        key: key,
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
  getTableData = () => {
    const {
      features
    } = this.props;

    let data = [];

    features.forEach((feature, idx)=> {
      const properties = feature.getProperties();
      const filtered = Object.keys(properties)
        .filter(key => !(properties[key] instanceof OlGeomGeometry))
        .reduce((obj, key) => {
          obj[key] = properties[key];
          return obj;
        }, {});

      data.push({
        key: feature.getId() || idx,
        ...filtered
      });
    });

    return data;
  }

  /**
   * Returns the correspondig feature for the given table row key.
   *
   * @param {String|Number} key The key to get the obtain the feature from.
   * @return {ol.Feature} The feature candidate.
   */
  getFeatureFromRowKey = key => {
    const {
      features
    } = this.props;

    const feature = features
      .filter((feature, idx) => (feature.getId() === key) || (idx === key));

    return feature[0];
  }

  /**
   * Called on row click and zooms the the corresponding feature's extent.
   *
   * @param {Object} row The clicked row.
   */
  onRowClick = row => {
    const {
      onRowClick
    } = this.props;

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
  onRowMouseOver = row => {
    const {
      onRowMouseOver
    } = this.props;

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
  onRowMouseOut = row => {
    const {
      onRowMouseOut
    } = this.props;

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
    const featCollection = new OlGeomGeometryCollection(featGeometries);

    map.getView().fit(featCollection.getExtent());
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
      features,
      featureStyle,
      selectStyle
    } = this.props;

    const {
      selectedRowKeys
    } = this.state;

    if (!(map instanceof OlMap)) {
      return;
    }

    unhighlightFeatures.forEach(feature => {
      if (selectedRowKeys.includes(feature.getId()) ||
          selectedRowKeys.includes(features.indexOf(feature))) {
        feature.setStyle(selectStyle);
      } else {
        feature.setStyle(featureStyle);
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
      features,
      featureStyle
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    features.forEach(feature => feature.setStyle(featureStyle));
  }

  /**
   * Called if the selection changes
   *
   * @param {Array} selectedRowKeys The list of currently selected row keys.
   */
  onSelectChange = selectedRowKeys => {
    const selectedFeatures = selectedRowKeys.map(key => this.getFeatureFromRowKey(key));

    this.resetFeatureStyles();
    this.selectFeatures(selectedFeatures);
    this.setState({ selectedRowKeys });
  }

  /**
   * The render method.
   */
  render() {
    const {
      features,
      map,
      attributeBlacklist,
      onRowClick,
      onRowMouseOver,
      onRowMouseOut,
      zoomToExtent,
      selectableRows,
      featureStyle,
      highlightStyle,
      selectStyle,
      layerName,
      columnDefs,
      children,
      ...passThroughProps
    } = this.props;

    const {
      selectedRowKeys
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <Table
        columns={this.getColumnDefs()}
        dataSource={this.getTableData()}
        onRow={record => ({
          onClick: () => this.onRowClick(record),
          onMouseOver: () => this.onRowMouseOver(record),
          onMouseOut: () => this.onRowMouseOut(record)
        })}
        rowSelection={selectableRows ? rowSelection : null}
        {...passThroughProps}
      >
        {children}
      </Table>
    );
  }
}

export default FeatureGrid;

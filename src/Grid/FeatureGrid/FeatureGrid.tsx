import * as React from 'react';

import { Table } from 'antd';

import OlStyle from 'ol/style/Style';
import OlStyleFill from 'ol/style/Fill';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleStroke from 'ol/style/Stroke';
import OlMap from 'ol/Map';
import OlFeature from 'ol/Feature';
import OlSourceVector from 'ol/source/Vector';
import OlLayerBase from 'ol/layer/Base';
import OlLayerVector from 'ol/layer/Vector';
import OlGeometry from 'ol/geom/Geometry';
import OlGeometryCollection from 'ol/geom/GeometryCollection';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import { getUid } from 'ol';

import _isEqual from 'lodash/isEqual';
import _isFunction from 'lodash/isFunction';
import _kebabCase from 'lodash/kebabCase';

import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import './FeatureGrid.less';
import { ColumnProps, TableProps } from 'antd/lib/table';

interface DefaultProps {
  /**
   * The features to show in the grid and the map (if set).
   */
  features: OlFeature<OlGeometry>[];
  /**
   */
  attributeBlacklist?: string[];
  /**
   * The default style to apply to the features.
   */
  featureStyle: OlStyle | (() => OlStyle);
  /**
   * The highlight style to apply to the features.
   */
  highlightStyle: OlStyle | (() => OlStyle);
  /**
   * The select style to apply to the features.
   */
  selectStyle: OlStyle | (() => OlStyle);
  /**
   * The name of the vector layer presenting the features in the grid.
   */
  layerName: string;
  /**
   * Custom column definitions to apply to the given column (mapping via key).
   * See https://ant.design/components/table/#Column.
   */
  columnDefs: ColumnProps<any>;
  /**
   * A Function that creates the rowkey from the given feature.
   * Receives the feature as property.
   * Default is: feature => feature.ol_uid
   *
   */
  keyFunction: (feature: OlFeature<OlGeometry>) => string;
  /**
   * Whether the map should center on the current feature's extent on init or
   * not.
   */
  zoomToExtent: boolean;
  /**
   * Whether rows and features should be selectable or not.
   */
  selectable: boolean;
}

export interface BaseProps {
  /**
   * A CSS class which should be added to the table.
   */
  className?: string;
  /**
   * A CSS class to add to each table row or a function that
   * is evaluated for each record.
   */
  rowClassName?: string | ((record: any) => string);
  /**
   * The map the features should be rendered on. If not given, the features
   * will be rendered in the table only.
   */
  map?: OlMap;
  /**
   * Callback function, that will be called on rowclick.
   */
  onRowClick?: (row: any, feature: OlFeature<OlGeometry>) => void;
  /**
   * Callback function, that will be called on rowmouseover.
   */
  onRowMouseOver?: (row: any, feature: OlFeature<OlGeometry>) => void;
  /**
   * Callback function, that will be called on rowmouseout.
   */
  onRowMouseOut?: (row: any, feature: OlFeature<OlGeometry>) => void;
  /**
   * Callback function, that will be called if the selection changes.
   */
  onRowSelectionChange?: (selectedRowKeys: Array<number | string>, selectedFeatures: OlFeature<OlGeometry>[]) => void;
}

interface FeatureGridState {
  selectedRowKeys: string[];
}

export type FeatureGridProps = BaseProps & Partial<DefaultProps> & TableProps<any>;

/**
 * The FeatureGrid.
 *
 * @class The FeatureGrid
 * @extends React.Component
 */
export class FeatureGrid extends React.Component<FeatureGridProps, FeatureGridState> {

  /**
   * The class name to add to this component.
   * @private
   */
  _className = 'react-geo-feature-grid';

  /**
   * The class name to add to each table row.
   * @private
   */
  _rowClassName = 'react-geo-feature-grid-row';

  /**
   * The prefix to use for each table row class.
   * @private
   */
  _rowKeyClassNamePrefix = 'row-key-';

  /**
   * The hover class name.
   * @private
   */
  _rowHoverClassName = 'row-hover';

  /**
   * The source holding the features of the grid.
   * @private
   */
  _source: OlSourceVector<OlGeometry> = null;

  /**
   * The layer representing the features of the grid.
   * @private
   */
  _layer: OlLayerVector = null;

  /**
   * The default properties.
   */
  static defaultProps: DefaultProps = {
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
    keyFunction: getUid,
    zoomToExtent: false,
    selectable: false
  };

  /**
   * The constructor.
   */
  constructor(props: FeatureGridProps) {
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
   * Invoked immediately after updating occurs. This method is not called for
   * the initial render.
   *
   * @param prevProps The previous props.
   */
  componentDidUpdate(prevProps: FeatureGridProps) {
    const {
      map,
      features,
      selectable,
      zoomToExtent
    } = this.props;

    if (!(_isEqual(prevProps.map, map))) {
      this.initVectorLayer(map);
      this.initMapEventHandlers(map);
    }

    if (!(_isEqual(prevProps.features, features))) {
      if (this._source) {
        this._source.clear();
        this._source.addFeatures(features);
      }

      if (zoomToExtent) {
        this.zoomToFeatures(features);
      }
    }

    if (!(_isEqual(prevProps.selectable, selectable))) {
      if (selectable && map) {
        map.on('singleclick', this.onMapSingleClick);
      } else {
        this.setState({
          selectedRowKeys: []
        }, () => {
          if (map) {
            map.un('singleclick', this.onMapSingleClick);
          }
        });
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
   * @param map The map to add the layer to.
   */
  initVectorLayer = (map: OlMap) => {
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
  };

  /**
   * Adds map event callbacks to highlight and select features in the map (if
   * given) on pointermove and singleclick. Hovered and selected features will
   * be highlighted and selected in the grid as well.
   *
   * @param map The map to register the handlers to.
   */
  initMapEventHandlers = (map: OlMap) => {
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
  };

  /**
   * Highlights the feature beneath the cursor on the map and in the grid.
   *
   * @param olEvt The ol event.
   */
  onMapPointerMove = (olEvt: OlMapBrowserEvent<MouseEvent>) => {
    const {
      map,
      features,
      highlightStyle,
      selectStyle
    } = this.props;

    const {
      selectedRowKeys
    } = this.state;

    const selectedFeatures = map.getFeaturesAtPixel(olEvt.pixel, {
      layerFilter: (layerCand: OlLayerBase) => layerCand === this._layer
    }) || [];

    features.forEach(feature => {
      const key = _kebabCase(this.props.keyFunction(feature));
      const sel = `.${this._rowClassName}.${this._rowKeyClassNamePrefix}${key}`;
      const el = document.querySelectorAll(sel)[0];
      if (el) {
        el.classList.remove(this._rowHoverClassName);
      }
      if (selectedRowKeys.includes(key)) {
        feature.setStyle(selectStyle);
      } else {
        feature.setStyle(null);
      }
    });

    selectedFeatures.forEach((feature: OlFeature<OlGeometry>) => {
      const key = _kebabCase(this.props.keyFunction(feature));
      const sel = `.${this._rowClassName}.${this._rowKeyClassNamePrefix}${key}`;
      const el = document.querySelectorAll(sel)[0];
      if (el) {
        el.classList.add(this._rowHoverClassName);
      }
      feature.setStyle(highlightStyle);
    });
  };

  /**
   * Selects the selected feature in the map and in the grid.
   *
   * @param olEvt The ol event.
   */
  onMapSingleClick = (olEvt: OlMapBrowserEvent<MouseEvent>) => {
    const {
      map,
      selectStyle
    } = this.props;

    const {
      selectedRowKeys
    } = this.state;

    const selectedFeatures = (map.getFeaturesAtPixel(olEvt.pixel, {
      layerFilter: (layerCand: OlLayerBase) => layerCand === this._layer
    }) || []) as OlFeature<OlGeometry>[];

    let rowKeys = [...selectedRowKeys];

    selectedFeatures.forEach(selectedFeature => {
      const key = this.props.keyFunction(selectedFeature);
      if (rowKeys.includes(key)) {
        rowKeys = rowKeys.filter(rowKey => rowKey !== key);
        selectedFeature.setStyle(null);
      } else {
        rowKeys.push(key);
        selectedFeature.setStyle(selectStyle);
      }
    });

    this.setState({
      selectedRowKeys: rowKeys
    });
  };

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
  };

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
  };

  /**
   * Returns the column definitions out of the attributes of the first
   * given feature.
   *
   * @return The column definitions.
   */
  getColumnDefs = () => {
    const {
      attributeBlacklist,
      features,
      columnDefs
    } = this.props;

    const columns = [];
    const feature = features[0];

    if (!(feature instanceof OlFeature)) {
      return columns;
    }

    const props = feature.getProperties();

    Object.keys(props).forEach(key => {
      if (attributeBlacklist.includes(key)) {
        return;
      }

      if (props[key] instanceof OlGeometry) {
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
  };

  /**
   * Returns the table row data from all of the given features.
   *
   * @return The table data.
   */
  getTableData = () => {
    const {
      features
    } = this.props;

    const data = [];

    features.forEach(feature => {
      const properties = feature.getProperties();
      const filtered = Object.keys(properties)
        .filter(key => !(properties[key] instanceof OlGeometry))
        .reduce((obj, key) => {
          obj[key] = properties[key];
          return obj;
        }, {});

      data.push({
        key: this.props.keyFunction(feature),
        ...filtered
      });
    });

    return data;
  };

  /**
   * Returns the correspondig feature for the given table row key.
   *
   * @param key The row key to obtain the feature from.
   * @return The feature candidate.
   */
  getFeatureFromRowKey = (key: number | string): OlFeature<OlGeometry> => {
    const {
      features,
      keyFunction
    } = this.props;

    const feature = features.filter(f => keyFunction(f) === key);

    return feature[0];
  };

  /**
   * Called on row click and zooms the the corresponding feature's extent.
   *
   * @param row The clicked row.
   */
  onRowClick = (row: any) => {
    const {
      onRowClick
    } = this.props;

    const feature = this.getFeatureFromRowKey(row.key);

    if (_isFunction(onRowClick)) {
      onRowClick(row, feature);
    }

    this.zoomToFeatures([feature]);
  };

  /**
   * Called on row mouseover and hightlights the corresponding feature's
   * geometry.
   *
   * @param row The highlighted row.
   */
  onRowMouseOver = (row: any) => {
    const {
      onRowMouseOver
    } = this.props;

    const feature = this.getFeatureFromRowKey(row.key);

    if (_isFunction(onRowMouseOver)) {
      onRowMouseOver(row, feature);
    }

    this.highlightFeatures([feature]);
  };

  /**
   * Called on mouseout and unhightlights any highlighted feature.
   *
   * @param row The unhighlighted row.
   */
  onRowMouseOut = (row: any) => {
    const {
      onRowMouseOut
    } = this.props;

    const feature = this.getFeatureFromRowKey(row.key);

    if (_isFunction(onRowMouseOut)) {
      onRowMouseOut(row, feature);
    }

    this.unhighlightFeatures([feature]);
  };

  /**
   * Fits the map's view to the extent of the passed features.
   *
   * @param features The features to zoom to.
   */
  zoomToFeatures = (features: OlFeature<OlGeometry>[]) => {
    const {
      map
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    const featGeometries = [];
    features.forEach(feature => {
      featGeometries.push(feature.getGeometry());
    });

    if (featGeometries.length > 0) {
      const geomCollection = new OlGeometryCollection(featGeometries);
      map.getView().fit(geomCollection.getExtent());
    }
  };

  /**
   * Highlights the given features in the map.
   *
   * @param highlightFeatures The features to highlight.
   */
  highlightFeatures = (highlightFeatures: OlFeature<OlGeometry>[]) => {
    const {
      map,
      highlightStyle
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    highlightFeatures.forEach(feature => feature.setStyle(highlightStyle));
  };

  /**
   * Unhighlights the given features in the map.
   *
   * @param unhighlightFeatures The features to unhighlight.
   */
  unhighlightFeatures = (unhighlightFeatures: OlFeature<OlGeometry>[]) => {
    const {
      map,
      selectStyle
    } = this.props;

    const {
      selectedRowKeys
    } = this.state;

    if (!(map instanceof OlMap)) {
      return;
    }

    unhighlightFeatures.forEach(feature => {
      const key = this.props.keyFunction(feature);
      if (selectedRowKeys.includes(key)) {
        feature.setStyle(selectStyle);
      } else {
        feature.setStyle(null);
      }
    });
  };

  /**
   * Sets the select style to the given features in the map.
   *
   * @param features The features to select.
   */
  selectFeatures = (features: OlFeature<OlGeometry>[]) => {
    const {
      map,
      selectStyle
    } = this.props;

    if (!(map instanceof OlMap)) {
      return;
    }

    features.forEach(feature => feature.setStyle(selectStyle));
  };

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
  };

  /**
   * Called if the selection changes.
   *
   * @param selectedRowKeys The list of currently selected row keys.
   */
  onSelectChange = (selectedRowKeys: string[]) => {
    const {
      onRowSelectionChange
    } = this.props;

    const selectedFeatures = selectedRowKeys.map(key => this.getFeatureFromRowKey(key));

    if (_isFunction(onRowSelectionChange)) {
      onRowSelectionChange(selectedRowKeys, selectedFeatures);
    }

    this.resetFeatureStyles();
    this.selectFeatures(selectedFeatures);
    this.setState({ selectedRowKeys });
  };

  /**
   * The render method.
   */
  render() {
    const {
      className,
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

    const {
      selectedRowKeys
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const finalClassName = className
      ? `${className} ${this._className}`
      : this._className;

    let rowClassNameFn: (record: any) => string;
    if (_isFunction(rowClassName)) {
      rowClassNameFn = record => `${this._rowClassName} ${(rowClassName as ((record: any) => string))(record)}`;
    } else {
      const finalRowClassName = rowClassName
        ? `${rowClassName} ${this._rowClassName}`
        : this._rowClassName;
      rowClassNameFn = record => `${finalRowClassName} ${this._rowKeyClassNamePrefix}${_kebabCase(record.key)}`;
    }

    return (
      <Table
        className={finalClassName}
        columns={this.getColumnDefs()}
        dataSource={this.getTableData()}
        onRow={record => ({
          onClick: () => this.onRowClick(record),
          onMouseOver: () => this.onRowMouseOver(record),
          onMouseOut: () => this.onRowMouseOut(record)
        })}
        rowClassName={rowClassNameFn}
        rowSelection={selectable ? rowSelection : null}
        {...passThroughProps}
      >
        {children}
      </Table>
    );
  }
}

export default FeatureGrid;

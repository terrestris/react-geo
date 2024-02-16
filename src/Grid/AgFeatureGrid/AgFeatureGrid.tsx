/* eslint-disable testing-library/render-result-naming-convention */
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import {
  CellMouseOutEvent,
  CellMouseOverEvent,
  DetailGridInfo,
  RowClickedEvent,
  RowNode,
  SelectionChangedEvent
} from 'ag-grid-community';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import _differenceWith from 'lodash/differenceWith';
import _isArray from 'lodash/isArray';
import _isEqual from 'lodash/isEqual';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import { getUid } from 'ol';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import OlGeomGeometryCollection from 'ol/geom/GeometryCollection';
import OlLayerBase from 'ol/layer/Base';
import OlLayerVector from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import OlSourceVector from 'ol/source/Vector';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleFill from 'ol/style/Fill';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyle from 'ol/style/Style';
import * as React from 'react';
import { Key } from 'react';

import { CSS_PREFIX } from '../../constants';

interface OwnProps {
  /**
   * The height of the grid.
   */
  height: number | string;
  /**
   * The theme to use for the grid. See
   * https://www.ag-grid.com/javascript-grid-styling/ for available options.
   * Note: CSS must be loaded to use the theme!
   */
  theme: string;
  /**
   * The features to show in the grid and the map (if set).
   */
  features: OlFeature<OlGeometry>[];
  /**
   */
  attributeBlacklist: string[];
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
   */
  columnDefs: any;
  /**
   * A Function that creates the rowkey from the given feature.
   * Receives the feature as property.
   * Default is: feature => feature.ol_uid
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
  /**
   * The width of the grid.
   */
  width: number | string;
  /**
   * A CSS class which should be added to the table.
   */
  className?: string;
  /**
   * The map the features should be rendered on.
   */
  map: OlMap;
  /**
   * Custom row data to be shown in feature grid. This might be helpful if
   * original feature properties should be manipulated in some way before they
   * are represented in grid.
   * If provided, #getRowData method won't be called.
   */
  rowData?: any[];
  /**
   * Callback function, that will be called on rowclick.
   */
  onRowClick?: (row: any, feature: OlFeature<OlGeometry>, evt: RowClickedEvent) => void;
  /**
   * Callback function, that will be called on rowmouseover.
   */
  onRowMouseOver?: (row: any, feature: OlFeature<OlGeometry>, evt: CellMouseOverEvent) => void;
  /**
   * Callback function, that will be called on rowmouseout.
   */
  onRowMouseOut?: (row: any, feature: OlFeature<OlGeometry>, evt: CellMouseOutEvent) => void;
  /**
   * Callback function, that will be called if the selection changes.
   */
  onRowSelectionChange?: (
    selectedRowsAfter: any[],
    selectedFeatures: OlFeature<OlGeometry>[],
    deselectedRows: any[],
    deselectedFeatures: OlFeature<OlGeometry>[],
    evt: SelectionChangedEvent
  ) => void;
  /**
   * Optional callback function, that will be called if `selectable` is set
   * `true` and the a `click` event on the map occurs, e.g. a feature has been
   * selected in the map. The function receives the olEvt and the selected
   * features (if any).
   */
  onMapSingleClick?: (olEvt: OlMapBrowserEvent<MouseEvent>, selectedFeatures: OlFeature<OlGeometry>[]) => void;
  /*
   * A Function that is called once the grid is ready.
   */
  onGridIsReady?: (grid: any) => void;
}

interface AgFeatureGridState {
  grid: DetailGridInfo | null;
  selectedRows: RowNode[];
}

export type AgFeatureGridProps = OwnProps & AgGridReactProps;

/**
 * The AgFeatureGrid.
 *
 * @class The AgFeatureGrid
 * @extends React.Component
 */
export class AgFeatureGrid extends React.Component<AgFeatureGridProps, AgFeatureGridState> {

  /**
   * The default properties.
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
    keyFunction: getUid,
    zoomToExtent: false,
    selectable: false
  };

  /**
   * The reference of this grid.
   * @private
   */
  _ref: AgGridReact | null = null;

  /**
   * The className added to this component.
   * @private
   */
  _className = `${CSS_PREFIX}ag-feature-grid`;

  /**
   * The source holding the features of the grid.
   * @private
   */
  _source: OlSourceVector | null = null;

  /**
   * The layer representing the features of the grid.
   * @private
   */
  _layer: OlLayerVector<OlSourceVector> | null = null;

  /**
   * The constructor.
   */
  constructor(props: AgFeatureGridProps) {
    super(props);

    this.state = {
      grid: null,
      selectedRows: []
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

    if (!_isNil(map)) {
      this.initVectorLayer(map);
      this.initMapEventHandlers(map);
      if (zoomToExtent) {
        this.zoomToFeatures(features);
      }
    }

  }

  /**
   * Invoked immediately after updating occurs. This method is not called for
   * the initial render.
   *
   * @param prevProps The previous props.
   */
  componentDidUpdate(prevProps: AgFeatureGridProps) {
    const {
      map,
      features,
      selectable,
      zoomToExtent
    } = this.props;

    if (!(_isEqual(prevProps.map, map) && !_isNil(map))) {
      this.initVectorLayer(map!);
      this.initMapEventHandlers(map!);
    }

    if (!(_isEqual(prevProps.features, features))) {
      if (this._source) {
        this._source.clear();
        this._source.addFeatures(features);
      }

      if (zoomToExtent && !_isNil(map)) {
        this.zoomToFeatures(features);
      }
    }

    if (!(_isEqual(prevProps.selectable, selectable))) {
      if (selectable && map) {
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
    if (!_isNil(this.props.map)) {
      this.deinitVectorLayer();
      this.deinitMapEventHandlers();
    }
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

    if (MapUtil.getLayerByName(map, layerName)) {
      return;
    }

    const source = new OlSourceVector({
      features: features
    });

    const layer = new OlLayerVector({
      properties: {
        name: layerName,
      },
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
  onMapPointerMove = (olEvt: any) => {
    const {
      map,
      features,
      highlightStyle,
      selectStyle
    } = this.props;

    const {
      grid
    } = this.state;

    if (!grid || !grid.api || _isNil(map)) {
      return;
    }

    const selectedRowKeys = this.getSelectedRowKeys();

    const highlightFeatures = (map.getFeaturesAtPixel(olEvt.pixel, {
      layerFilter: layerCand => layerCand === this._layer
    }) || []) as OlFeature<OlGeometry>[];

    grid.api?.forEachNode((n) => {
      n.setHighlighted(null);
    });

    features
      .filter((f): f is OlFeature => !_isNil(f))
      .forEach(feature => {
        const key = this.props.keyFunction(feature);

        if (selectedRowKeys.includes(key)) {
          feature.setStyle(selectStyle);
        } else {
          feature.setStyle(undefined);
        }
      });

    highlightFeatures
      .filter((f): f is OlFeature => !_isNil(f))
      .forEach(feat => {
        const key = this.props.keyFunction(feat);
        grid.api?.forEachNode((n) => {
          if (n.data.key === key) {
            n.setHighlighted(1);
            feat.setStyle(highlightStyle);
          }
        });
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
      selectStyle,
      onMapSingleClick
    } = this.props;

    if (_isNil(map)) {
      return;
    }

    const selectedRowKeys = this.getSelectedRowKeys();

    const selectedFeatures = (map.getFeaturesAtPixel(olEvt.pixel, {
      layerFilter: (layerCand: OlLayerBase) => layerCand === this._layer
    }) || []) as OlFeature<OlGeometry>[];

    if (_isFunction(onMapSingleClick)) {
      onMapSingleClick(olEvt, selectedFeatures);
    }

    selectedFeatures.forEach(selectedFeature => {
      const key = this.props.keyFunction(selectedFeature);
      if (selectedRowKeys && selectedRowKeys.includes(key)) {
        selectedFeature.setStyle(undefined);

        const node = this.getRowFromFeatureKey(key);
        if (node) {
          node.setSelected(false);
        }
      } else {
        selectedFeature.setStyle(selectStyle);

        const node = this.getRowFromFeatureKey(key);
        if (node) {
          node.setSelected(true);
        }
      }
    });
  };

  /**
   * Removes the vector layer from the given map (if any).
   */
  deinitVectorLayer = () => {
    const {
      map
    } = this.props;

    if (_isNil(this._layer) || _isNil(map)) {
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

    if (!_isNil(map)) {
      map.un('pointermove', this.onMapPointerMove);

      if (selectable) {
        map.un('singleclick', this.onMapSingleClick);
      }
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
      columnDefs,
      selectable
    } = this.props;

    const columns: any[] = [];
    if (features.length < 1) {
      return;
    }

    const feature = features[0];

    const props = feature.getProperties();

    if (selectable) {
      columns.push({
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 28,
        pinned: 'left',
        lockPosition: true,
        suppressMenu: true,
        suppressSorting: true,
        suppressFilter: true,
        suppressResize: true,
        suppressMovable: true
      });
    }

    let index = -1;

    Object.keys(props).forEach(key => {
      if (attributeBlacklist.includes(key)) {
        return;
      }

      if (props[key] instanceof OlGeometry) {
        return;
      }

      if (columnDefs[key] && columnDefs[key].index !== undefined) {
        index = columnDefs[key].index;
      } else {
        ++index;
      }
      columns[index] = {
        headerName: key,
        field: key,
        ...columnDefs[key]
      };
    });

    return columns;
  };

  /**
   * Returns the table row data from all of the given features.
   *
   * @return The table data.
   */
  getRowData = () => {
    const {
      features
    } = this.props;

    return features.map(feature => {
      const properties = feature.getProperties();
      const filtered = Object.keys(properties)
        .filter(key => !(properties[key] instanceof OlGeometry))
        .reduce((obj: {[k: string]: any}, key) => {
          obj[key] = properties[key];
          return obj;
        }, {});

      return {
        key: this.props.keyFunction(feature),
        ...filtered
      };
    });
  };

  /**
   * Returns the corresponding feature for the given table row key.
   *
   * @param key The row key to obtain the feature from.
   * @return The feature candidate.
   */
  getFeatureFromRowKey = (key: Key): OlFeature<OlGeometry> => {
    const {
      features,
      keyFunction
    } = this.props;

    const feature = features.filter(f => keyFunction(f) === key);

    return feature[0];
  };

  /**
   * Returns the corresponding rowNode for the given feature id.
   *
   * @param key The feature's key to obtain the row from.
   * @return he row candidate.
   */
  getRowFromFeatureKey = (key: string): RowNode | undefined => {
    const {
      grid
    } = this.state;

    let rowNode: RowNode | undefined = undefined;

    if (!grid || !grid.api) {
      return;
    }

    grid.api.forEachNode((node: any) => {
      if (node.data.key === key) {
        rowNode = node;
      }
    });

    return rowNode;
  };

  /**
   * Returns the currently selected row keys.
   *
   * @return An array with the selected row keys.
   */
  getSelectedRowKeys = (): string[] => {
    const {
      grid
    } = this.state;

    if (!grid || !grid.api) {
      return [];
    }

    const selectedRows = grid.api.getSelectedRows();

    return selectedRows.map(row => row.key);
  };

  /**
   * Called on row click and zooms the the corresponding feature's extent.
   *
   * @param evt The RowClickedEvent.
   */
  onRowClick = (evt: RowClickedEvent) => {
    const {
      onRowClick
    } = this.props;

    const row = evt.data;
    const feature = this.getFeatureFromRowKey(row.key);

    if (_isFunction(onRowClick)) {
      onRowClick(row, feature, evt);
    } else {
      this.zoomToFeatures([feature]);
    }
  };

  /**
   * Called on row mouseover and hightlights the corresponding feature's
   * geometry.
   *
   * @param evt The ellMouseOverEvent.
   */
  onRowMouseOver = (evt: CellMouseOverEvent) => {
    const {
      onRowMouseOver
    } = this.props;

    const row = evt.data;
    const feature = this.getFeatureFromRowKey(row.key);

    if (_isFunction(onRowMouseOver)) {
      onRowMouseOver(row, feature, evt);
    }

    this.highlightFeatures([feature]);
  };

  /**
   * Called on mouseout and unhightlights any highlighted feature.
   *
   * @param evt The CellMouseOutEvent.
   */
  onRowMouseOut = (evt: CellMouseOutEvent) => {
    const {
      onRowMouseOut
    } = this.props;

    const row = evt.data;
    const feature = this.getFeatureFromRowKey(row.key);

    if (_isFunction(onRowMouseOut)) {
      onRowMouseOut(row, feature, evt);
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

    if (_isNil(map)) {
      return;
    }

    const featGeometries = features
      .map(f => f.getGeometry())
      .filter((f): f is OlGeometry => !_isNil(f));

    if (featGeometries.length > 0) {
      const geomCollection = new OlGeomGeometryCollection(featGeometries);
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
      highlightStyle
    } = this.props;

    highlightFeatures
      .filter((f): f is OlFeature => !_isNil(f))
      .forEach(feature => feature.setStyle(highlightStyle));
  };

  /**
   * Unhighlights the given features in the map.
   *
   * @param unhighlightFeatures The features to unhighlight.
   */
  unhighlightFeatures = (unhighlightFeatures: OlFeature<OlGeometry>[]) => {
    const {
      selectStyle
    } = this.props;
    const selectedRowKeys = this.getSelectedRowKeys();

    unhighlightFeatures
      .filter((f): f is OlFeature => !_isNil(f))
      .forEach(feature => {
        const key = this.props.keyFunction(feature);
        if (selectedRowKeys && selectedRowKeys.includes(key)) {
          feature.setStyle(selectStyle);
        } else {
          feature.setStyle(undefined);
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
      selectStyle
    } = this.props;

    features.forEach(feature => {
      if (feature) {
        feature.setStyle(selectStyle);
      }
    });
  };

  /**
   * Resets the style of all features.
   */
  resetFeatureStyles = () => {
    const {
      features
    } = this.props;

    features.forEach(feature => feature.setStyle(undefined));
  };

  /**
   * Called if the selection changes.
   */
  onSelectionChanged = (evt: SelectionChangedEvent) => {
    const {
      onRowSelectionChange
    } = this.props;

    const {
      grid,
      selectedRows
    } = this.state;

    let selectedRowsAfter: RowNode[];
    if (!grid || !grid.api) {
      selectedRowsAfter = evt.api.getSelectedRows();
    } else {
      selectedRowsAfter = grid.api.getSelectedRows();
    }

    const deselectedRows = _differenceWith(selectedRows,
      selectedRowsAfter, (a: RowNode, b: RowNode) => a.key === b.key);

    const selectedFeatures = selectedRowsAfter.flatMap(row => {
      return row.key ? [this.getFeatureFromRowKey(row.key)] : [];
    });
    const deselectedFeatures = deselectedRows.flatMap(row => {
      return row.key ? [this.getFeatureFromRowKey(row.key)] : [];
    });

    // update state
    this.setState({
      selectedRows: selectedRowsAfter
    });

    if (_isFunction(onRowSelectionChange)) {
      onRowSelectionChange(selectedRowsAfter, selectedFeatures, deselectedRows, deselectedFeatures, evt);
    }

    this.resetFeatureStyles();
    this.selectFeatures(selectedFeatures);
  };

  /**
   *
   * @param grid
   */
  onGridReady(grid: any) {
    this.setState({
      grid
    }, this.onVisiblityChange);

    if (this.props.onGridIsReady) {
      this.props.onGridIsReady(grid);
    }
  }

  /**
   *
   */
  onVisiblityChange() {
    if (this.state.grid) {
      this.state.grid.api?.sizeColumnsToFit();
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
      rowData,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this._className} ${theme}`
      : `${this._className} ${theme}`;

    return (
      <div
        className={finalClassName}
        // TODO: move to less?!
        style={{
          height: height,
          width: width
        }}
      >
        <AgGridReact
          columnDefs={columnDefs && _isArray(columnDefs) ? columnDefs : this.getColumnDefs()}
          rowData={rowData && _isArray(rowData) ? rowData : this.getRowData()}
          onGridReady={this.onGridReady.bind(this)}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          onSelectionChanged={this.onSelectionChanged.bind(this)}
          onRowClicked={this.onRowClick.bind(this)}
          onCellMouseOver={this.onRowMouseOver.bind(this)}
          onCellMouseOut={this.onRowMouseOut.bind(this)}
          ref={ref => this._ref = ref}
          {...passThroughProps}
        >
          {children}
        </AgGridReact>
      </div>
    );
  }
}

export default AgFeatureGrid;

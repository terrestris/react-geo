import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-balham.css';

import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import useOlLayer from '@terrestris/react-util/dist/Hooks/useOlLayer/useOlLayer';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import {
  CellMouseOutEvent,
  CellMouseOverEvent,
  ColDef,
  ColDefField,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  RowClassParams,
  RowClickedEvent,
  RowNode,
  RowStyle,
  SelectionChangedEvent
} from '@ag-grid-community/core';
import {
  AgGridReact,
  AgGridReactProps
} from '@ag-grid-community/react';
import _differenceWith from 'lodash/differenceWith';
import _has from 'lodash/has';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import _isNumber from 'lodash/isNumber';
import _isString from 'lodash/isString';
import { getUid } from 'ol';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import OlLayerBase from 'ol/layer/Base';
import OlLayerVector from 'ol/layer/Vector';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import OlSourceVector from 'ol/source/Vector';
import React, { Key, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import { CSS_PREFIX } from '../../constants';
import {
  defaultFeatureGridLayerName,
  defaultFeatureStyle,
  defaultHighlightStyle,
  defaultSelectStyle,
  highlightFillColor,
  RgCommonGridProps
} from '../commonGrid';

export type WithKey<T> = {
  key: Key;
} & T;

interface OwnProps<T> {
  /**
   * The height of the grid.
   */
  height?: number | string;
  /**
   * The theme to use for the grid. See
   * https://www.ag-grid.com/javascript-grid-styling/ for available options.
   * Note: CSS must be loaded to use the theme!
   */
  theme?: string;
  /**
   * Custom column definitions to apply to the given column (mapping via key).
   */
  columnDefs?: (ColDef<WithKey<T>> | ColGroupDef<WithKey<T>>)[] | null;
  /**
   * The width of the grid.
   */
  width?: number | string;
  /**
   * Custom row data to be shown in feature grid. This might be helpful if
   * original feature properties should be manipulated in some way before they
   * are represented in grid.
   * If provided, #getRowData method won't be called.
   */
  rowData?: WithKey<T>[];
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
   * `true` and the `click` event on the map occurs, e.g. a feature has been
   * selected in the map. The function receives the olEvt and the selected
   * features (if any).
   */
  onMapSingleClick?: (olEvt: OlMapBrowserEvent<MouseEvent>, selectedFeatures: OlFeature<OlGeometry>[]) => void;
  /*
   * A Function that is called once the grid is ready.
   */
  onGridIsReady?: (gridReadyEvent: GridReadyEvent<WithKey<T>>) => void;
  /**
   * A custom rowStyle function (if used: row highlighting is overwritten)
   */
  rowStyleFn?: (params: RowClassParams<WithKey<T>>) => RowStyle | undefined;
}

const defaultClassName = `${CSS_PREFIX}ag-feature-grid`;

export type AgFeatureGridProps<T> = OwnProps<T> & RgCommonGridProps<T> & Omit<AgGridReactProps, 'theme'>;

ModuleRegistry.registerModules([
  ClientSideRowModelModule
]);

/**
 * The AgFeatureGrid.
 */
export function AgFeatureGrid<T>({
  attributeBlacklist = [],
  className,
  columnDefs,
  featureStyle = defaultFeatureStyle,
  features = [],
  height = 250,
  highlightStyle = defaultHighlightStyle,
  keyFunction = getUid,
  layerName = defaultFeatureGridLayerName,
  onGridIsReady = () => undefined,
  onMapSingleClick,
  onRowClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowSelectionChange,
  rowData,
  rowStyleFn,
  selectStyle = defaultSelectStyle,
  selectable = false,
  theme = 'ag-theme-balham',
  width,
  zoomToExtent = false,
  ...agGridPassThroughProps
}: AgFeatureGridProps<T>): ReactElement<AgFeatureGridProps<WithKey<T>>> | null {

  /**
   * The default properties.
   */

  const [gridApi, setGridApi] = useState<GridApi<WithKey<T>> | undefined>(undefined);
  const [selectedRows, setSelectedRows] = useState<WithKey<T>[]>([]);
  const [highlightedRows, setHighlightedRows] = useState<Key[]>([]);

  const map = useMap();

  const gridVectorLayer = useOlLayer(() => new OlLayerVector({
    properties: {
      name: layerName,
    },
    source: new OlSourceVector<OlFeature>({
      features
    }),
    style: featureStyle
  }), [features, layerName], true);

  const checkBoxColumnDefinition: ColDef<WithKey<T>> = useMemo(() => ({
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerName: '',
    lockPosition: true,
    pinned: 'left',
    suppressHeaderMenuButton: true,
    suppressMovable: true,
    width: 40
  }), []);

  /**
   * Returns the currently selected row keys.
   *
   * @return An array with the selected row keys.
   */
  const getSelectedRowKeys = useCallback((): Key[] => {
    if (_isNil(gridApi)) {
      return [];
    }

    const sr = gridApi.getSelectedRows();
    return sr.map(row => row.key);
  }, [gridApi]);

  /**
   * Returns the corresponding rowNode for the given feature id.
   *
   * @param key The feature's key to obtain the row from.
   * @return he row candidate.
   */
  const getRowFromFeatureKey = useCallback((key: Key): RowNode | undefined => {
    let rowNode: RowNode | undefined = undefined;

    gridApi?.forEachNode((node: any) => {
      if (node.data.key === key) {
        rowNode = node;
      }
    });

    return rowNode;
  }, [gridApi]);

  /**
   * Highlights the feature beneath the cursor on the map and in the grid.
   *
   * @param olEvt The ol event.
   */
  const onMapPointerMoveInner = useCallback((olEvt: any) => {

    if (_isNil(gridApi) || _isNil(map)) {
      return;
    }

    const selectedRowKeys = getSelectedRowKeys();

    const highlightedFeatureArray = (map.getFeaturesAtPixel(olEvt.pixel, {
      layerFilter: layerCand => layerCand === gridVectorLayer
    }) || []) as OlFeature<OlGeometry>[];

    setHighlightedRows([]);

    features
      .filter((f): f is OlFeature => !_isNil(f))
      .forEach(feature => {
        const key = keyFunction(feature);
        if (selectedRowKeys.includes(key)) {
          feature.setStyle(selectStyle);
        } else {
          feature.setStyle(undefined);
        }
      });

    const rowsToHighlight: Key[] = [];
    highlightedFeatureArray
      .filter((f): f is OlFeature => !_isNil(f))
      .forEach(feat => {
        const key = keyFunction(feat);
        gridApi?.forEachNode((n) => {
          if (n?.data?.key === key) {
            rowsToHighlight.push(n?.data?.key);
            feat.setStyle(highlightStyle);
          }
        });
      });
    setHighlightedRows(rowsToHighlight);
  }, [gridVectorLayer, features, getSelectedRowKeys, gridApi, highlightStyle, keyFunction, map, selectStyle]);

  const getRowStyle = useCallback((params: RowClassParams<WithKey<T>>): RowStyle | undefined => {
    if (!_isNil(rowStyleFn)) {
      return rowStyleFn(params);
    }

    if (!_isNil(params?.node?.data?.key) && highlightedRows?.includes(params?.node?.data?.key)) {
      return {
        backgroundColor: highlightFillColor
      };
    }

    return;
  }, [highlightedRows, rowStyleFn]);

  /**
   * Selects the selected feature in the map and in the grid.
   *
   * @param olEvt The ol event.
   */
  const onMapSingleClickInner = useCallback((olEvt: OlMapBrowserEvent<MouseEvent>) => {
    if (_isNil(map)) {
      return;
    }

    const selectedRowKeys = getSelectedRowKeys();

    const selectedFeatures = (map.getFeaturesAtPixel(olEvt.pixel, {
      layerFilter: (layerCand: OlLayerBase) => layerCand === gridVectorLayer
    }) || []) as OlFeature<OlGeometry>[];

    if (_isFunction(onMapSingleClick)) {
      onMapSingleClick(olEvt, selectedFeatures);
    }

    selectedFeatures.forEach(selectedFeature => {
      const key = keyFunction(selectedFeature);
      if (selectedRowKeys && selectedRowKeys.includes(key)) {
        selectedFeature.setStyle(undefined);

        const node = getRowFromFeatureKey(key);
        if (node) {
          node.setSelected(false);
        }
      } else {
        selectedFeature.setStyle(selectStyle);

        const node = getRowFromFeatureKey(key);
        if (node) {
          node.setSelected(true);
        }
      }
    });
  }, [gridVectorLayer, getRowFromFeatureKey, getSelectedRowKeys, keyFunction, map, onMapSingleClick, selectStyle]);

  /**
   * Returns the column definitions out of the attributes of the first
   * given feature.
   *
   * @return The column definitions.
   */
  const getColumnDefsFromFeature = useCallback((): ColDef<WithKey<T>>[] | undefined => {
    if (features.length < 1) {
      return;
    }
    const columns: ColDef<WithKey<T>>[] = [];
    // assumption: all features in array have the same structure
    const feature = features[0];
    const props = feature.getProperties();

    if (selectable) {
      // adds select checkbox column
      columns.push(checkBoxColumnDefinition);
    }

    const colDefsFromFeature = Object.keys(props).map((key: string): ColDef<WithKey<T>> | undefined => {
      if (attributeBlacklist.includes(key)) {
        return;
      }

      let filter;

      if (props[key] instanceof OlGeometry) {
        return;
      }
      if (_isNumber(props[key])) {
        filter = 'agNumberColumnFilter';
      }
      if (_isString(props[key])) {
        filter = 'agTextColumnFilter';
      }

      return {
        colId: key,
        field: key as ColDefField<WithKey<T>>,
        filter,
        headerName: key,
        minWidth: 50,
        resizable: true,
        sortable: true
      };
    });

    return [
      ...columns,
      ...(colDefsFromFeature.filter(c => !_isNil(c)) as ColDef<WithKey<T>>[])
    ];
  }, [attributeBlacklist, features, selectable, checkBoxColumnDefinition]);

  /**
   * Returns the table row data from all the given features.
   *
   * @return The table data.
   */
  const getRowData = useCallback((): WithKey<T>[] | undefined => {
    return features?.map((feature): WithKey<T> => {
      const properties = feature.getProperties();
      const filtered = Object.keys(properties)
        .filter(key => !(properties[key] instanceof OlGeometry))
        .reduce((obj: {[k: string]: any}, key) => {
          obj[key] = properties[key];
          return obj;
        }, {});

      return {
        key: keyFunction(feature),
        ...filtered
      } as WithKey<T>;
    });
  }, [features, keyFunction]);

  /**
   * Returns the corresponding feature for the given table row key.
   *
   * @param key The row key to obtain the feature from.
   * @return The feature candidate.
   */
  const getFeatureFromRowKey = (key: Key): OlFeature<OlGeometry> => {
    const feature = features.filter(f => keyFunction(f) === key);
    return feature[0];
  };

  /**
   * Called on row click and zooms the corresponding feature's extent.
   *
   * @param evt The RowClickedEvent.
   */
  const onRowClickInner = (evt: RowClickedEvent) => {
    const row = evt.data;
    const feature = getFeatureFromRowKey(row.key);

    if (_isFunction(onRowClick)) {
      onRowClick(row, feature, evt);
    } else {
      if (!_isNil(map)) {
        MapUtil.zoomToFeatures(map,[feature]);
      }
    }
  };

  /**
   * Called on row mouseover and hightlights the corresponding feature's
   * geometry.
   *
   * @param evt The ellMouseOverEvent.
   */
  const onRowMouseOverInner = (evt: CellMouseOverEvent) => {
    const row = evt.data;
    const feature = getFeatureFromRowKey(row.key);

    if (_isFunction(onRowMouseOver)) {
      onRowMouseOver(row, feature, evt);
    }

    highlightFeatures([feature]);
  };

  /**
   * Called on mouseout and unhightlights any highlighted feature.
   *
   * @param evt The CellMouseOutEvent.
   */
  const onRowMouseOutInner = (evt: CellMouseOutEvent) => {
    const row = evt.data;
    const feature = getFeatureFromRowKey(row.key);

    if (_isFunction(onRowMouseOut)) {
      onRowMouseOut(row, feature, evt);
    }

    unHighlightFeatures([feature]);
  };

  /**
   * Highlights the given features in the map.
   *
   * @param featureArray The features to highlight.
   */
  const highlightFeatures = (featureArray: OlFeature<OlGeometry>[]) => {
    featureArray
      .filter((f): f is OlFeature => !_isNil(f))
      .forEach(feature => feature.setStyle(highlightStyle));
  };

  /**
   * Un-highlights the given features in the map.
   *
   * @param featureArray The features to un-highlight.
   */
  const unHighlightFeatures = (featureArray: OlFeature<OlGeometry>[]) => {
    const selectedRowKeys = getSelectedRowKeys();

    featureArray
      .filter((f): f is OlFeature => !_isNil(f))
      .forEach(feature => {
        const key = keyFunction(feature);
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
   * @param featureArray The features to select.
   */
  const selectFeatures = (featureArray: OlFeature<OlGeometry>[]) => {
    featureArray.forEach(feature => {
      if (feature) {
        feature.setStyle(selectStyle);
      }
    });
  };

  /**
   * Resets the style of all features.
   */
  const resetFeatureStyles = () => {
    features.forEach(feature => feature.setStyle(undefined));
  };

  /**
   * Called if the selection changes.
   */
  const onSelectionChanged = (evt: SelectionChangedEvent) => {
    let selectedRowsAfter: WithKey<T>[];
    if (_isNil(gridApi)) {
      selectedRowsAfter = evt.api.getSelectedRows();
    } else {
      selectedRowsAfter = gridApi.getSelectedRows();
    }

    const deselectedRows = _differenceWith(selectedRows,
      selectedRowsAfter, (a, b) => a.key === b.key);

    const selectedFeatures = selectedRowsAfter.flatMap(row => {
      return row.key ? [getFeatureFromRowKey(row.key)] : [];
    });
    const deselectedFeatures = deselectedRows.flatMap(row => {
      return row.key ? [getFeatureFromRowKey(row.key)] : [];
    });

    // update state
    setSelectedRows(selectedRowsAfter);

    if (_isFunction(onRowSelectionChange)) {
      onRowSelectionChange(selectedRowsAfter, selectedFeatures, deselectedRows, deselectedFeatures, evt);
    }

    resetFeatureStyles();
    selectFeatures(selectedFeatures);
  };

  /**
   *
   * @param gridReadyEvent
   */
  const onGridReady = (gridReadyEvent: GridReadyEvent<WithKey<T>>) => {
    if (!_isNil(gridReadyEvent)) {
      setGridApi(gridReadyEvent?.api);
      onVisibilityChange();
      onGridIsReady(gridReadyEvent);
    }
  };

  const onVisibilityChange = () => gridApi?.sizeColumnsToFit();

  /**
   * Adds map event callbacks to highlight and select features in the map (if
   * given) on pointermove and single-click. Hovered and selected features will
   * be highlighted and selected in the grid as well.
   */
  useEffect(() => {
    if (!_isNil(map)) {
      map.on('pointermove', onMapPointerMoveInner);

      if (selectable) {
        map.on('singleclick', onMapSingleClickInner);
      }
    }

    return () => {
      if (!_isNil(map)) {
        map.un('pointermove', onMapPointerMoveInner);

        if (selectable) {
          map.un('singleclick', onMapSingleClickInner);
        }
      }
    };
  }, [onMapPointerMoveInner, onMapSingleClickInner, map, selectable]);

  useEffect(() => {
    if (!_isNil(features) && features.length > 0 && !_isNil(map) && zoomToExtent) {
      MapUtil.zoomToFeatures(map,features);
    }
  }, [features, map, zoomToExtent]);

  // TODO: move to less?
  const outerDivStyle = useMemo(() => ({
    height,
    width
  }), [width, height]);

  const colDefs = useMemo(() => {
    if (!_isNil(columnDefs)) {
      if (!selectable) {
        return columnDefs;
      }
      // check for checkbox column - if not present => add
      const checkboxSelectionPresent = columnDefs?.
        some((colDef: ColDef<WithKey<T>>) =>
          _has(colDef, 'checkboxSelection') && !_isNil(colDef.checkboxSelection)
        );
      if (checkboxSelectionPresent) {
        return columnDefs;
      }
      return [
        checkBoxColumnDefinition,
        ...columnDefs
      ];
    }
    return getColumnDefsFromFeature();
  }, [
    checkBoxColumnDefinition,
    columnDefs,
    getColumnDefsFromFeature,
    selectable
  ]);

  const passedRowData = useMemo(() => !_isNil(rowData) ? rowData : getRowData(), [
    rowData,
    getRowData
  ]);

  const finalClassName = className
    ? `${className} ${defaultClassName} ${theme}`
    : `${defaultClassName} ${theme}`;

  return (
    <div
      className={finalClassName}
      style={outerDivStyle}
    >
      <AgGridReact<WithKey<T>>
        columnDefs={colDefs}
        getRowStyle={getRowStyle}
        onCellMouseOut={onRowMouseOutInner}
        onCellMouseOver={onRowMouseOverInner}
        onGridReady={onGridReady}
        onRowClicked={onRowClickInner}
        onSelectionChanged={onSelectionChanged}
        rowData={passedRowData}
        rowSelection="multiple"
        suppressRowClickSelection
        {...agGridPassThroughProps}
      />
    </div>
  );

}

export default AgFeatureGrid;

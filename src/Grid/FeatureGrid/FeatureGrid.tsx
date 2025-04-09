import React, { createContext, Key, useCallback, useContext, useEffect, useState } from 'react';

import {
  closestCenter, DndContext, DragEndEvent, DragOverEvent, DragOverlay, PointerSensor,
  UniqueIdentifier, useSensor, useSensors
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';

import { Table } from 'antd';
import { AnyObject } from 'antd/lib/_util/type';
import { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import _has from 'lodash/has';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import _kebabCase from 'lodash/kebabCase';
import { getUid } from 'ol';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import OlGeometryCollection from 'ol/geom/GeometryCollection';
import OlLayerBase from 'ol/layer/Base';
import OlLayerVector from 'ol/layer/Vector';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import RenderFeature from 'ol/render/Feature';
import OlSourceVector from 'ol/source/Vector';

import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import useOlLayer from '@terrestris/react-util/dist/Hooks/useOlLayer/useOlLayer';

import { CSS_PREFIX } from '../../constants';
import {
  defaultFeatureGridLayerName,
  defaultFeatureStyle,
  defaultHighlightStyle,
  defaultSelectStyle,
  RgCommonGridProps
} from '../commonGrid';

interface HeaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

interface BodyCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

interface DragIndexState {
  active: UniqueIdentifier;
  over: UniqueIdentifier | undefined;
  direction?: 'left' | 'right';
}

interface OwnProps {
  /**
   * When active the order of the columns can be changed dynamically using drag & drop.
   */
  draggableColumns?: boolean;
  /**
   * Array of dataIndex names to filter
   */
  attributeFilter?: string[];
  onRowSelectionChange?: (selectedRowKeys: (number | string | bigint)[],
    selectedFeatures: OlFeature<OlGeometry>[]) => void;
}

export type FeatureGridProps<T extends AnyObject = AnyObject> = OwnProps & RgCommonGridProps<T> & TableProps<T>;

const defaultClassName = `${CSS_PREFIX}feature-grid`;

const defaultRowClassName = `${CSS_PREFIX}feature-grid-row`;

const rowKeyClassNamePrefix = 'row-key-';

const cellRowHoverClassName = 'ant-table-cell-row-hover';

const DragIndexContext = createContext<DragIndexState>({ active: -1, over: -1 });

const dragActiveStyle = (dragState: DragIndexState, id: string) => {
  const { active, over, direction } = dragState;
  // drag active style
  let style: React.CSSProperties = {};
  if (active && active === id) {
    style = { backgroundColor: 'gray', opacity: 0.5 };
  }
  // dragover dashed style
  else if (over && id === over && active !== over) {
    style =
      direction === 'right'
        ? { borderRight: '1px dashed gray' }
        : { borderLeft: '1px dashed gray' };
  }
  return style;
};

const TableBodyCell: React.FC<BodyCellProps> = (props) => {
  const dragState = useContext<DragIndexState>(DragIndexContext);
  return <td {...props} style={{ ...props.style, ...dragActiveStyle(dragState, props.id) }} />;
};

const TableHeaderCell: React.FC<HeaderCellProps> = (props) => {
  const dragState = useContext(DragIndexContext);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: props.id });
  const style: React.CSSProperties = {
    ...props.style,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999, userSelect: 'none' } : {}),
    ...dragActiveStyle(dragState, props.id),
  };
  return <th {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

export const FeatureGrid = <T extends AnyObject = AnyObject,>({
  attributeBlacklist,
  attributeFilter,
  children,
  className,
  columns,
  draggableColumns = false,
  featureStyle = defaultFeatureStyle,
  features,
  highlightStyle = defaultHighlightStyle,
  keyFunction = getUid,
  layerName = defaultFeatureGridLayerName,
  onRowClick: onRowClickProp,
  onRowMouseOut: onRowMouseOutProp,
  onRowMouseOver: onRowMouseOverProp,
  onRowSelectionChange,
  rowClassName,
  selectStyle = defaultSelectStyle,
  selectable = false,
  zoomToExtent = false,
  ...passThroughProps
}: FeatureGridProps<T>): React.ReactElement | null => {

  type InternalTableRecord = (T & { key?: string });
  type SortableItemId = UniqueIdentifier | { id: UniqueIdentifier };

  const initialColumns: ColumnType<T>[] = [];

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [dragIndex, setDragIndex] = useState<DragIndexState>({ active: -1, over: -1 });
  const [featureColumns, setFeatureColumns] = useState<ColumnType<T>[]>(initialColumns);
  const [columnDefinition, setColumnDefinition] = useState<ColumnsType<T>>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1
      }
    })
  );

  const map = useMap();

  const layer = useOlLayer(() => new OlLayerVector({
    properties: {
      name: layerName
    },
    source: new OlSourceVector({
      features: features
    }),
    style: featureStyle
  }), []);

  /**
   * Selects the selected feature in the map and in the grid.
   */
  const onMapSingleClick = useCallback((olEvt: OlMapBrowserEvent<PointerEvent | KeyboardEvent | WheelEvent>) => {
    if (!map) {
      return;
    }

    const selectedFeatures = (map.getFeaturesAtPixel(olEvt.pixel, {
      layerFilter: (layerCand: OlLayerBase) => layerCand === layer
    }) || []) as OlFeature<OlGeometry>[];

    let rowKeys = [...selectedRowKeys];

    selectedFeatures.forEach(selectedFeature => {
      const key = keyFunction(selectedFeature);
      if (rowKeys.includes(key)) {
        rowKeys = rowKeys.filter(rowKey => rowKey !== key);
        selectedFeature.setStyle(undefined);
      } else {
        rowKeys.push(key);
        selectedFeature.setStyle(selectStyle);
      }
    });

    setSelectedRowKeys(rowKeys);
  }, [keyFunction, layer, map, selectStyle, selectedRowKeys]);


  /**
   * Highlights the feature beneath the cursor on the map and in the grid.
   */
  const onMapPointerMove = useCallback((olEvt: OlMapBrowserEvent<PointerEvent | KeyboardEvent | WheelEvent>) => {
    if (!map) {
      return;
    }

    const selectedFeatures = map.getFeaturesAtPixel(olEvt.pixel, {
      layerFilter: (layerCand: OlLayerBase) => layerCand === layer
    }) || [];

    features?.forEach(feature => {
      const key = _kebabCase(keyFunction(feature));
      const sel = `.${defaultRowClassName}.${rowKeyClassNamePrefix}${key} > td`;
      const els = document.querySelectorAll(sel);
      els.forEach(el => el.classList.remove(cellRowHoverClassName));

      if (selectedRowKeys.includes(key)) {
        feature.setStyle(selectStyle);
      } else {
        feature.setStyle(undefined);
      }
    });

    selectedFeatures.forEach((feature: OlFeature<OlGeometry> | RenderFeature) => {
      if (feature instanceof RenderFeature) {
        return;
      }

      const key = _kebabCase(keyFunction(feature));
      const sel = `.${defaultRowClassName}.${rowKeyClassNamePrefix}${key} > td`;
      const els = document.querySelectorAll(sel);
      els.forEach(el => el.classList.add(cellRowHoverClassName));

      feature.setStyle(highlightStyle);
    });
  }, [features, highlightStyle, keyFunction, layer, map, selectStyle, selectedRowKeys]);

  /**
   * Fits the map's view to the extent of the passed features.
   */
  const zoomToFeatures = useCallback((feats: OlFeature<OlGeometry>[]) => {
    if (!map) {
      return;
    }

    const featGeometries = feats
      .map(f => f.getGeometry())
      .filter((f): f is OlGeometry => !_isNil(f));

    if (featGeometries.length > 0) {
      const geomCollection = new OlGeometryCollection(featGeometries);
      map.getView().fit(geomCollection.getExtent());
    }
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.on('pointermove', onMapPointerMove);

    if (selectable) {
      map.on('singleclick', onMapSingleClick);
    }

    if (zoomToExtent && features) {
      zoomToFeatures(features);
    }

    return () => {
      map.un('pointermove', onMapPointerMove);

      if (selectable) {
        map.un('singleclick', onMapSingleClick);
      }
    };
  }, [features, map, onMapPointerMove, onMapSingleClick, selectable, zoomToExtent, zoomToFeatures]);

  useEffect(() => {
    layer?.getSource()?.clear();
    if (!features) {
      return;
    }

    layer?.getSource()?.addFeatures(features);

    if (zoomToExtent) {
      zoomToFeatures(features);
    }
  }, [features, layer, zoomToExtent, zoomToFeatures]);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (selectable) {
      map.on('singleclick', onMapSingleClick);
    } else {
      map.un('singleclick', onMapSingleClick);
    }
  }, [map, onMapSingleClick, selectable]);

  /**
   * Returns the column definitions out of the attributes of the first
   * given feature.
  */
  useEffect(() => {
    const columnDefs: ColumnsType<T> = [];
    if (!features || features.length < 1) {
      return;
    }

    const feature = features[0];
    const props = feature?.getProperties();

    if (!props) {
      return;
    }

    let filter = attributeFilter;

    if (!filter) {
      filter = feature.getKeys().filter((attrName: string) => attrName !== 'geometry');
    }

    for (const key of filter) {
      if (!_has(props, key)) {
        continue;
      }

      if (attributeBlacklist?.includes(key)) {
        continue;
      }

      if (props[key] instanceof OlGeometry) {
        continue;
      }

      columnDefs.push({
        title: key,
        dataIndex: key,
        key: key,
        ...columns?.find(col => (col as ColumnType<InternalTableRecord>).dataIndex === key)
      });
    }

    setColumnDefinition(columnDefs);
  }, [columns, features, attributeFilter, attributeBlacklist]);

  useEffect(() => {
    const columnDefs = columnDefinition.map((column, i) => ({
      ...column,
      key: `${i}`,
      onHeaderCell: () => ({ id: `${i}` }),
      onCell: () => ({ id: `${i}` })
    }));
    setFeatureColumns(columnDefs);
  }, [columnDefinition]);

  /**
   * Returns the table row data from all the given features.
  */
  const getTableData = useCallback((): InternalTableRecord[] => {

    if (!features) {
      return [];
    }

    return features.map(feature => {
      const properties = feature.getProperties();
      const filtered: typeof properties = Object.keys(properties)
        .filter(key => !(properties[key] instanceof OlGeometry))
        .reduce((obj: Record<string, any>, key) => {
          obj[key] = properties[key];
          return obj;
        }, {});

      return {
        key: keyFunction(feature),
        ...filtered
      } as InternalTableRecord;
    });
  }, [features, keyFunction]);

  useEffect(() => {
    getTableData();
  }, [getTableData]);

  /**
   * Returns the correspondig feature for the given table row key.
   */
  const getFeatureFromRowKey = (key: number | string | bigint): OlFeature<OlGeometry> | null => {

    if (!features) {
      return null;
    }

    const feature = features.filter(f => keyFunction(f) === key);

    return feature[0];
  };

  /**
   * Called on row click and zooms the corresponding feature's extent.
   */
  const onRowClick = (row: InternalTableRecord) => {
    if (!row.key) {
      return;
    }

    const feature = getFeatureFromRowKey(row.key);

    if (!feature) {
      return;
    }

    if (_isFunction(onRowClickProp)) {
      onRowClickProp(row, feature);
    }

    zoomToFeatures([feature]);
  };

  /**
   * Called on row mouseover and hightlights the corresponding feature's
   * geometry.
   */
  const onRowMouseOver = (row: InternalTableRecord) => {
    if (!row.key) {
      return;
    }

    const feature = getFeatureFromRowKey(row.key);

    if (!feature) {
      return;
    }

    if (_isFunction(onRowMouseOverProp)) {
      onRowMouseOverProp(row, feature);
    }

    highlightFeatures([feature]);
  };

  /**
   * Called on mouseout and un-hightlights any highlighted feature.
   */
  const onRowMouseOut = (row: InternalTableRecord) => {
    if (!row.key) {
      return;
    }

    const feature = getFeatureFromRowKey(row.key);

    if (!feature) {
      return;
    }

    if (_isFunction(onRowMouseOutProp)) {
      onRowMouseOutProp(row, feature);
    }

    unhighlightFeatures([feature]);
  };

  /**
   * Highlights the given features in the map.
   */
  const highlightFeatures = (feats: OlFeature<OlGeometry>[]) => {
    if (!map) {
      return;
    }

    feats.forEach(feature => feature.setStyle(highlightStyle));
  };

  /**
   * Unhighlights the given features in the map.
   */
  const unhighlightFeatures = (feats: OlFeature<OlGeometry>[]) => {
    if (!map) {
      return;
    }

    feats.forEach(feature => {
      const key = keyFunction(feature);
      if (selectedRowKeys.includes(key)) {
        feature.setStyle(selectStyle);
      } else {
        feature.setStyle(undefined);
      }
    });
  };

  /**
   * Sets the select style to the given features in the map.
   *
   * @param feats
   */
  const selectFeatures = (feats: OlFeature<OlGeometry>[]) => {
    if (!map) {
      return;
    }

    feats.forEach(feat => feat.setStyle(selectStyle));
  };

  /**
   * Resets the style of all features.
   */
  const resetFeatureStyles = () => {
    if (!map) {
      return;
    }

    features?.forEach(feature => feature.setStyle(undefined));
  };

  /**
   * Called if the selection changes.
   */
  const onSelectChange = (rowKeys: Key[]) => {
    const selectedFeatures = rowKeys
      .map(key => getFeatureFromRowKey(key))
      .filter(feat => feat) as OlFeature<OlGeometry>[];

    if (selectedFeatures.length === 0 ) {
      return;
    }

    if (_isFunction(onRowSelectionChange)) {
      onRowSelectionChange(rowKeys, selectedFeatures);
    }

    resetFeatureStyles();
    selectFeatures(selectedFeatures);
    setSelectedRowKeys(rowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const finalClassName = className
    ? `${className} ${defaultClassName}`
    : defaultClassName;

  let rowClassNameFn: (record: InternalTableRecord) => string;
  if (_isFunction(rowClassName)) {
    const rwcFn = rowClassName as ((r: InternalTableRecord) => string);
    rowClassNameFn = record => `${defaultRowClassName} ${rwcFn(record)}`;
  } else {
    const finalRowClassName = rowClassName
      ? `${rowClassName} ${defaultRowClassName}`
      : defaultRowClassName;
    rowClassNameFn = record => `${finalRowClassName} ${rowKeyClassNamePrefix}${_kebabCase(record.key)}`;
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setFeatureColumns((prevState) => {
        const activeIndex = prevState.findIndex((i) => i.key === active?.id);
        const overIndex = prevState.findIndex((i) => i.key === over?.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
    setDragIndex({ active: -1, over: -1 });
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const activeIndex = featureColumns.findIndex((i) => i.key === active.id);
    const overIndex = featureColumns.findIndex((i) => i.key === over?.id);
    setDragIndex({
      active: active.id,
      over: over?.id,
      direction: overIndex > activeIndex ? 'right' : 'left'
    });
  };

  const convertKeysToIdentifiers = (keys: (Key | undefined)[]): SortableItemId[] => {
    return keys.map(key => {
      if (key === undefined) {
        return { id: 'defaultId' };
      } else if (typeof key === 'bigint') {
        return { id: key.toString() };
      } else if (typeof key === 'number' || typeof key === 'string') {
        return { id: key };
      } else {
        return key;
      }
    });
  };

  const draggableComponents = {
    header: { cell: TableHeaderCell },
    body: { cell: TableBodyCell }
  };

  const table = (
    <Table
      className={finalClassName}
      columns={featureColumns}
      dataSource={getTableData()}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        onMouseOver: () => onRowMouseOver(record),
        onMouseOut: () => onRowMouseOut(record)
      })}
      rowClassName={rowClassNameFn}
      rowSelection={selectable ? rowSelection : undefined}
      components={draggableColumns ? draggableComponents : undefined}
      {...passThroughProps}
    >
      {children}
    </Table>
  );

  return draggableColumns ? (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      collisionDetection={closestCenter}
    >
      <SortableContext items={convertKeysToIdentifiers(featureColumns.map((i) => i.key))}
        strategy={horizontalListSortingStrategy}
      >
        <DragIndexContext.Provider value={dragIndex}>
          {table}
        </DragIndexContext.Provider>
      </SortableContext>
      <DragOverlay>
        <th style={{ backgroundColor: 'gray', padding: 16 }}>
          {featureColumns[featureColumns.findIndex((i) => i.key === dragIndex.active)]?.title as React.ReactNode}
        </th>
      </DragOverlay>
    </DndContext>
  ) : (
    table
  );
};

export default FeatureGrid;

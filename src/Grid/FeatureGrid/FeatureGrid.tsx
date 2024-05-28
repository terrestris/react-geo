import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import useOlLayer from '@terrestris/react-util/dist/Hooks/useOlLayer/useOlLayer';
import { Table } from 'antd';
import { AnyObject } from 'antd/lib/_util/type';
import { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
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
import React, { Key, useCallback, useEffect, useState } from 'react';

import { CSS_PREFIX } from '../../constants';
import {
  defaultFeatureGridLayerName,
  defaultFeatureStyle,
  defaultHighlightStyle,
  defaultSelectStyle,
  RgCommonGridProps
} from '../commonGrid';

type OwnProps = {
  onRowSelectionChange?: (selectedRowKeys: Array<number | string | bigint>,
    selectedFeatures: OlFeature<OlGeometry>[]) => void;
};

export type FeatureGridProps<T extends AnyObject = AnyObject> = OwnProps & RgCommonGridProps<T> & TableProps<T>;

const defaultClassName = `${CSS_PREFIX}feature-grid`;

const defaultRowClassName = `${CSS_PREFIX}feature-grid-row`;

const rowKeyClassNamePrefix = 'row-key-';

const cellRowHoverClassName = 'ant-table-cell-row-hover';

export const FeatureGrid = <T extends AnyObject = AnyObject,>({
  attributeBlacklist = [],
  children,
  className,
  columns,
  featureStyle = defaultFeatureStyle,
  features = [],
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

  type InternalTableRecord = (T & {key?: string});

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

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
  const onMapSingleClick = useCallback((olEvt: OlMapBrowserEvent<MouseEvent>) => {
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
  const onMapPointerMove = useCallback((olEvt: OlMapBrowserEvent<MouseEvent>) => {
    if (!map) {
      return;
    }

    const selectedFeatures = map.getFeaturesAtPixel(olEvt.pixel, {
      layerFilter: (layerCand: OlLayerBase) => layerCand === layer
    }) || [];

    features.forEach(feature => {
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

    selectedFeatures.forEach((feature: OlFeature<OlGeometry>|RenderFeature) => {
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

    if (zoomToExtent) {
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
  const getColumnDefs = () => {
    const columnDefs: ColumnsType<T> = [];
    if (features.length < 1) {
      return;
    }

    const feature = features[0];

    const props = feature.getProperties();

    Object.keys(props).forEach(key => {
      if (attributeBlacklist.includes(key)) {
        return;
      }

      if (props[key] instanceof OlGeometry) {
        return;
      }

      columnDefs.push({
        title: key,
        dataIndex: key,
        key: key,
        ...columns?.find(col => (col as ColumnType<InternalTableRecord>).dataIndex === key)
      });
    });

    return columnDefs;
  };

  /**
   * Returns the table row data from all the given features.
   */
  const getTableData = (): InternalTableRecord[] => {
    return features.map(feature => {
      const properties = feature.getProperties();
      const filtered: typeof properties = Object.keys(properties)
        .filter(key => !(properties[key] instanceof OlGeometry))
        .reduce((obj: {[k: string]: any}, key) => {
          obj[key] = properties[key];
          return obj;
        }, {});

      return {
        key: keyFunction(feature),
        ...filtered
      } as InternalTableRecord;
    });
  };

  /**
   * Returns the correspondig feature for the given table row key.
   */
  const getFeatureFromRowKey = (key: number | string | bigint): OlFeature<OlGeometry> => {
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

    features.forEach(feature => feature.setStyle(undefined));
  };

  /**
   * Called if the selection changes.
   */
  const onSelectChange = (rowKeys: Key[]) => {
    const selectedFeatures = rowKeys.map(key => getFeatureFromRowKey(key));

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

  return (
    <Table
      className={finalClassName}
      columns={getColumnDefs()}
      dataSource={getTableData()}
      onRow={(record: InternalTableRecord) => ({
        onClick: () => onRowClick(record),
        onMouseOver: () => onRowMouseOver(record),
        onMouseOut: () => onRowMouseOut(record)
      })}
      rowClassName={rowClassNameFn}
      rowSelection={selectable ? rowSelection : undefined}
      {...passThroughProps}
    >
      {children}
    </Table>
  );
};

export default FeatureGrid;

import './LayerTree.less';

import React, { Key, useCallback, useEffect, useState } from 'react';

import {
  Tree,
  TreeDataNode
} from 'antd';

import {
  BasicDataNode,
  DataNode,
  TreeProps
} from 'antd/lib/tree';
import _isFunction from 'lodash/isFunction';
import { getUid } from 'ol';
import { EventsKey as OlEventsKey } from 'ol/events';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import { unByKey } from 'ol/Observable';
import { NodeDragEventParams } from 'rc-tree/lib/contextTypes';
import { EventDataNode } from 'rc-tree/lib/interface';
import { AllowDropOptions, CheckInfo } from 'rc-tree/lib/Tree';

import Logger from '@terrestris/base-util/dist/Logger';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';


import { CSS_PREFIX } from '../constants';

interface OwnProps {
  /**
   * An optional array-filter function that is applied to every layer and
   * subLayer. Return false to exclude this layer from the layerTree or true
   * to include it.
   *
   * Compare MDN Docs for Array.prototype.filter: https://mdn.io/array/filter
   */
  filterFunction?: (value: OlLayerBase, index: number, array: OlLayerBase[]) => boolean;

  /**
   * A LayerGroup the Tree should handle.
   */
  layerGroup?: OlLayerGroup;

  /**
   * A function that can be used to pass a custom node title. It can return
   * any renderable element (String, Number, Element etc.) and receives
   * the layer instance of the current tree node. Please note: If you want
   * to use draggable components in this element, you will have to stop
   * drag events on these elements by setting `onDragStart`.
   *
   * See https://github.com/terrestris/react-geo/pull/4155
   */
  nodeTitleRenderer?: (layer: OlLayerBase) => React.ReactNode;

  /**
   * Callback function that will be called if the selection changes.
   */
  onLayerVisibilityChanged?: (layer: OlLayerBase, checked: boolean) => void;
}

const defaultClassName = `${CSS_PREFIX}layertree`;

export type LayerTreeProps<T extends BasicDataNode = DataNode> = OwnProps & TreeProps<T>;

const LayerTree: React.FC<LayerTreeProps> = ({
  className,
  layerGroup,
  nodeTitleRenderer,
  filterFunction,
  onLayerVisibilityChanged,
  checkable = true,
  draggable = true,
  ...passThroughProps
}) => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);

  const map = useMap();

  const getVisibleLayerKeys = useCallback(() => {
    if (!map) {
      return [];
    }

    const lGroup = layerGroup ? MapUtil.getAllLayers(layerGroup) : MapUtil.getAllLayers(map);

    let visibleLayers = lGroup
      .filter(layer => !(layer instanceof OlLayerGroup) && layer.getVisible());

    if (filterFunction) {
      visibleLayers = visibleLayers.filter(filterFunction);
    }

    return visibleLayers.map(getUid);
  }, [filterFunction, layerGroup, map]);

  const getTreeNodeTitle = useCallback((layer: OlLayerBase) => {
    if (_isFunction(nodeTitleRenderer)) {
      return nodeTitleRenderer(layer);
    } else {
      return layer.get('name');
    }
  }, [nodeTitleRenderer]);

  const treeNodeFromLayer = useCallback((layer: OlLayerBase) => {
    if (!map) {
      return;
    }

    let childNodes: TreeDataNode[]|undefined = undefined;

    if (filterFunction && [layer].filter(filterFunction).length === 0) {
      return;
    }

    if (layer instanceof OlLayerGroup) {
      let childLayers = layer.getLayers().getArray();
      if (filterFunction) {
        childLayers = childLayers.filter(filterFunction);
      }
      childNodes = childLayers
        .map(childLayer => treeNodeFromLayer(childLayer))
        .filter(childLayer => childLayer !== undefined)
        .toReversed() as TreeDataNode[];
    }

    return {
      key: getUid(layer),
      title: (
        <div
          draggable={true}
          onClick={e => e.stopPropagation()}
        >
          {getTreeNodeTitle(layer)}
        </div>
      ),
      className: MapUtil.layerInResolutionRange(layer, map) ? '' : 'out-of-range',
      // Required to identify a group layer/node.
      children: childNodes
    } as TreeDataNode;
  }, [map, getTreeNodeTitle, filterFunction]);

  const treeNodesFromLayerGroup = useCallback(() => {
    if (!map) {
      return [];
    }

    const lGroup = layerGroup ?? map.getLayerGroup();

    return lGroup.getLayers().getArray()
      .map(l => treeNodeFromLayer(l))
      .filter(n => n !== undefined)
      .toReversed() as TreeDataNode[];
  }, [layerGroup, map, treeNodeFromLayer]);

  const onChangeResolution = useCallback(() => {
    setTreeData(treeNodesFromLayerGroup());
  }, [treeNodesFromLayerGroup]);

  const setLayerVisibility = useCallback((layer: OlLayerBase, visible: boolean) => {
    if (layer instanceof OlLayerGroup) {
      layer.getLayers().forEach(subLayer => {
        setLayerVisibility(subLayer, visible);
      });
    } else {
      layer.setVisible(visible);
    }
  }, []);

  const updateCheckedKeys = useCallback(() => {
    setCheckedKeys(getVisibleLayerKeys());
  }, [getVisibleLayerKeys]);

  const updateTree = useCallback(() => {
    setTreeData(treeNodesFromLayerGroup());
    updateCheckedKeys();
  }, [updateCheckedKeys, treeNodesFromLayerGroup]);

  useEffect(() => {
    updateTree();
  }, [updateTree]);

  const registerLayerListeners = useCallback((layer: OlLayerBase): OlEventsKey[] => {
    if (filterFunction && [layer].filter(filterFunction).length === 0) {
      return [];
    }

    const keys: OlEventsKey[] = [];

    keys.push(layer.on('propertychange', updateTree));

    if (layer instanceof OlLayerGroup) {
      const layerCollection = layer.getLayers();

      keys.push(layerCollection.on('add', updateTree));
      keys.push(layerCollection.on('remove', updateTree));
      keys.push(layer.on('change:layers', updateTree));

      for (const lay of layerCollection.getArray()) {
        keys.push(...registerLayerListeners(lay));
      }
    } else {
      keys.push(layer.on('change:visible', updateCheckedKeys));
    }
    return keys;
  }, [filterFunction, updateTree, updateCheckedKeys]);

  const registerAllLayerListeners = useCallback((): OlEventsKey[] => {
    if (!map) {
      return [];
    }

    const lGroup = layerGroup ?? map.getLayerGroup();

    return registerLayerListeners(lGroup);

  }, [layerGroup, map, registerLayerListeners]);

  // Reregister all layer listeners if the treeData changes, this is e.g. required if a layer becomes
  // a child of a layer group that isn't part of the treeData yet.
  useEffect(() => {
    const keys = registerAllLayerListeners();
    return () => {
      unByKey(keys);
    };
  }, [treeData, registerAllLayerListeners]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const key = map.getView().on('change:resolution', onChangeResolution);

    return () => {
      unByKey(key);
    };
  }, [map, onChangeResolution]);

  const onCheck = useCallback((_: any, info: CheckInfo<TreeDataNode>) => {
    if (!map) {
      return;
    }

    const key = info.node.key as string;
    const checked = info.checked;

    if (!key) {
      return;
    }

    const layer = MapUtil.getLayerByOlUid(map, key);

    if (!layer) {
      Logger.error('Layer is not defined');
      return;
    }

    setLayerVisibility(layer, checked);

    if (_isFunction(onLayerVisibilityChanged)) {
      onLayerVisibilityChanged(layer, checked);
    }
  }, [map, setLayerVisibility, onLayerVisibilityChanged]);

  const onDrop = useCallback((info: NodeDragEventParams<DataNode> & {
    dragNode: EventDataNode<DataNode>;
    dragNodesKeys: Key[];
    dropPosition: number;
    dropToGap: boolean;
  }) => {
    const dropKey = info.node.key as string;
    const dragKey = info.dragNode.key as string;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition;
    // The drop position relative to the drop node, inside 0, top -1, bottom 1.
    const dropPositionRelative = dropPosition - parseInt(dropPos[dropPos.length - 1], 10);

    // Reorder layers
    if (!map) {
      return;
    }

    const dragLayer = MapUtil.getLayerByOlUid(map, dragKey);
    if (!dragLayer) {
      Logger.error('dragLayer is not defined');
      return;
    }

    const dropLayer = MapUtil.getLayerByOlUid(map, dropKey);
    if (!dropLayer) {
      Logger.error('dropLayer is not defined');
      return;
    }

    const dragInfo = MapUtil.getLayerPositionInfo(dragLayer, map);
    if (!dragInfo || !dragInfo?.groupLayer) {
      return;
    }

    const dropInfo = MapUtil.getLayerPositionInfo(dropLayer, map);
    if (!dropInfo || !dropInfo?.groupLayer) {
      return;
    }

    const dragCollection = dragInfo.groupLayer.getLayers();
    const dropCollection = dropInfo.groupLayer.getLayers();

    dragCollection.remove(dragLayer);

    const dropLayerIndex = dropCollection.getArray().findIndex(l => l === dropLayer);

    // Drop on the top of the drop node/layer.
    if (dropPositionRelative === -1) {
      if (dropPosition === dropCollection.getLength() - 1) {
        dropCollection.push(dragLayer);
      } else {
        dropCollection.insertAt(dropLayerIndex + 1, dragLayer);
      }
    // Drop on node (= to a layer group).
    } else if (dropPositionRelative === 0) {
      if (dropLayer instanceof OlLayerGroup) {
        dropLayer.getLayers().push(dragLayer);
      }
    // Drop on the bottom of the drop node/layer.
    } else if (dropPositionRelative === 1) {
      dropCollection.insertAt(dropLayerIndex, dragLayer);
    }
  }, [map]);

  const allowDrop = useCallback((options: AllowDropOptions<TreeDataNode>) => {
    const dropNode = options.dropNode;
    const dropPositionRelative = options.dropPosition;

    // Don't allow dropping on a layer node.
    return !(dropPositionRelative === 0 && !dropNode.children);
  }, []);

  const finalClassName = className
    ? `${className} ${defaultClassName}`
    : defaultClassName;

  return (
    <Tree
      className={finalClassName}
      checkedKeys={checkedKeys}
      onCheck={onCheck}
      onDrop={onDrop}
      allowDrop={allowDrop}
      selectable={false}
      checkable={checkable}
      draggable={draggable}
      treeData={treeData}
      {...passThroughProps}
    />
  );
};

export default LayerTree;

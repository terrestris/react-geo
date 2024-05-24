import './LayerTree.less';

import Logger from '@terrestris/base-util/dist/Logger';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import {
  Tree,
  TreeDataNode
} from 'antd';
import {
  BasicDataNode,
  DataNode,
  TreeProps} from 'antd/lib/tree';
import _isEqual from 'lodash/isEqual';
import _isFunction from 'lodash/isFunction';
import _isNumber from 'lodash/isNumber';
import { getUid } from 'ol';
import {
  EventsKey as OlEventsKey,
} from 'ol/events';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import {
  unByKey
} from 'ol/Observable';
import {
  NodeDragEventParams
} from 'rc-tree/lib/contextTypes';
import {
  EventDataNode
} from 'rc-tree/lib/interface';
import {
  AllowDropOptions,
  CheckInfo
} from 'rc-tree/lib/Tree';
import React, {
  Key,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

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
   * the layer instance of the current tree node.
   */
  nodeTitleRenderer?: (layer: OlLayerBase) => React.ReactNode;
}

const defaultClassName = `${CSS_PREFIX}layertree`;

export type LayerTreeProps<T extends BasicDataNode = DataNode> = OwnProps & TreeProps<T>;

const LayerTree: React.FC<LayerTreeProps> = ({
  className,
  layerGroup,
  nodeTitleRenderer,
  filterFunction,
  checkable = true,
  draggable = true,
  ...passThroughProps
}) => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);

  const olListenerKeys = useRef<OlEventsKey[]>([]);

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

    const visibleKeys = visibleLayers.map(getUid);

    return visibleKeys;
  }, [filterFunction, layerGroup, map]);

  const getTreeNodeTitle = useCallback((layer: OlLayerBase) => {
    if (_isFunction(nodeTitleRenderer)) {
      return nodeTitleRenderer(layer);
    } else {
      return layer.get('name');
    }
  }, [nodeTitleRenderer]);

  const hasListener = useCallback((key: OlEventsKey) => {
    return olListenerKeys.current.some(listenerKey => {
      return listenerKey.target === key.target
        && listenerKey.type === key.type
        && listenerKey.listener === key.listener;
    });
  }, []);

  const treeNodeFromLayer = useCallback((layer: OlLayerBase) => {
    if (!map) {
      return;
    }

    let childNodes: TreeDataNode[] = [];

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
      title: getTreeNodeTitle(layer),
      className: MapUtil.layerInResolutionRange(layer, map) ? '' : 'out-of-range',
      // Required to identify a group layer/node.
      children: layer instanceof OlLayerGroup ? childNodes : undefined
    } as TreeDataNode;
  }, [map, getTreeNodeTitle, filterFunction]);

  const treeNodesFromLayerGroup = useCallback(() => {
    if (!map) {
      return [];
    }

    const lGroup = layerGroup ? layerGroup : map.getLayerGroup();

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

  const updateTreeNodes = useCallback(() => {
    setTreeData(treeNodesFromLayerGroup());
  }, [treeNodesFromLayerGroup]);

  const updateCheckedKeys = useCallback(() => {
    setCheckedKeys(getVisibleLayerKeys());
  }, [getVisibleLayerKeys]);

  const updateTree = useCallback(() => {
    updateTreeNodes();
    updateCheckedKeys();
  }, [updateTreeNodes, updateCheckedKeys]);

  useEffect(() => {
    updateTree();
  }, [updateTree]);

  const registerLayerListeners = useCallback((layer: OlLayerBase) => {
    if (filterFunction && [layer].filter(filterFunction).length === 0) {
      return;
    }

    if (!(hasListener({ target: layer, type: 'propertychange', listener: updateTree }))) {
      const evtKey = layer.on('propertychange', updateTree);
      olListenerKeys.current.push(evtKey);
    }

    if (layer instanceof OlLayerGroup) {
      const layerCollection = layer.getLayers();

      if (!(hasListener({ target: layerCollection, type: 'add', listener: updateTree }))) {
        const addEvtKey = layerCollection.on('add', updateTree);
        olListenerKeys.current.push(addEvtKey);
      }
      if (!(hasListener({ target: layerCollection, type: 'remove', listener: updateTree }))) {
        const removeEvtKey = layerCollection.on('remove', updateTree);
        olListenerKeys.current.push(removeEvtKey);
      }
      if (!(hasListener({ target: layer, type: 'change:layers', listener: updateTree }))) {
        const changeEvtKey = layer.on('change:layers', updateTree);
        olListenerKeys.current.push(changeEvtKey);
      }

      for (const lay of layerCollection.getArray()) {
        registerLayerListeners(lay);
      }
    } else {
      if (!(hasListener({ target: layer, type: 'change:visible', listener: updateCheckedKeys }))) {
        const evtKey = layer.on('change:visible', updateCheckedKeys);
        olListenerKeys.current.push(evtKey);
      }
    }
  }, [filterFunction, hasListener, updateTree, updateCheckedKeys]);

  const registerAllLayerListeners = useCallback(() => {
    if (!map) {
      return;
    }

    const lGroup = layerGroup ? layerGroup : map.getLayerGroup();

    registerLayerListeners(lGroup);

  }, [layerGroup, map, registerLayerListeners]);

  const unregisterAllLayerListeners = useCallback(() => {
    unByKey(olListenerKeys.current);
  }, []);

  useEffect(() => {
    registerAllLayerListeners();

    return () => {
      unregisterAllLayerListeners();
    };
  }, [registerAllLayerListeners, unregisterAllLayerListeners]);

  // Reregister all layer listeners if the treeData changes, this is e.g. required if a layer becomes
  // a child of a layer group that isn't part of the treeData yet.
  useEffect(() => {
    unregisterAllLayerListeners();
    registerAllLayerListeners();
  }, [treeData, registerAllLayerListeners, unregisterAllLayerListeners]);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.getView().on('change:resolution', onChangeResolution);

    return () => {
      map.getView().un('change:resolution', onChangeResolution);
    };
  }, [map, onChangeResolution]);

  const onCheck = (keys: {
    checked: Key[];
    halfChecked: Key[];
  } | Key[], info: CheckInfo<TreeDataNode>) => {
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
  };

  const onDrop = (info: NodeDragEventParams<DataNode> & {
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
  };

  const allowDrop = (options: AllowDropOptions<TreeDataNode>) => {
    const dropNode = options.dropNode;
    const dropPositionRelative = options.dropPosition;

    // Don't allow dropping on a layer node.
    return !(dropPositionRelative === 0 && !dropNode.children);
  };

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

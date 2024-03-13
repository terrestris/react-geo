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
// import OlCollection from 'ol/Collection';
import {
  EventsKey as OlEventsKey,
} from 'ol/events';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlMapEvent from 'ol/MapEvent';
import {
  ObjectEvent as OlObjectEvent
} from 'ol/Object';
import {
  unByKey
} from 'ol/Observable';
import {
  NodeDragEventParams
} from 'rc-tree/lib/contextTypes';
// import { unByKey } from 'ol/Observable';
import {
  EventDataNode
} from 'rc-tree/lib/interface';
import {
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
  filterFunction?: (value: any, index: number, array: any[]) => boolean;

  /**
   * A LayerGroup the Tree should handle.
   */
  layerGroup?: OlLayerGroup;

  /**
   * The OpenLayers map the tree interacts with.
   */
  // TODO Breaking change & make use of useMap
  // map: OlMap;

  /**
   * A function that can be used to pass a custom node title. It can return
   * any renderable element (String, Number, Element etc.) and receives
   * the layer instance of the current tree node.
   */
  nodeTitleRenderer?: (layer: OlLayerBase) => React.ReactNode;

  /**
   * TODO
   */
  // TODO Breaking change, make use of css instead
  // toggleOnClick?: boolean;
}

const defaultClassName = `${CSS_PREFIX}layertree`;

export type LayerTreeProps<T extends BasicDataNode = DataNode> = OwnProps & TreeProps<T>;

/**
 * The LayerTree.
 *
 * Note. This component expects that all layerGroups are permanently visible.
 */
const LayerTree: React.FC<LayerTreeProps> = ({
  className,
  layerGroup,
  nodeTitleRenderer,
  filterFunction,
  // filterFunction = () => true,
  checkable = true,
  draggable = true,
  ...passThroughProps
}) => {
  const [layerGroupRevision, setLayerGroupRevision] = useState<number>(0);
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

  const getLayerKeys = useCallback((nodes: TreeDataNode[]) => {
    const keys: Key[] = [];

    const getKeys = (n: TreeDataNode[]) => {
      n.forEach(d => {
        keys.push(d.key);

        if (d.children) {
          getKeys(d.children);
        }
      });
    };

    getKeys(nodes);

    return keys;
  }, []);

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
        .reverse() as TreeDataNode[];
    }

    return {
      key: getUid(layer),
      title: getTreeNodeTitle(layer),
      // TODO update on resolution change
      className: MapUtil.layerInResolutionRange(layer, map) ? '' : 'out-off-range',
      children: childNodes
    } as TreeDataNode;
  }, [map, getTreeNodeTitle, filterFunction]);

  const treeNodesFromLayerGroup = useCallback(() => {
    if (!map) {
      return [];
    }

    // TODO Apply filterFunction
    const lGroup = layerGroup ? layerGroup : map.getLayerGroup();

    return lGroup.getLayers().getArray()
      .map(l => treeNodeFromLayer(l))
      .filter(n => n !== undefined)
      .reverse() as TreeDataNode[];
  }, [layerGroup, map, treeNodeFromLayer]);

  // const setParentFoldersVisible = useCallback((currentGroup: OlLayerGroup, olUid: string, mainGroup: OlLayerGroup) => {
  //   const items = currentGroup.getLayers().getArray();
  //   const groups = items.filter(l => l instanceof OlLayerGroup) as OlLayerGroup[];
  //   const match = items.find(i => getUid(i) === olUid);
  //   if (match) {
  //     currentGroup.setVisible(true);
  //     setParentFoldersVisible(mainGroup, getUid(currentGroup), mainGroup);
  //     return;
  //   }
  //   groups.forEach(g => {
  //     setParentFoldersVisible(g, olUid, mainGroup);
  //   });
  // }, []);

  const onMapMoveEnd = useCallback((evt: OlMapEvent) => {
    setTreeData(treeNodesFromLayerGroup());
  }, [treeNodesFromLayerGroup]);

  const registerResolutionChangeHandler = useCallback(() => {
    if (!map) {
      return;
    }

    const evtKey = map.on('moveend', onMapMoveEnd);

    olListenerKeys.current.push(evtKey);
  }, [map, onMapMoveEnd]);

  const setLayerVisibility = useCallback((layer: OlLayerBase, visible: boolean) => {
    // if (!map) {
    //   return;
    // }

    if (layer instanceof OlLayerGroup) {
      // layer.setVisible(visible);
      layer.getLayers().forEach((subLayer) => {
        setLayerVisibility(subLayer, visible);
      });
    } else {
      // layer.set('visible', visible, true);
      layer.setVisible(visible);
      // If the layer has a parent folder, make it visible too.
      // if (visible) {
      //   const group = layerGroup ? layerGroup : map.getLayerGroup();
      //   // setParentFoldersVisible(group, getUid(layer), group);
      // }
    }
  }, []); // setParentFoldersVisible

  const onLayerChangeVisible = useCallback((evt: OlObjectEvent) => {
    if (!map) {
      return;
    }

    const lGroup = layerGroup ? MapUtil.getAllLayers(layerGroup) : MapUtil.getAllLayers(map);

    let visibleLayers = lGroup
      .filter(layer => !(layer instanceof OlLayerGroup) && layer.getVisible());

    if (filterFunction) {
      visibleLayers = visibleLayers.filter(filterFunction);
    }

    const visibleKeys = visibleLayers.map(getUid);

    setCheckedKeys(visibleKeys);
  }, [map, layerGroup, filterFunction]);

  useEffect(() => {
    // TODO Check if needed
    // const lGroup = layerGroup ? layerGroup : map.getLayerGroup();
    // const revision = layerGroup ? layerGroup.getRevision() : 0;
    // setLayerGroupRevision(revision);

    setTreeData(treeNodesFromLayerGroup());
    setCheckedKeys(getVisibleLayerKeys());
  }, [treeNodesFromLayerGroup, getVisibleLayerKeys]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const lGroup = layerGroup ? MapUtil.getAllLayers(layerGroup) : MapUtil.getAllLayers(map);

    // TODO Apply filterFunction
    lGroup.forEach(l => {
      if (!(l instanceof OlLayerGroup)) {
        // @ts-ignore
        if (!(hasListener({ target: l, type: 'change:visible', listener: onLayerChangeVisible }))) {
          const evtKey = l.on('change:visible', onLayerChangeVisible);
          olListenerKeys.current.push(evtKey);
        }
      }
    });

    return () => {
      lGroup.forEach(l => {
        l.un('change:visible', onLayerChangeVisible);
      });
    };
  }, [layerGroup, map, onLayerChangeVisible, hasListener]);

  useEffect(() => {
    if (!map) {
      return;
    }
    const lKeys = getLayerKeys(treeData);

    lKeys.forEach(key => {
      const layer = MapUtil.getLayerByOlUid(map, key as string);

      if (!layer) {
        Logger.error('Layer is not defined');
        return;
      }

      if (!(layer instanceof OlLayerGroup)) {
        setLayerVisibility(layer, checkedKeys.includes(key));
      }
    });

    // lKeys
    //   .filter(key => !checkedKeys.includes(key))
    //   .forEach(key => {
    //     const layer = MapUtil.getLayerByOlUid(map, key as string);

    //     if (!layer) {
    //       Logger.error('Layer is not defined');
    //       return;
    //     }

    //     setLayerVisibility(layer, false);
    //   });

    // checkedKeys.forEach(key => {
    //   const layer = MapUtil.getLayerByOlUid(map, key as string);

    //   if (!layer) {
    //     Logger.error('Layer is not defined');
    //     return;
    //   }

    //   setLayerVisibility(layer, true);
    // });
  }, [checkedKeys, getLayerKeys, map, setLayerVisibility, treeData]);

  useEffect(() => {
    registerResolutionChangeHandler();

    // TODO Double check if this works
    return () => unByKey(olListenerKeys.current);
  }, [registerResolutionChangeHandler]);

  const registerAddRemoveListeners = (groupLayer: OlLayerGroup) => {
    // Your code for registerAddRemoveListeners
    // ...
  };

  const onCollectionAdd = (evt: any) => {
    // Your code for onCollectionAdd
    // ...
  };

  const onCollectionRemove = (evt: any) => {
    // Your code for onCollectionRemove
    // ...
  };

  const onChangeLayers = (evt: any) => {
    // Your code for onChangeLayers
    // ...
  };

  const unregisterEventsByLayer = (layer: OlLayerBase) => {
    olListenerKeys.current = olListenerKeys.current.filter((key) => {
      if ((layer as OlLayerGroup).getLayers) {
        const layers = (layer as OlLayerGroup).getLayers();
        if (key.target === layers) {
          if ((key.type === 'add' && key.listener === onCollectionAdd) ||
            (key.type === 'remove' && key.listener === onCollectionRemove) ||
            (key.type === 'change:layers' && key.listener === onChangeLayers)) {

            unByKey(key);
            return false;
          }
        }
      } else if (key.target === layer) {
        if (key.type === 'change:visible' && key.listener === onLayerChangeVisible) {
          unByKey(key);
          return false;
        }
      }
      return true;
    });
  };

  const rebuildTreeNodes = (evt?: OlMapEvent) => {
    // Your code for rebuildTreeNodes
    // ...
  };

  const getVisibleOlUids = () => {
    // Your code for getVisibleOlUids
    // ...
  };

  const onCheck = (keys: {
    checked: Key[];
    halfChecked: Key[];
  } | Key[], info: CheckInfo) => { // <TreeDataType> TODO
    if (Array.isArray(keys)) {
      setCheckedKeys(keys);
    }
  };

  // TODO Not working as expected -> solved via css
//   const onSelect = (selectedKeys: Key[], info: {
//     event: 'select';
//     selected: boolean;
//     node: EventDataNode<any>; // TODO
//     selectedNodes: any[]; // TODO
//     nativeEvent: MouseEvent;
// }) => {
//     const selected = info.selected;
//     const eventKey = info.node.key;

//     let updatedCheckedKeys: React.Key[] = [...checkedKeys];

//     if (selected && !updatedCheckedKeys.includes(eventKey)) {
//       updatedCheckedKeys.push(eventKey);
//     }

//     if (selected && updatedCheckedKeys.includes(eventKey)) {
//       // do nothing
//     }

//     if (!selected && !updatedCheckedKeys.includes(eventKey)) {
//       // do nothing
//     }

//     if (!selected && updatedCheckedKeys.includes(eventKey)) {
//       updatedCheckedKeys = updatedCheckedKeys.filter(item => item !== eventKey);
//     }

//     setCheckedKeys(updatedCheckedKeys);
//   };

  const onDrop = (info: NodeDragEventParams & { // TODO TreeDataType
    dragNode: EventDataNode<any>; // TODO TreeDataType
    dragNodesKeys: Key[];
    dropPosition: number;
    dropToGap: boolean;
  }) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    // the drop position relative to the drop node, inside 0, top -1, bottom 1
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: TreeDataNode[],
      key: React.Key,
      callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj: TreeDataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj);
      });
    } else {
      let ar: TreeDataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        // Drop on the top of the drop node
        ar.splice(i!, 0, dragObj!);
      } else {
        // Drop on the bottom of the drop node
        ar.splice(i! + 1, 0, dragObj!);
      }
    }

    setTreeData(data);
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
      // onSelect={toggleOnClick ? onSelect : undefined}
      selectable={false}
      checkable={checkable}
      draggable={draggable}
      treeData={treeData}
      {...passThroughProps}
    />
  );
};

export default LayerTree;


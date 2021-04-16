import * as React from 'react';

import { Tree } from 'antd';
import { AntTreeNodeDropEvent } from 'antd/lib/tree/Tree';
import { ReactElement } from 'react';
import {
  TreeProps,
  AntTreeNodeCheckedEvent
} from 'antd/lib/tree';
import {
  EventDataNode
} from 'rc-tree/lib/interface';

import OlMap from 'ol/Map';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlCollection from 'ol/Collection';
import OlMapEvent from 'ol/MapEvent';
import { unByKey } from 'ol/Observable';
import { getUid } from 'ol';

import _isBoolean from 'lodash/isBoolean';
import _isFunction from 'lodash/isFunction';
import _isEqual from 'lodash/isEqual';

import Logger from '@terrestris/base-util/dist/Logger';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import LayerTreeNode, { LayerTreeNodeProps } from './LayerTreeNode/LayerTreeNode';

import { CSS_PREFIX } from '../constants';


interface DefaultProps extends TreeProps {
  /**
   * An optional array-filter function that is applied to every layer and
   * subLayer. Return false to exclude this layer from the layerTree or true
   * to include it.
   *
   * Compare MDN Docs for Array.prototype.filter: https://mdn.io/array/filter
   */
  filterFunction: (value: any, index: number, array: any[]) => boolean;
}

export interface BaseProps {
  /**
   * An optional CSS class which should be added.
   */
  className?: string;

  /**
   * A LayerGroup the Tree should handle.
   */
  layerGroup?: OlLayerGroup;

  /**
   * The OpenLayers map the tree interacts with.
   */
  map: OlMap;

  /**
   * A function that can be used to pass a custom node title. It can return
   * any renderable element (String, Number, Element etc.) and receives
   * the layer instance of the current tree node.
   */
  nodeTitleRenderer?: (layer: OlLayerBase) => React.ReactNode;
}

interface LayerTreeState {
  layerGroup: OlLayerGroup;
  layerGroupRevision?: number;
  treeNodes: ReactElement<LayerTreeNodeProps>[];
  checkedKeys: React.ReactText[];
  mapResolution: -1;
}

export type LayerTreeProps = BaseProps & Partial<DefaultProps> & TreeProps;

/**
 * The LayerTree.
 *
 * Note. This component expects that all layerGroups are permanently visible.
 *
 * @class LayerTree
 * @extends React.Component
 */
class LayerTree extends React.Component<LayerTreeProps, LayerTreeState> {

  /**
   * The default properties.
   */
  static defaultProps: DefaultProps = {
    draggable: true,
    checkable: true,
    filterFunction: () => true
  };

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}layertree`;

  /**
   *  An array of ol.EventsKey as returned by on() or once().
   * @private
   */
  olListenerKeys = [];

  /**
   * Create the LayerTree.
   *
   * @constructs LayerTree
   */
  constructor(props: LayerTreeProps) {
    super(props);

    this.state = {
      layerGroup: null,
      layerGroupRevision: null,
      treeNodes: [],
      checkedKeys: [],
      mapResolution: -1
    };
  }

  /**
   * Invoked after the component is instantiated as well as when it
   * receives new props. It should return an object to update state, or null
   * to indicate that the new props do not require any state updates.
   *
   * @param nextProps The next properties.
   * @param prevState The previous state.
   */
  static getDerivedStateFromProps(nextProps: LayerTreeProps, prevState: LayerTreeState) {
    if (prevState.layerGroup && nextProps.layerGroup) {
      if (!_isEqual(getUid(prevState.layerGroup), getUid(nextProps.layerGroup)) ||
        !_isEqual(prevState.layerGroupRevision, nextProps.layerGroup.getRevision())) {
        return {
          layerGroup: nextProps.layerGroup,
          layerGroupRevision: nextProps.layerGroup.getRevision()
        };
      }
    }
    return null;
  }

  /**
   * Determines what to do on the initial mount.
   */
  componentDidMount() {
    const layerGroup = this.props.layerGroup ?
      this.props.layerGroup :
      this.props.map.getLayerGroup();

    const revision = this.props.layerGroup ? this.props.layerGroup.getRevision() : 0;

    this.setState({
      layerGroup: layerGroup,
      layerGroupRevision: revision
    }, () => {
      this.registerAddRemoveListeners(this.state.layerGroup);
      this.registerResolutionChangeHandler();
      this.rebuildTreeNodes();
    });
  }

  /**
   * Invoked immediately after updating occurs. This method is not called for
   * the initial render.
   *
   * @param prevProps The previous props.
   * @param prevState The previous state.
   */
  componentDidUpdate(prevProps: LayerTreeProps, prevState: LayerTreeState) {
    const {
      layerGroup,
      nodeTitleRenderer
    } = this.props;

    if (layerGroup && prevState.layerGroup) {
      if (!_isEqual(getUid(prevState.layerGroup), getUid(layerGroup))) {
        unByKey(this.olListenerKeys);
        this.olListenerKeys = [];

        this.registerAddRemoveListeners(layerGroup);
        this.rebuildTreeNodes();
      }
    }

    if (nodeTitleRenderer !== prevProps.nodeTitleRenderer) {
      this.rebuildTreeNodes();
    }
  }

  /**
   * Determines what to do when the component is unmounted.
   */
  componentWillUnmount() {
    unByKey(this.olListenerKeys);
  }

  /**
   * Creates TreeNodes from a given layergroup and sets the treeNodes in the state.
   *
   * @param groupLayer A grouplayer.
   */
  treeNodesFromLayerGroup(groupLayer: OlLayerGroup) {
    const layerArray = groupLayer.getLayers().getArray()
      .filter(this.props.filterFunction);
    const treeNodes = layerArray.map((layer) => {
      return this.treeNodeFromLayer(layer);
    });
    treeNodes.reverse();
    this.setState({ treeNodes });
  }

  /**
   * Registers the add/remove listeners recursively for all ol.layer.Group.
   *
   * @param groupLayer A ol.layer.Group
   */
  registerAddRemoveListeners(groupLayer: OlLayerGroup) {
    const collection = groupLayer.getLayers();
    const addEvtKey = collection.on('add', this.onCollectionAdd);
    const removeEvtKey = collection.on('remove', this.onCollectionRemove);
    const changeEvtKey = groupLayer.on('change:layers', this.onChangeLayers);

    this.olListenerKeys.push(addEvtKey, removeEvtKey, changeEvtKey);

    collection.forEach((layer) => {
      if (layer instanceof OlLayerGroup) {
        this.registerAddRemoveListeners(layer);
      }
    });
  }

  /**
   * Registers an eventhandler on the `ol.View`, which will rebuild the tree
   * nodes whenever the view's resolution changes.
   */
  registerResolutionChangeHandler() {
    const { map } = this.props;
    const evtKey = map.on('moveend', this.rebuildTreeNodes.bind(this));
    this.olListenerKeys.push(evtKey); // TODO when and how to we unbind?
  }

  /**
   * Listens to the collections add event of a collection.
   * Registers add/remove listeners if element is a collection and rebuilds the
   * treeNodes.
   *
   * @param evt The add event.
   */
  onCollectionAdd = (evt: any) => {
    if (evt.element instanceof OlLayerGroup) {
      this.registerAddRemoveListeners(evt.element);
    }
    this.rebuildTreeNodes();
  };

  /**
   * Listens to the collections remove event of a collection.
   * Unregisters the events of deleted layers and rebuilds the treeNodes.
   *
   * @param evt The remove event.
   */
  onCollectionRemove = (evt: any) => {
    this.unregisterEventsByLayer(evt.element);
    if (evt.element instanceof OlLayerGroup) {
      evt.element.getLayers().forEach((layer) => {
        this.unregisterEventsByLayer(layer);
      });
    }
    this.rebuildTreeNodes();
  };

  /**
   * Listens to the LayerGroups change:layers event.
   * Unregisters the old and reregisters new listeners.
   *
   * @param evt The change event.
   */
  onChangeLayers = (evt: any) => {
    this.unregisterEventsByLayer(evt.oldValue);
    if (evt.oldValue instanceof OlCollection) {
      evt.oldValue.forEach((layer) => this.unregisterEventsByLayer(layer));
    }
    if (evt.target instanceof OlLayerGroup) {
      this.registerAddRemoveListeners(evt.target);
    }
    this.rebuildTreeNodes();
  };

  /**
   * Unregisters the Events of a given layer.
   *
   * @param layer An ol.layer.Base.
   */
  unregisterEventsByLayer = (layer: OlLayerBase) => {
    this.olListenerKeys = this.olListenerKeys.filter((key) => {
      if (layer instanceof OlLayerGroup) {
        const layers = layer.getLayers();
        if (key.target === layers) {
          if ((key.type === 'add' && key.listener === this.onCollectionAdd) ||
            (key.type === 'remove' && key.listener === this.onCollectionRemove) ||
            (key.type === 'change:layers' && key.listener === this.onChangeLayers)) {

            unByKey(key);
            return false;
          }
        }
      } else if (key.target === layer) {
        if (key.type === 'change:visible' && key.listener === this.onLayerChangeVisible) {
          unByKey(key);
          return false;
        }
      }
      return true;
    });
  };

  /**
   * Rebuilds the treeNodes and its checked states.
   * @param evt The OpenLayers MapEvent (passed by moveend)
   *
   */
  rebuildTreeNodes = (evt?: any) => {
    const { mapResolution } = this.state;

    if (evt && evt instanceof OlMapEvent && evt.target && evt.target.getView) {
      if (mapResolution === evt.target.getView().getResolution()) {
        // If map resolution didn't change => no redraw of tree nodes needed.
        return;
      }
    }

    this.treeNodesFromLayerGroup(this.state.layerGroup);
    const checkedKeys = this.getVisibleOlUids();
    this.setState({
      checkedKeys,
      mapResolution: evt ? evt.target.getView().getResolution() : -1
    });
  };

  /**
   * Returns the title to render in the LayerTreeNode. If a nodeTitleRenderer
   * has been passed as prop, it will be called and the (custom) return value
   * will be rendered. Note: This can be any renderable element collection! If
   * no function is given (the default) the layer name will be passed.
   *
   * @param layer The layer attached to the tree node.
   * @return The title composition to render.
   */
  getTreeNodeTitle(layer: OlLayerBase) {
    if (_isFunction(this.props.nodeTitleRenderer)) {
      return this.props.nodeTitleRenderer.call(this, layer);
    } else {
      return layer.get('name');
    }
  }

  /**
   * Creates a treeNode from a given layer.
   *
   * @param layer The given layer.
   * @return The corresponding LayerTreeNode Element.
   */
  treeNodeFromLayer(layer: OlLayerBase): ReactElement<LayerTreeNodeProps> {
    let childNodes: ReactElement<LayerTreeNodeProps>[];

    if (layer instanceof OlLayerGroup) {
      const childLayers = layer.getLayers().getArray()
        .filter(this.props.filterFunction);
      childNodes = childLayers.map((childLayer: OlLayerBase) => {
        return this.treeNodeFromLayer(childLayer);
      });
      childNodes.reverse();
    } else {
      if (!this.hasListener(layer, 'change:visible', this.onLayerChangeVisible)) {
        const eventKey = layer.on('change:visible', this.onLayerChangeVisible);
        this.olListenerKeys.push(eventKey);
      }
    }

    return (
      <LayerTreeNode
        title={this.getTreeNodeTitle(layer)}
        key={getUid(layer)}
        inResolutionRange={MapUtil.layerInResolutionRange(layer, this.props.map)}
      >
        {childNodes}
      </LayerTreeNode>
    );
  }

  /**
   * Determines if the target has already registered the given listener for the
   * given eventtype.
   *
   * @param target The event target.
   * @param type The events type (name).
   * @param listener The function.
   * @return True if the listener is already contained in this.olListenerKeys.
   */
  hasListener = (target, type, listener) => {
    return this.olListenerKeys.some((listenerKey) => {
      return listenerKey.target === target
        && listenerKey.type === type
        && listenerKey.listener === listener;
    });
  };

  /**
   * Reacts to the layer change:visible event and calls setCheckedState.
   *
   * @param evt The change:visible event
   */
  onLayerChangeVisible = () => {
    const checkedKeys = this.getVisibleOlUids();
    this.setState({
      checkedKeys
    }, () => {
      this.rebuildTreeNodes();
    });
  };

  /**
   * Get the flat array of ol_uids from visible non groupLayers.
   *
   * @return The visible ol_uids.
   */
  getVisibleOlUids = () => {
    const layers = MapUtil.getAllLayers(this.state.layerGroup, (layer) => {
      return !(layer instanceof OlLayerGroup) && layer.getVisible();
    }).filter(this.props.filterFunction);
    return layers.map(getUid);
  };

  /**
   * Sets the visibility of a layer due to its checked state.
   *
   * @param checkedKeys Contains all checkedKeys.
   * @param checked The ant-tree event object for this event. See ant docs.
   */
  onCheck(checkedKeys: string[], e: AntTreeNodeCheckedEvent) {
    const { checked } = e;
    const eventKey = e.node.props.eventKey;
    const layer = MapUtil.getLayerByOlUid(this.props.map, eventKey);

    this.setLayerVisibility(layer, checked);
  }

  /**
   * Sets the layer visibility. Calls itself recursively for groupLayers.
   *
   * @param layer The layer.
   * @param visibility The visibility.
   */
  setLayerVisibility(layer: OlLayerBase, visibility: boolean) {
    if (!(layer instanceof OlLayerBase) || !_isBoolean(visibility)) {
      Logger.error('setLayerVisibility called without layer or visiblity.');
      return;
    }
    if (layer instanceof OlLayerGroup) {
      layer.setVisible(visibility);
      layer.getLayers().forEach((subLayer) => {
        this.setLayerVisibility(subLayer, visibility);
      });
    } else {
      layer.setVisible(visibility);
      // if layer has a parent folder, make it visible too
      if (visibility) {
        const group = this.props.layerGroup ? this.props.layerGroup :
          this.props.map.getLayerGroup();
        this.setParentFoldersVisible(group, getUid(layer), group);
      }
    }
  }

  /**
   * Find the parent OlLayerGroup for the given layers ol_uid and make it
   * visible. Traverse the tree to also set the parenting layer groups visible
   *
   * @param currentGroup The current group to search in
   * @param olUid The ol_uid of the layer or folder that has been set visible
   * @param masterGroup The main group to search in. Needed when searching for
   * parents as we always have to start search from top
   */
  setParentFoldersVisible(currentGroup: OlLayerGroup, olUid: string, masterGroup: OlLayerGroup) {
    const items = currentGroup.getLayers().getArray();
    const groups = items.filter(l => l instanceof OlLayerGroup) as OlLayerGroup[];
    const match = items.find(i => getUid(i) === olUid);
    if (match) {
      currentGroup.setVisible(true);
      this.setParentFoldersVisible(masterGroup, getUid(currentGroup), masterGroup);
      return;
    }
    groups.forEach(g => {
      this.setParentFoldersVisible(g, olUid, masterGroup);
    });
  }

  /**
   * The callback method for the drop event. Layers will get reordered in the map
   * and the tree.
   *
   * @param e The ant-tree event object for this event. See ant docs.
   */
  onDrop(e: AntTreeNodeDropEvent) {
    const dragLayer = MapUtil.getLayerByOlUid(this.props.map, e.dragNode.props.eventKey);
    const dragInfo = MapUtil.getLayerPositionInfo(dragLayer, this.props.map);
    const dragCollection = dragInfo.groupLayer.getLayers();
    const dropLayer = MapUtil.getLayerByOlUid(this.props.map, e.node.props.eventKey);
    const dropPos = e.node.props.pos.split('-');
    const location = e.dropPosition - Number(dropPos[dropPos.length - 1]);

    dragCollection.remove(dragLayer);

    const dropInfo = MapUtil.getLayerPositionInfo(dropLayer, this.props.map);
    const dropPosition = dropInfo.position;
    const dropCollection = dropInfo.groupLayer.getLayers();

    // drop before node
    if (location === -1) {
      if (dropPosition === dropCollection.getLength() - 1) {
        dropCollection.push(dragLayer);
      } else {
        dropCollection.insertAt(dropPosition + 1, dragLayer);
      }
      // drop on node
    } else if (location === 0) {
      if (dropLayer instanceof OlLayerGroup) {
        dropLayer.getLayers().push(dragLayer);
      } else {
        dropCollection.insertAt(dropPosition + 1, dragLayer);
      }
      // drop after node
    } else if (location === 1) {
      dropCollection.insertAt(dropPosition, dragLayer);
    }

    this.rebuildTreeNodes();
  }

  /**
   * Call rebuildTreeNodes onExpand to avoid sync issues.
   *
   */
  onExpand = (expandedKeys: string[], info: {
    node: EventDataNode;
    expanded: boolean;
    nativeEvent: MouseEvent;
  }) => {
    const {
      onExpand
    } = this.props;

    this.rebuildTreeNodes();

    if (onExpand) {
      onExpand(expandedKeys, info);
    }
  };

  /**
   * The render function.
   */
  render() {
    const {
      className,
      layerGroup,
      map,
      nodeTitleRenderer,
      ...passThroughProps
    } = this.props;

    let ddListeners: any;
    if (passThroughProps.draggable) {
      ddListeners = {
        onDrop: this.onDrop.bind(this)
      };
    }

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <Tree
        className={finalClassName}
        checkedKeys={this.state.checkedKeys}
        onCheck={this.onCheck.bind(this)}
        onExpand={this.onExpand}
        {...ddListeners}
        {...passThroughProps}
      >
        {this.state.treeNodes}
      </Tree>
    );
  }
}

export default LayerTree;

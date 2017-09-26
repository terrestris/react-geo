import React from 'react';
import PropTypes from 'prop-types';
import { isEqual, isBoolean, isFunction } from 'lodash';
import { Tree } from 'antd';
import OlLayerBase from 'ol/layer/base';
import OlLayerGroup from 'ol/layer/group';
import olObservable from 'ol/observable';

import Logger from '../Util/Logger';
import MapUtil from '../Util/MapUtil/MapUtil';
import LayerTreeNode from '../LayerTreeNode/LayerTreeNode.jsx';

/**
 * The LayerTree.
 *
 * Note. This component expects that all layerGroups are permanently visibile.
 *
 * @class LayerTree
 * @extends React.Component
 */
class LayerTree extends React.Component {


  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = 'react-geo-layertree'


  /**
   *  An array of ol.EventsKey as returned by on() or once().
   * @type {Array<ol.EventsKey>}
   * @private
   */
  olListenerKeys = []

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * The className which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    layerGroup: PropTypes.instanceOf(OlLayerGroup),

    map: PropTypes.object,

    /**
     * A function that can be used to pass a custom node title. It can return
     * any renderable element (String, Number, Element etc.) and receives
     * the layer instance of the current tree node.
     * @type {Function}
     */
    nodeTitleRenderer: PropTypes.func
  }

  /**
   * The default properties.
   *
   * @type {Object}
   */
  static defaultProps = {
    draggable: true,
    checkable: true
  }

  /**
   * Create the LayerTree.
   *
   * @constructs LayerTree
   */
  constructor(props) {
    super(props);

    this.state = {
      layerGrop: null,
      treeNodes: [],
      checkedKeys: []
    };
  }

  /**
   * Determines what to do on the initial mount.
   */
  componentDidMount() {
    if (this.props.layerGroup) {
      this.setState({
        layerGroup: this.props.layerGroup
      }, () => {
        this.registerAddRemoveListeners(this.state.layerGroup);
        this.registerResolutionChangeHandler();
        this.rebuildTreeNodes();
      });
    }
  }

  /**
   * Determines what to do when the component is unmounted.
   */
  componentWillUnmount() {
    olObservable.unByKey(this.olListenerKeys);
  }

  /**
   * Determines what to do with new props.
   *
   * @param {Object} nextProps The new props.
   */
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.layerGroup, nextProps.layerGroup)) {
      olObservable.unByKey(this.olListenerKeys);
      this.olListenerKeys = [];

      this.setState({
        layerGroup: nextProps.layerGroup
      }, () => {
        this.registerAddRemoveListeners(this.state.layerGroup);
        this.rebuildTreeNodes();
      });
    }
  }

  /**
   * Creates TreeNodes from a given layergroup and sets the treeNodes in the state.
   *
   * @param {ol.layer.Group} groupLayer A grouplayer.
   */
  treeNodesFromLayerGroup(groupLayer) {
    const layerArray = groupLayer.getLayers().getArray();
    const treeNodes = layerArray.map((layer) => {
      return this.treeNodeFromLayer(layer);
    });
    this.setState({treeNodes});
  }

  /**
   * Registers the add/remove listeners recursively for all ol.layer.Group.
   *
   * @param {ol.layer.Group} groupLayer A ol.layer.Group
   */
  registerAddRemoveListeners = (groupLayer) => {
    const collection = groupLayer.getLayers();
    const addEvtKey = collection.on('add', this.onCollectionAdd);
    const removeEvtKey = collection.on('remove', this.onCollectionRemove);

    this.olListenerKeys.push(addEvtKey, removeEvtKey);

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
    const mapView = this.props.map.getView();
    const evtKey = mapView.on('change:resolution', () => {
      this.rebuildTreeNodes();
    });
    this.olListenerKeys.push(evtKey); // TODO when and how to we unbind?
  }

  /**
   * Listens to the collections add event of a collection.
   * Registers add/remove listeners if element is a collection and rebuilds the
   * treeNodes.
   *
   * @param {ol.Collection.Event} evt The add event.
   */
  onCollectionAdd = (evt) => {
    if (evt.element instanceof OlLayerGroup) {
      this.registerAddRemoveListeners(evt.element);
    }
    this.rebuildTreeNodes();
  }

  /**
   * Listens to the collections remove event of a collection.
   * Unregisters the events of deleted layers and rebuilds the treeNodes.
   *
   * @param {ol.Collection.Event} evt The remove event.
   */
  onCollectionRemove = (evt) => {
    this.unregisterEventsByLayer(evt.element);
    if (evt.element instanceof OlLayerGroup) {
      evt.element.getLayers().forEach((layer) => {
        this.unregisterEventsByLayer(layer);
      });
    }
    this.rebuildTreeNodes();
  }

  /**
   * Unregisters the Events of a given layer.
   *
   * @param {ol.layer.Base} layer An ol.layer.Base.
   */
  unregisterEventsByLayer = (layer) => {
    this.olListenerKeys = this.olListenerKeys.filter((key) => {
      if (layer instanceof OlLayerGroup) {
        const layers = layer.getLayers();
        if (key.target === layers) {
          if ((key.type === 'add' && key.listener === this.onCollectionAdd) ||
          (key.type === 'remove' && key.listener === this.onCollectionRemove)){

            olObservable.unByKey(key);
            return false;
          }
        }
      } else if (key.target === layer) {
        if (key.type === 'change:visible' && key.listener === this.onLayerChangeVisible) {
          olObservable.unByKey(key);
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Rebuilds the treeNodes and its checked states.
   */
  rebuildTreeNodes = () => {
    this.treeNodesFromLayerGroup(this.state.layerGroup);
    const checkedKeys = this.getVisibleOlUids();
    this.setState({
      checkedKeys
    });
  }

  /**
   * Returns the title to render in the LayerTreeNode. If a nodeTitleRenderer
   * has been passed as prop, it will be called and the (custom) return value
   * will be rendered. Note: This can be any renderable element collection! If
   * no function is given (the default) the layer name will be passed.
   *
   * @param {ol.layer.Base} layer The layer attached to the tree node.
   * @return {Element} The title composition to render.
   */
  getTreeNodeTitle(layer) {
    if (isFunction(this.props.nodeTitleRenderer)) {
      return this.props.nodeTitleRenderer.call(this, layer);
    } else {
      return layer.get('name');
    }
  }

  /**
   * Creates a treeNode from a given layer.
   *
   * @param {ol.layer.Base} layer The given layer.
   * @return {LayerTreeNode} The corresponding LayerTreeNode Element.
   */
  treeNodeFromLayer(layer) {
    let childNodes;
    let treeNode;

    if (layer instanceof OlLayerGroup) {
      if (!layer.getVisible()) {
        Logger.warn('Your map configuration contains layerGroups that are' +
        'invisible. This might lead to buggy behaviour.');
      }

      const childLayers = layer.getLayers().getArray();
      childNodes = childLayers.map((childLayer) => {
        return this.treeNodeFromLayer(childLayer);
      });
    } else {
      if (!this.hasListener(layer, 'change:visible', this.onLayerChangeVisible)) {
        const eventKey = layer.on('change:visible', this.onLayerChangeVisible);
        this.olListenerKeys.push(eventKey);
      }

    }

    treeNode = <LayerTreeNode
      title={this.getTreeNodeTitle(layer)}
      key={layer.ol_uid}
      inResolutionRange={MapUtil.layerInResolutionRange(layer, this.props.map)}
    >
      {childNodes}
    </LayerTreeNode>;

    return treeNode;
  }

  /**
   * Determines if the target has already registered the given listener for the
   * given eventtype.
   *
   * @param {Object} target The event target.
   * @param {String} type The events type (name).
   * @param {function} listener The function.
   * @return {Boolean} True if the listener is allready contained in
   *                   this.olListenerKeys.
   */
  hasListener = (target, type, listener) => {
    return this.olListenerKeys.some((listenerKey) => {
      return listenerKey.target === target
        && listenerKey.type === type
        && listenerKey.listener === listener;
    });
  }

  /**
   * Reacts to the layer change:visible event and calls setCheckedState.
   *
   * @param {ol.Object.Event} evt The change:visible event
   */
  onLayerChangeVisible = () => {
    const checkedKeys = this.getVisibleOlUids();
    this.setState({
      checkedKeys
    }, () => {
      this.rebuildTreeNodes();
    });
  }

  /**
   * Get the flat array of ol_uids from visible non groupLayers.
   *
   * @return {Array<String>} The visible ol_uids.
   */
  getVisibleOlUids = () => {
    const layers = MapUtil.getAllLayers(this.state.layerGroup, (layer) => {
      return !(layer instanceof OlLayerGroup) && layer.getVisible();
    });
    return layers.map(l => l.ol_uid.toString());
  }

  /**
   * Sets the visibility of a layer due to its checked state.
   *
   * @param {Array<String>} checkedKeys Contains all checkedKeys.
   * @param {e} checked The ant-tree event object for this event. See ant docs.
   */
  onCheck = (checkedKeys, e) => {
    const {checked} = e;
    const eventKey = e.node.props.eventKey;
    const layer = MapUtil.getLayerByOlUid(this.props.map, eventKey);

    this.setLayerVisibility(layer, checked);
  }

  /**
   * Sets the layer visibility. Calls itself recursively for groupLayers.
   *
   * @param {ol.layer.Base} layer The layer.
   * @param {Boolean} visiblity The visiblity.
   */
  setLayerVisibility = (layer, visiblity) => {
    if (!(layer instanceof OlLayerBase) || !isBoolean(visiblity)) {
      Logger.error('setLayerVisibility called without layer or visiblity.');
      return;
    }
    if (layer instanceof OlLayerGroup) {
      layer.getLayers().forEach((subLayer) => {
        this.setLayerVisibility(subLayer, visiblity);
      });
    } else {
      layer.setVisible(visiblity);
    }
  }

  /**
   * The callback method for the drop event. Layers will get reordered in the map
   * and the tree.
   *
   * @param {Object} e The ant-tree event object for this event. See ant docs.
   */
  onDrop = (e) => {
    const dragLayer = MapUtil.getLayerByOlUid(this.props.map, e.dragNode.props.eventKey);
    const dragInfo = MapUtil.getLayerPositionInfo(dragLayer, this.props.map);
    const dragCollection = dragInfo.groupLayer.getLayers();
    const dropLayer = MapUtil.getLayerByOlUid(this.props.map, e.node.props.eventKey);
    const dropPos = e.node.props.pos.split('-');
    const location = e.dropPosition - Number(dropPos[dropPos.length - 1]);

    dragCollection.remove(dragLayer);

    const info = MapUtil.getLayerPositionInfo(dropLayer, this.props.map);
    const dropPosition = info.position;
    const dropCollection = info.groupLayer.getLayers();

    // drop before node
    if (location === -1) {
      if (dropPosition === 0) {
        dropCollection.insertAt(0, dragLayer);
      } else {
        dropCollection.insertAt(dropPosition, dragLayer);
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
      dropCollection.insertAt(dropPosition + 1, dragLayer);
    }

    this.rebuildTreeNodes();
  }

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

    let ddListeners;
    if (passThroughProps.draggable) {
      ddListeners = {
        onDragStart: this.onDragStart,
        onDragEnter: this.onDragEnter,
        onDragOver: this.onDragOver,
        onDragLeave: this.onDragLeave,
        onDragEnd: this.onDragEnd,
        onDrop: this.onDrop
      };
    }

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <Tree
        className={finalClassName}
        checkedKeys={this.state.checkedKeys}
        onCheck={this.onCheck}
        {...ddListeners}
        {...passThroughProps}
      >
        {this.state.treeNodes}
      </Tree>
    );
  }
}

export default LayerTree;

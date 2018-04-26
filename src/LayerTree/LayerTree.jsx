import React from 'react';
import PropTypes from 'prop-types';
import isBoolean from 'lodash/isBoolean.js';
import isFunction from 'lodash/isFunction.js';
import isEqual from 'lodash/isEqual.js';
import { Tree } from 'antd';

import OlMap from 'ol/Map';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlCollection from 'ol/collection';
import olObservable from 'ol/Observable';

import Logger from '@terrestris/base-util/src/Logger';
import MapUtil from '@terrestris/ol-util/src/MapUtil/MapUtil';
import LayerTreeNode from '../LayerTreeNode/LayerTreeNode.jsx';
import { CSS_PREFIX } from '../constants';

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
  className = `${CSS_PREFIX}layertree`


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
     * An optional CSS class which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    layerGroup: PropTypes.instanceOf(OlLayerGroup),

    map: PropTypes.instanceOf(OlMap).isRequired,

    /**
     * A function that can be used to pass a custom node title. It can return
     * any renderable element (String, Number, Element etc.) and receives
     * the layer instance of the current tree node.
     * @type {Function}
     */
    nodeTitleRenderer: PropTypes.func,

    /**
     * An optional array-filter function that is applied to every layer and
     * subLayer. Return false to exclude this layer from the layerTree or true
     * to include it.
     *
     * Compare MDN Docs for Array.prototype.filter: https://mdn.io/array/filter
     *
     * @type {Function}
     */
    filterFunction: PropTypes.func
  }

  /**
   * The default properties.
   *
   * @type {Object}
   */
  static defaultProps = {
    draggable: true,
    checkable: true,
    filterFunction: () => true
  }

  /**
   * Invoked after the component is instantiated as well as when it
   * receives new props. It should return an object to update state, or null
   * to indicate that the new props do not require any state updates.
   *
   * @param {Object} nextProps The next properties.
   * @param {Object} prevState The previous state.
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.layerGroup && nextProps.layerGroup) {
      if (!isEqual(prevState.layerGroup.ol_uid, nextProps.layerGroup.ol_uid) ||
          !isEqual(prevState.layerGroupRevision, nextProps.layerGroup.getRevision())) {
        return {
          layerGroup: nextProps.layerGroup,
          layerGroupRevision: nextProps.layerGroup.getRevision()
        };
      }
    }

    return null;
  }

  /**
   * Create the LayerTree.
   *
   * @constructs LayerTree
   */
  constructor(props) {
    super(props);

    this.state = {
      layerGroup: null,
      layerGroupRevision: null,
      treeNodes: [],
      checkedKeys: []
    };
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
   * @param {Object} prevProps The previous props.
   * @param {Object} prevState The previous state.
   */
  componentDidUpdate(prevProps, prevState) {
    const {
      layerGroup,
      nodeTitleRenderer
    } = this.props;

    if (layerGroup && prevState.layerGroup) {
      if (!isEqual(prevState.layerGroup.ol_uid, layerGroup.ol_uid)) {
        olObservable.unByKey(this.olListenerKeys);
        this.olListenerKeys = [];

        this.registerAddRemoveListeners(layerGroup);
        this.rebuildTreeNodes();
      }
    }

    if (nodeTitleRenderer !== prevProps.nodeTitleRenderer){
      this.rebuildTreeNodes();
    }
  }

  /**
   * Determines what to do when the component is unmounted.
   */
  componentWillUnmount() {
    olObservable.unByKey(this.olListenerKeys);
  }

  /**
   * Creates TreeNodes from a given layergroup and sets the treeNodes in the state.
   *
   * @param {ol.layer.Group} groupLayer A grouplayer.
   */
  treeNodesFromLayerGroup(groupLayer) {
    let layerArray = groupLayer.getLayers().getArray()
      .filter(this.props.filterFunction);
    const treeNodes = layerArray.map((layer) => {
      return this.treeNodeFromLayer(layer);
    });
    treeNodes.reverse();
    this.setState({treeNodes});
  }

  /**
   * Registers the add/remove listeners recursively for all ol.layer.Group.
   *
   * @param {ol.layer.Group} groupLayer A ol.layer.Group
   */
  registerAddRemoveListeners(groupLayer) {
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
   * Listens to the LayerGroups change:layers event.
   * Unregisters the old and reregisters new listeners.
   *
   * @param {ol.layer.Group.Event} evt The change event.
   */
  onChangeLayers = (evt) => {
    this.unregisterEventsByLayer(evt.oldValue);
    if (evt.oldValue instanceof OlCollection) {
      evt.oldValue.forEach((layer) => this.unregisterEventsByLayer(layer));
    }
    if (evt.target instanceof OlLayerGroup) {
      this.registerAddRemoveListeners(evt.target);
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
          (key.type === 'remove' && key.listener === this.onCollectionRemove) ||
          (key.type === 'change:layers' && key.listener === this.onChangeLayers)) {

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
      let childLayers = layer.getLayers().getArray()
        .filter(this.props.filterFunction);
      childNodes = childLayers.map((childLayer) => {
        return this.treeNodeFromLayer(childLayer);
      });
      childNodes.reverse();
    } else {
      if (!this.hasListener(layer, 'change:visible', this.onLayerChangeVisible)) {
        const eventKey = layer.on('change:visible', this.onLayerChangeVisible);
        this.olListenerKeys.push(eventKey);
      }
    }

    treeNode = <LayerTreeNode
      title={this.getTreeNodeTitle(layer)}
      key={layer.ol_uid.toString()}
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
    }).filter(this.props.filterFunction);
    return layers.map(l => l.ol_uid.toString());
  }

  /**
   * Sets the visibility of a layer due to its checked state.
   *
   * @param {Array<String>} checkedKeys Contains all checkedKeys.
   * @param {e} checked The ant-tree event object for this event. See ant docs.
   */
  onCheck(checkedKeys, e) {
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
  setLayerVisibility(layer, visibility) {
    if (!(layer instanceof OlLayerBase) || !isBoolean(visibility)) {
      Logger.error('setLayerVisibility called without layer or visiblity.');
      return;
    }
    if (layer instanceof OlLayerGroup) {
      layer.getLayers().forEach((subLayer) => {
        this.setLayerVisibility(subLayer, visibility);
      });
    } else {
      layer.setVisible(visibility);
    }
  }

  /**
   * The callback method for the drop event. Layers will get reordered in the map
   * and the tree.
   *
   * @param {Object} e The ant-tree event object for this event. See ant docs.
   */
  onDrop(e) {
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
        {...ddListeners}
        {...passThroughProps}
      >
        {this.state.treeNodes}
      </Tree>
    );
  }
}

export default LayerTree;

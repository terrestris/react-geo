import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Tree } from 'antd';
import OlGroupLayer from 'ol/layer/group';

import MapUtils from '../Util/MapUtil';
const TreeNode = Tree.TreeNode;

/**
 * The LayerTree.
 *
 * @class The LayerTree
 * @extends React.Component
 */
class LayerTree extends React.Component {

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    draggable: PropTypes.bool,

    layerGroup: PropTypes.instanceOf(OlGroupLayer),

    map: PropTypes.object
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    draggable: true
  }

  /**
   * Create the LayerTree.
   *
   * @constructs LayerTree
   */
  constructor(props) {
    super(props);

    this.state = {
      treeNodes: [],
      checkedKeys: []
    };
  }

  /**
   * Determines what to do on the initial mount.
   */
  componentDidMount() {
    if (this.props.layerGroup) {
      this.treeNodesFromLayerGroup(this.props.layerGroup);
      this.checkedKeysFromLayerGroup(this.props.layerGroup);
    }
  }

  /**
   * Determines what to do with new props.
   *
   * @param {Object} nextProps The new props.
   */
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.layerGroup, nextProps.layerGroup)) {
      this.treeNodesFromLayerGroup(nextProps.layerGroup);
      this.checkedKeysFromLayerGroup(nextProps.layerGroup);
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
   * Determines the checkedKeys from a given layerGroup. Iterates over its children
   * and adds visibile layers to the checkedKeysArray in the state.
   *
   * @param {ol.layer.Group} groupLayer A grouplayer.
   */
  checkedKeysFromLayerGroup(groupLayer) {
    const allLayers = MapUtils.getAllLayers(groupLayer);
    let checkedKeys = [];
    allLayers.forEach((layer) => {
      if (layer.getVisible()) {
        checkedKeys.push(layer.ol_uid.toString());
      }
    });
    this.setState({checkedKeys});
  }

  /**
   * Creates a treeNode from a given layer.
   *
   * @param {ol.layer.Layer} layer The given layer.
   * @return {TreeNode} The corresponding TreeNode Element.
   */
  treeNodeFromLayer(layer) {
    let childNodes;
    let treeNode;
    if (layer instanceof OlGroupLayer) {
      const childLayers = layer.getLayers().getArray();
      childNodes = childLayers.map((childLayer) => {
        return this.treeNodeFromLayer(childLayer);
      });
    }
    treeNode = <TreeNode
      title={layer.get('name')}
      key={layer.ol_uid}
    >
      {childNodes}
    </TreeNode>;
    return treeNode;
  }

  /**
   * Sets the visibility of a layer due to its checked state.
   *
   * @param {Array<String>} checkedKeys Contains all checkedKeys.
   * @param {e} checked The ant-tree event object for this event. See ant docs.
   */
  onCheck = (checkedKeys, e) => {
    const {checked} = e;
    const layer = MapUtils.getLayerByOlUid(this.props.map, e.node.props.eventKey);
    if (layer) {
      layer.setVisible(checked);
    }
    this.setState({checkedKeys});
  }

  /**
   * The callback method for the drop event. Layers will get reordered in the map
   * and the tree.
   *
   * @param {Object} e The ant-tree event object for this event. See ant docs.
   */
  onDrop = (e) => {
    const dragLayer = MapUtils.getLayerByOlUid(this.props.map, e.dragNode.props.eventKey);
    const dragInfo = this.getLayerPositionInfo(dragLayer);
    const dropLayer = MapUtils.getLayerByOlUid(this.props.map, e.node.props.eventKey);
    const dropPos = e.node.props.pos.split('-');
    const location = e.dropPosition - Number(dropPos[dropPos.length - 1]);

    dragInfo.collection.remove(dragLayer);

    const info = this.getLayerPositionInfo(dropLayer);
    const dropPosition = info.position;
    const dropCollection = info.collection;

    // drop before node
    if (location === -1) {
      if (dropPosition === 0) {
        dropCollection.insertAt(0, dragLayer);
      } else {
        dropCollection.insertAt(dropPosition, dragLayer);
      }
    // drop on node
    } else if (location === 0) {
      if (dropLayer instanceof OlGroupLayer) {
        dropLayer.getLayers().push(dragLayer);
      } else {
        dropCollection.insertAt(dropPosition + 1, dragLayer);
      }
    // drop after node
    } else if (location === 1) {
      dropCollection.insertAt(dropPosition + 1, dragLayer);
    }

    this.treeNodesFromLayerGroup(this.props.layerGroup);
  }

  /**
   * Get information about the LayerPosition in the tree.
   *
   * @param {ol.layer.Layer} layer The layer to get the information.
   * @param {ol.layer.Group} [groupLayer = this.props.map] The groupLayer
   *                                     containg the layer.
   * @return {Object} An object with these keys:
   *    {ol.layer.Group} collection The collection containing the layer.
   *    {Integer} position The position of the layer in the collection.
   */
  getLayerPositionInfo = (layer, groupLayer) => {
    const map = this.props.map;
    const collection = groupLayer instanceof OlGroupLayer
      ? groupLayer.getLayers()
      : map.getLayers();
    const layers = collection.getArray();
    let info = {};

    if (layers.indexOf(layer) < 0) {
      layers.forEach((childLayer) => {
        if (childLayer instanceof OlGroupLayer) {
          info = this.getLayerPositionInfo(layer, childLayer);
        }
      });
    } else {
      info.position = layers.indexOf(layer);
      info.collection = collection;
    }
    return info;
  }

  /**
   * The render function.
   */
  render() {
    const props = {...this.props};
    let ddListeners;
    if (props.draggable) {
      ddListeners = {
        onDragStart: this.onDragStart,
        onDragEnter: this.onDragEnter,
        onDragOver: this.onDragOver,
        onDragLeave: this.onDragLeave,
        onDragEnd: this.onDragEnd,
        onDrop: this.onDrop
      };
    }

    return (
      <Tree
        checkable
        {...ddListeners}
        {...props}
        checkedKeys={this.state.checkedKeys}
        onCheck={this.onCheck}
      >
        {this.state.treeNodes}
      </Tree>
    );
  }
}

export default LayerTree;

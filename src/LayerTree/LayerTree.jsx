import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Tree } from 'antd';
import OlGroupLayer from 'ol/layer/group';

import Logger from '../Util/Logger';
import MapUtil from '../Util/MapUtil';
const TreeNode = Tree.TreeNode;

/**
 * The LayerTree.
 *
 * Note. This component expects that all layerGroups are permanently visibile.
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
      const checkedKeys = this.getVisibleOlUids();
      this.setState({
        checkedKeys
      });
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
      const checkedKeys = this.getVisibleOlUids();
      this.setState({
        checkedKeys
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
   * Creates a treeNode from a given layer.
   *
   * @param {ol.layer.Layer} layer The given layer.
   * @return {TreeNode} The corresponding TreeNode Element.
   */
  treeNodeFromLayer(layer) {
    let childNodes;
    let treeNode;

    if (layer instanceof OlGroupLayer) {
      if (!layer.getVisible()) {
        Logger.warn('Your map configuration contains layerGroups that are' +
        'invisible. This might lead to buggy behaviour.');
      }

      const childLayers = layer.getLayers().getArray();
      childNodes = childLayers.map((childLayer) => {
        return this.treeNodeFromLayer(childLayer);
      });
    } else {
      layer.on('change:visible', this.onLayerChangeVisible);
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
   * Reacts to the layer change:visible event and calls setCheckedState.
   *
   * @param {ol.Object.Event} evt The change:visible event
   */
  onLayerChangeVisible = () => {
    const checkedKeys = this.getVisibleOlUids();
    this.setState({
      checkedKeys
    });
  }

  /**
   * Get the flat array of ol_uids from visible non groupLayers.
   *
   * @return {Array<String>} The visible ol_uids.
   */
  getVisibleOlUids = () => {
    const layers = MapUtil.getAllLayers(this.props.layerGroup, (layer) => {
      return !(layer instanceof OlGroupLayer) && layer.getVisible();
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
    if (!layer) {
      Logger.error('LayerTree.setLayerVisibility called without layer.');
      return;
    }
    if (layer instanceof OlGroupLayer) {
      layer.getLayers().forEach((subLayer) => {
        this.setLayerVisibility(subLayer, visiblity);
      });
    } else {
      layer.setVisible(visiblity);
    }
  }

  /**
   * Remove layerGroup.ol_uids from checkedKeys array.
   *
   * @param {Array<String>} checkedKeys The checkedKeys.
   * @return {Array<String>} The cleaned up checkedKeys.
   */
  cleanupCheckedKeys = (checkedKeys) => {
    return checkedKeys.filter((key) => {
      const layer = MapUtil.getLayerByOlUid(this.props.map, key);
      return !(layer instanceof OlGroupLayer);
    });
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
    const dropLayer = MapUtil.getLayerByOlUid(this.props.map, e.node.props.eventKey);
    const dropPos = e.node.props.pos.split('-');
    const location = e.dropPosition - Number(dropPos[dropPos.length - 1]);

    dragInfo.groupLayer.remove(dragLayer);

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

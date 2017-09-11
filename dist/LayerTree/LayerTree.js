'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _css = require('antd/lib/tree/style/css');

var _tree = require('antd/lib/tree');

var _tree2 = _interopRequireDefault(_tree);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _group = require('ol/layer/group');

var _group2 = _interopRequireDefault(_group);

var _MapUtil = require('../Util/MapUtil');

var _MapUtil2 = _interopRequireDefault(_MapUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeNode = _tree2.default.TreeNode;

/**
 * The LayerTree.
 *
 * @class The LayerTree
 * @extends React.Component
 */

var LayerTree = function (_React$Component) {
  _inherits(LayerTree, _React$Component);

  /**
   * Create the LayerTree.
   *
   * @constructs LayerTree
   */


  /**
   * The properties.
   * @type {Object}
   */
  function LayerTree(props) {
    _classCallCheck(this, LayerTree);

    var _this = _possibleConstructorReturn(this, (LayerTree.__proto__ || Object.getPrototypeOf(LayerTree)).call(this, props));

    _this.onCheck = function (checkedKeys, e) {
      var checked = e.checked;

      var layer = _MapUtil2.default.getLayerByOlUid(_this.props.map, e.node.props.eventKey);
      if (layer) {
        layer.setVisible(checked);
      }
      _this.setState({ checkedKeys: checkedKeys });
    };

    _this.onDrop = function (e) {
      var dragLayer = _MapUtil2.default.getLayerByOlUid(_this.props.map, e.dragNode.props.eventKey);
      var dragInfo = _this.getLayerPositionInfo(dragLayer);
      var dropLayer = _MapUtil2.default.getLayerByOlUid(_this.props.map, e.node.props.eventKey);
      var dropPos = e.node.props.pos.split('-');
      var location = e.dropPosition - Number(dropPos[dropPos.length - 1]);

      dragInfo.collection.remove(dragLayer);

      var info = _this.getLayerPositionInfo(dropLayer);
      var dropPosition = info.position;
      var dropCollection = info.collection;

      // drop before node
      if (location === -1) {
        if (dropPosition === 0) {
          dropCollection.insertAt(0, dragLayer);
        } else {
          dropCollection.insertAt(dropPosition, dragLayer);
        }
        // drop on node
      } else if (location === 0) {
        if (dropLayer instanceof _group2.default) {
          dropLayer.getLayers().push(dragLayer);
        } else {
          dropCollection.insertAt(dropPosition + 1, dragLayer);
        }
        // drop after node
      } else if (location === 1) {
        dropCollection.insertAt(dropPosition + 1, dragLayer);
      }

      _this.treeNodesFromLayerGroup(_this.props.layerGroup);
    };

    _this.getLayerPositionInfo = function (layer, groupLayer) {
      var map = _this.props.map;
      var collection = groupLayer instanceof _group2.default ? groupLayer.getLayers() : map.getLayers();
      var layers = collection.getArray();
      var info = {};

      if (layers.indexOf(layer) < 0) {
        layers.forEach(function (childLayer) {
          if (childLayer instanceof _group2.default) {
            info = _this.getLayerPositionInfo(layer, childLayer);
          }
        });
      } else {
        info.position = layers.indexOf(layer);
        info.collection = collection;
      }
      return info;
    };

    _this.state = {
      treeNodes: [],
      checkedKeys: []
    };
    return _this;
  }

  /**
   * Determines what to do on the initial mount.
   */


  /**
   * The default properties.
   * @type {Object}
   */


  _createClass(LayerTree, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
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

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!(0, _lodash.isEqual)(this.props.layerGroup, nextProps.layerGroup)) {
        this.treeNodesFromLayerGroup(nextProps.layerGroup);
        this.checkedKeysFromLayerGroup(nextProps.layerGroup);
      }
    }

    /**
     * Creates TreeNodes from a given layergroup and sets the treeNodes in the state.
     *
     * @param {ol.layer.Group} groupLayer A grouplayer.
     */

  }, {
    key: 'treeNodesFromLayerGroup',
    value: function treeNodesFromLayerGroup(groupLayer) {
      var _this2 = this;

      var layerArray = groupLayer.getLayers().getArray();
      var treeNodes = layerArray.map(function (layer) {
        return _this2.treeNodeFromLayer(layer);
      });
      this.setState({ treeNodes: treeNodes });
    }

    /**
     * Determines the checkedKeys from a given layerGroup. Iterates over its children
     * and adds visibile layers to the checkedKeysArray in the state.
     *
     * @param {ol.layer.Group} groupLayer A grouplayer.
     */

  }, {
    key: 'checkedKeysFromLayerGroup',
    value: function checkedKeysFromLayerGroup(groupLayer) {
      var allLayers = _MapUtil2.default.getAllLayers(groupLayer);
      var checkedKeys = [];
      allLayers.forEach(function (layer) {
        if (layer.getVisible()) {
          checkedKeys.push(layer.ol_uid.toString());
        }
      });
      this.setState({ checkedKeys: checkedKeys });
    }

    /**
     * Creates a treeNode from a given layer.
     *
     * @param {ol.layer.Layer} layer The given layer.
     * @return {TreeNode} The corresponding TreeNode Element.
     */

  }, {
    key: 'treeNodeFromLayer',
    value: function treeNodeFromLayer(layer) {
      var _this3 = this;

      var childNodes = void 0;
      var treeNode = void 0;
      if (layer instanceof _group2.default) {
        var childLayers = layer.getLayers().getArray();
        childNodes = childLayers.map(function (childLayer) {
          return _this3.treeNodeFromLayer(childLayer);
        });
      }
      treeNode = _react2.default.createElement(
        TreeNode,
        {
          title: layer.get('name'),
          key: layer.ol_uid
        },
        childNodes
      );
      return treeNode;
    }

    /**
     * Sets the visibility of a layer due to its checked state.
     *
     * @param {Array<String>} checkedKeys Contains all checkedKeys.
     * @param {e} checked The ant-tree event object for this event. See ant docs.
     */


    /**
     * The callback method for the drop event. Layers will get reordered in the map
     * and the tree.
     *
     * @param {Object} e The ant-tree event object for this event. See ant docs.
     */


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

  }, {
    key: 'render',


    /**
     * The render function.
     */
    value: function render() {
      var props = _extends({}, this.props);
      var ddListeners = void 0;
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

      return _react2.default.createElement(
        _tree2.default,
        _extends({
          checkable: true
        }, ddListeners, props, {
          checkedKeys: this.state.checkedKeys,
          onCheck: this.onCheck
        }),
        this.state.treeNodes
      );
    }
  }]);

  return LayerTree;
}(_react2.default.Component);

LayerTree.propTypes = {
  draggable: _propTypes2.default.bool,

  layerGroup: _propTypes2.default.instanceOf(_group2.default),

  map: _propTypes2.default.object
};
LayerTree.defaultProps = {
  draggable: true };
exports.default = LayerTree;
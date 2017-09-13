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

var _base = require('ol/layer/base');

var _base2 = _interopRequireDefault(_base);

var _group = require('ol/layer/group');

var _group2 = _interopRequireDefault(_group);

var _observable = require('ol/observable');

var _observable2 = _interopRequireDefault(_observable);

var _Logger = require('../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

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
 * Note. This component expects that all layerGroups are permanently visibile.
 *
 * @class LayerTree
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

    _this.olListenerKeys = [];

    _this.registerAddRemoveListeners = function (groupLayer) {
      var collection = groupLayer.getLayers();
      var addEvtKey = collection.on('add', _this.onCollectionAdd);
      var removeEvtKey = collection.on('remove', _this.onCollectionRemove);

      _this.olListenerKeys.push(addEvtKey, removeEvtKey);

      collection.forEach(function (layer) {
        if (layer instanceof _group2.default) {
          _this.registerAddRemoveListeners(layer);
        }
      });
    };

    _this.onCollectionAdd = function (evt) {
      if (evt.element instanceof _group2.default) {
        _this.registerAddRemoveListeners(evt.element);
      }
      _this.rebuildTreeNodes();
    };

    _this.onCollectionRemove = function (evt) {
      _this.unregisterEventsByLayer(evt.element);
      if (evt.element instanceof _group2.default) {
        evt.element.getLayers().forEach(function (layer) {
          _this.unregisterEventsByLayer(layer);
        });
      }
      _this.rebuildTreeNodes();
    };

    _this.unregisterEventsByLayer = function (layer) {
      _this.olListenerKeys = _this.olListenerKeys.filter(function (key) {
        if (layer instanceof _group2.default) {
          var layers = layer.getLayers();
          if (key.target === layers) {
            if (key.type === 'add' && key.listener === _this.onCollectionAdd || key.type === 'remove' && key.listener === _this.onCollectionRemove) {

              _observable2.default.unByKey(key);
              return false;
            }
          }
        } else if (key.target === layer) {
          if (key.type === 'change:visible' && key.listener === _this.onLayerChangeVisible) {
            _observable2.default.unByKey(key);
            return false;
          }
        }
        return true;
      });
    };

    _this.rebuildTreeNodes = function () {
      _this.treeNodesFromLayerGroup(_this.state.layerGroup);
      var checkedKeys = _this.getVisibleOlUids();
      _this.setState({
        checkedKeys: checkedKeys
      });
    };

    _this.hasListener = function (target, type, listener) {
      return _this.olListenerKeys.some(function (listenerKey) {
        return listenerKey.target === target && listenerKey.type === type && listenerKey.listener === listener;
      });
    };

    _this.onLayerChangeVisible = function () {
      var checkedKeys = _this.getVisibleOlUids();
      _this.setState({
        checkedKeys: checkedKeys
      });
    };

    _this.getVisibleOlUids = function () {
      var layers = _MapUtil2.default.getAllLayers(_this.state.layerGroup, function (layer) {
        return !(layer instanceof _group2.default) && layer.getVisible();
      });
      return layers.map(function (l) {
        return l.ol_uid.toString();
      });
    };

    _this.onCheck = function (checkedKeys, e) {
      var checked = e.checked;

      var eventKey = e.node.props.eventKey;
      var layer = _MapUtil2.default.getLayerByOlUid(_this.props.map, eventKey);

      _this.setLayerVisibility(layer, checked);
    };

    _this.setLayerVisibility = function (layer, visiblity) {
      if (!(layer instanceof _base2.default) || !(0, _lodash.isBoolean)(visiblity)) {
        _Logger2.default.error('setLayerVisibility called without layer or visiblity.');
        return;
      }
      if (layer instanceof _group2.default) {
        layer.getLayers().forEach(function (subLayer) {
          _this.setLayerVisibility(subLayer, visiblity);
        });
      } else {
        layer.setVisible(visiblity);
      }
    };

    _this.onDrop = function (e) {
      var dragLayer = _MapUtil2.default.getLayerByOlUid(_this.props.map, e.dragNode.props.eventKey);
      var dragInfo = _MapUtil2.default.getLayerPositionInfo(dragLayer, _this.props.map);
      var dragCollection = dragInfo.groupLayer.getLayers();
      var dropLayer = _MapUtil2.default.getLayerByOlUid(_this.props.map, e.node.props.eventKey);
      var dropPos = e.node.props.pos.split('-');
      var location = e.dropPosition - Number(dropPos[dropPos.length - 1]);

      dragCollection.remove(dragLayer);

      var info = _MapUtil2.default.getLayerPositionInfo(dropLayer, _this.props.map);
      var dropPosition = info.position;
      var dropCollection = info.groupLayer.getLayers();

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

      _this.rebuildTreeNodes();
    };

    _this.state = {
      layerGrop: null,
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
   *
   * @type {Object}
   */


  /**
   *  An array of ol.EventsKey as returned by on() or once().
   * @type {Array<ol.EventsKey>}
   * @private
   */


  _createClass(LayerTree, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.props.layerGroup) {
        this.setState({
          layerGroup: this.props.layerGroup
        }, function () {
          _this2.registerAddRemoveListeners(_this2.state.layerGroup);
          _this2.rebuildTreeNodes();
        });
      }
    }

    /**
     * Determines what to do on the initial mount.
     */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _observable2.default.unByKey(this.olListenerKeys);
    }

    /**
     * Determines what to do with new props.
     *
     * @param {Object} nextProps The new props.
     */

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      if (!(0, _lodash.isEqual)(this.props.layerGroup, nextProps.layerGroup)) {
        _observable2.default.unByKey(this.olListenerKeys);
        this.olListenerKeys = [];

        this.setState({
          layerGroup: nextProps.layerGroup
        }, function () {
          _this3.registerAddRemoveListeners(_this3.state.layerGroup);
          _this3.rebuildTreeNodes();
        });
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
      var _this4 = this;

      var layerArray = groupLayer.getLayers().getArray();
      var treeNodes = layerArray.map(function (layer) {
        return _this4.treeNodeFromLayer(layer);
      });
      this.setState({ treeNodes: treeNodes });
    }

    /**
     * Registers the add/remove listeners recursively for all ol.layer.Group.
     *
     * @param {ol.layer.Group} groupLayer A ol.layer.Group
     */


    /**
     * Listens to the collections add event of a collection.
     * Registers add/remove listeners if element is a collection and rebuilds the
     * treeNodes.
     *
     * @param {ol.Collection.Event} evt The add event.
     */


    /**
     * Listens to the collections remove event of a collection.
     * Unregisters the events of deleted layers and rebuilds the treeNodes.
     *
     * @param {ol.Collection.Event} evt The remove event.
     */


    /**
     * Unregisters the Events of a given layer.
     *
     * @param {ol.layer.Base} layer An ol.layer.Base.
     */


    /**
     * Rebuilds the treeNodes and its checked states.
     */

  }, {
    key: 'treeNodeFromLayer',


    /**
     * Creates a treeNode from a given layer.
     *
     * @param {ol.layer.Layer} layer The given layer.
     * @return {TreeNode} The corresponding TreeNode Element.
     */
    value: function treeNodeFromLayer(layer) {
      var _this5 = this;

      var childNodes = void 0;
      var treeNode = void 0;

      if (layer instanceof _group2.default) {
        if (!layer.getVisible()) {
          _Logger2.default.warn('Your map configuration contains layerGroups that are' + 'invisible. This might lead to buggy behaviour.');
        }

        var childLayers = layer.getLayers().getArray();
        childNodes = childLayers.map(function (childLayer) {
          return _this5.treeNodeFromLayer(childLayer);
        });
      } else {
        if (!this.hasListener(layer, 'change:visible', this.onLayerChangeVisible)) {
          var eventKey = layer.on('change:visible', this.onLayerChangeVisible);
          this.olListenerKeys.push(eventKey);
        }
      }

      treeNode = _react2.default.createElement(
        TreeNode,
        {
          className: 'react-geo-layertree-node',
          title: layer.get('name'),
          key: layer.ol_uid
        },
        childNodes
      );
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


    /**
     * Reacts to the layer change:visible event and calls setCheckedState.
     *
     * @param {ol.Object.Event} evt The change:visible event
     */


    /**
     * Get the flat array of ol_uids from visible non groupLayers.
     *
     * @return {Array<String>} The visible ol_uids.
     */


    /**
     * Sets the visibility of a layer due to its checked state.
     *
     * @param {Array<String>} checkedKeys Contains all checkedKeys.
     * @param {e} checked The ant-tree event object for this event. See ant docs.
     */


    /**
     * Sets the layer visibility. Calls itself recursively for groupLayers.
     *
     * @param {ol.layer.Base} layer The layer.
     * @param {Boolean} visiblity The visiblity.
     */


    /**
     * The callback method for the drop event. Layers will get reordered in the map
     * and the tree.
     *
     * @param {Object} e The ant-tree event object for this event. See ant docs.
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

  map: _propTypes2.default.object };
LayerTree.defaultProps = {
  draggable: true };
exports.default = LayerTree;
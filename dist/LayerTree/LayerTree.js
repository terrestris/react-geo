'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tree = require('antd/lib/tree');

var _tree2 = _interopRequireDefault(_tree);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('antd/lib/tree/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _map = require('ol/map');

var _map2 = _interopRequireDefault(_map);

var _base = require('ol/layer/base');

var _base2 = _interopRequireDefault(_base);

var _group = require('ol/layer/group');

var _group2 = _interopRequireDefault(_group);

var _observable = require('ol/observable');

var _observable2 = _interopRequireDefault(_observable);

var _Logger = require('../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _MapUtil = require('../Util/MapUtil/MapUtil');

var _MapUtil2 = _interopRequireDefault(_MapUtil);

var _LayerTreeNode = require('../LayerTreeNode/LayerTreeNode.js');

var _LayerTreeNode2 = _interopRequireDefault(_LayerTreeNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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


  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  function LayerTree(props) {
    _classCallCheck(this, LayerTree);

    var _this = _possibleConstructorReturn(this, (LayerTree.__proto__ || Object.getPrototypeOf(LayerTree)).call(this, props));

    _this.className = 'react-geo-layertree';
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
      }, function () {
        _this.rebuildTreeNodes();
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

      var dropInfo = _MapUtil2.default.getLayerPositionInfo(dropLayer, _this.props.map);
      var dropPosition = dropInfo.position;
      var dropCollection = dropInfo.groupLayer.getLayers();

      // drop before node
      if (location === -1) {
        if (dropPosition === dropCollection.getLength() - 1) {
          dropCollection.push(dragLayer);
        } else {
          dropCollection.insertAt(dropPosition + 1, dragLayer);
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
        dropCollection.insertAt(dropPosition, dragLayer);
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

      var layerGroup = this.props.layerGroup ? this.props.layerGroup : this.props.map.getLayerGroup();

      this.setState({
        layerGroup: layerGroup
      }, function () {
        _this2.registerAddRemoveListeners(_this2.state.layerGroup);
        _this2.registerResolutionChangeHandler();
        _this2.rebuildTreeNodes();
      });
    }

    /**
     * Determines what to do when the component is unmounted.
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
      if (this.props.filterFunction) {
        layerArray = layerArray.filter(this.props.filterFunction);
      }
      var treeNodes = layerArray.map(function (layer) {
        return _this4.treeNodeFromLayer(layer);
      });
      treeNodes.reverse();
      this.setState({ treeNodes: treeNodes });
    }

    /**
     * Registers the add/remove listeners recursively for all ol.layer.Group.
     *
     * @param {ol.layer.Group} groupLayer A ol.layer.Group
     */

  }, {
    key: 'registerResolutionChangeHandler',


    /**
     * Registers an eventhandler on the `ol.View`, which will rebuild the tree
     * nodes whenever the view's resolution changes.
     */
    value: function registerResolutionChangeHandler() {
      var _this5 = this;

      var mapView = this.props.map.getView();
      var evtKey = mapView.on('change:resolution', function () {
        _this5.rebuildTreeNodes();
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
    key: 'getTreeNodeTitle',


    /**
     * Returns the title to render in the LayerTreeNode. If a nodeTitleRenderer
     * has been passed as prop, it will be called and the (custom) return value
     * will be rendered. Note: This can be any renderable element collection! If
     * no function is given (the default) the layer name will be passed.
     *
     * @param {ol.layer.Base} layer The layer attached to the tree node.
     * @return {Element} The title composition to render.
     */
    value: function getTreeNodeTitle(layer) {
      if ((0, _lodash.isFunction)(this.props.nodeTitleRenderer)) {
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

  }, {
    key: 'treeNodeFromLayer',
    value: function treeNodeFromLayer(layer) {
      var _this6 = this;

      var childNodes = void 0;
      var treeNode = void 0;

      if (layer instanceof _group2.default) {
        if (!layer.getVisible()) {
          _Logger2.default.warn('Your map configuration contains layerGroups that are' + 'invisible. This might lead to buggy behaviour.');
        }
        var childLayers = layer.getLayers().getArray();
        if (this.props.filterFunction) {
          childLayers = childLayers.filter(this.props.filterFunction);
        }
        childNodes = childLayers.map(function (childLayer) {
          return _this6.treeNodeFromLayer(childLayer);
        });
        childNodes.reverse();
      } else {
        if (!this.hasListener(layer, 'change:visible', this.onLayerChangeVisible)) {
          var eventKey = layer.on('change:visible', this.onLayerChangeVisible);
          this.olListenerKeys.push(eventKey);
        }
      }

      treeNode = _react2.default.createElement(
        _LayerTreeNode2.default,
        {
          title: this.getTreeNodeTitle(layer),
          key: layer.ol_uid,
          inResolutionRange: _MapUtil2.default.layerInResolutionRange(layer, this.props.map)
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
      var _props = this.props,
          className = _props.className,
          layerGroup = _props.layerGroup,
          map = _props.map,
          nodeTitleRenderer = _props.nodeTitleRenderer,
          passThroughProps = _objectWithoutProperties(_props, ['className', 'layerGroup', 'map', 'nodeTitleRenderer']);

      var ddListeners = void 0;
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

      var finalClassName = className ? className + ' ' + this.className : this.className;

      return _react2.default.createElement(
        _tree2.default,
        _extends({
          className: finalClassName,
          checkedKeys: this.state.checkedKeys,
          onCheck: this.onCheck
        }, ddListeners, passThroughProps),
        this.state.treeNodes
      );
    }
  }]);

  return LayerTree;
}(_react2.default.Component);

LayerTree.propTypes = {
  /**
   * The className which should be added.
   * @type {String}
   */
  className: _propTypes2.default.string,

  layerGroup: _propTypes2.default.instanceOf(_group2.default),

  map: _propTypes2.default.instanceOf(_map2.default).isRequired,

  /**
   * A function that can be used to pass a custom node title. It can return
   * any renderable element (String, Number, Element etc.) and receives
   * the layer instance of the current tree node.
   * @type {Function}
   */
  nodeTitleRenderer: _propTypes2.default.func,

  /**
   * An optional array-filter function that is applied to every layer and
   * subLayer. Return false to exclude this layer from the layerTree or true
   * to include it.
   *
   * Compare MDN Docs for Array.prototype.filter: https://mdn.io/array/filter
   *
   * @type {Function}
   */
  filterFunction: _propTypes2.default.func };
LayerTree.defaultProps = {
  draggable: true,
  checkable: true };
exports.default = LayerTree;
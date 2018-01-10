'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddWmsPanel = undefined;

var _checkbox = require('antd/lib/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('antd/lib/checkbox/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _tile = require('ol/layer/tile');

var _tile2 = _interopRequireDefault(_tile);

var _image = require('ol/layer/image');

var _image2 = _interopRequireDefault(_image);

var _map = require('ol/map');

var _map2 = _interopRequireDefault(_map);

var _lodash = require('lodash');

var _Panel = require('../../Panel/Panel/Panel');

var _Panel2 = _interopRequireDefault(_Panel);

var _Titlebar = require('../../Panel/Titlebar/Titlebar');

var _Titlebar2 = _interopRequireDefault(_Titlebar);

var _SimpleButton = require('../../Button/SimpleButton/SimpleButton');

var _SimpleButton2 = _interopRequireDefault(_SimpleButton);

var _Logger = require('../../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

require('./AddWmsPanel.less');

var _AddWmsLayerEntry = require('./AddWmsLayerEntry/AddWmsLayerEntry.js');

var _AddWmsLayerEntry2 = _interopRequireDefault(_AddWmsLayerEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Panel containing a (checkable) list of AddWmsLayerEntry instances.
 * This class can be used e.g with a result obtained by ol WMS capabilities
 * parser, in particular objects in `Capability.Layer.Layer`
 *
 * @class The AddWmsPanel
 * @extends React.Component
 */
var AddWmsPanel = exports.AddWmsPanel = function (_React$Component) {
  _inherits(AddWmsPanel, _React$Component);

  /**
   * Create an AddWmsPanel.
   * @constructs AddWmsPanel
   */
  function AddWmsPanel(props) {
    _classCallCheck(this, AddWmsPanel);

    var _this = _possibleConstructorReturn(this, (AddWmsPanel.__proto__ || Object.getPrototypeOf(AddWmsPanel)).call(this, props));

    _this.onSelectedLayersChange = function (selectedWmsLayers) {
      var onSelectionChange = _this.props.onSelectionChange;


      if ((0, _lodash.isFunction)(onSelectionChange)) {
        onSelectionChange(selectedWmsLayers);
      }

      _this.setState({ selectedWmsLayers: selectedWmsLayers });
    };

    _this.onAddSelectedLayers = function () {
      var selectedWmsLayers = _this.state.selectedWmsLayers;
      var _this$props = _this.props,
          onLayerAddToMap = _this$props.onLayerAddToMap,
          map = _this$props.map;


      var filteredLayers = _this.props.wmsLayers.filter(function (layer) {
        return selectedWmsLayers.includes(layer.get('title'));
      });

      if (onLayerAddToMap) {
        onLayerAddToMap(filteredLayers);
      } else if (map) {
        filteredLayers.forEach(function (layer) {
          // Add layer to map if it is not added yet
          if (!map.getLayers().getArray().includes(layer)) {
            map.addLayer(layer);
          }
        });
      } else {
        _Logger2.default.warn('Neither map nor onLayerAddToMap given in props. Will do nothing.');
      }
    };

    _this.onAddAllLayers = function () {
      var _this$props2 = _this.props,
          onLayerAddToMap = _this$props2.onLayerAddToMap,
          wmsLayers = _this$props2.wmsLayers,
          map = _this$props2.map;


      if (onLayerAddToMap) {
        onLayerAddToMap(wmsLayers);
      } else if (map) {
        wmsLayers.forEach(function (layer) {
          // Add layer to map if it is not added yet
          if (!map.getLayers().getArray().includes(layer)) {
            map.addLayer(layer);
          }
        });
      } else {
        _Logger2.default.warn('Neither map nor onLayerAddToMap given in props. Will do nothing.');
      }
    };

    _this.state = {
      selectedWmsLayers: []
    };
    return _this;
  }

  /**
   * The defaultProps.
   * @type {Object}
   */


  /**
   * The prop types.
   * @type {Object}
   */


  /**
   * onSelectedLayersChange - set state for selectedWmsLayers
   *
   * @param {Array} selectedWmsLayers titles of selected WMS layers to set
   * in state
   */


  /**
   * onAddSelectedLayers - function called if button with key useSelectedBtn is
   * clicked filters wmsLayers given in props by those in selectedWmsLayers of
   * state
   */


  /**
   * onAddAllLayers - pass all wmsLayers of props to onLayerAddToMap function
   */


  _createClass(AddWmsPanel, [{
    key: 'render',


    /**
     * The render function.
     */
    value: function render() {
      var _props = this.props,
          wmsLayers = _props.wmsLayers,
          onCancel = _props.onCancel,
          titleText = _props.titleText,
          cancelText = _props.cancelText,
          addAllLayersText = _props.addAllLayersText,
          addSelectedLayersText = _props.addSelectedLayersText,
          passThroughOpts = _objectWithoutProperties(_props, ['wmsLayers', 'onCancel', 'titleText', 'cancelText', 'addAllLayersText', 'addSelectedLayersText']);

      var selectedWmsLayers = this.state.selectedWmsLayers;


      return wmsLayers && wmsLayers.length > 0 ? _react2.default.createElement(
        _Panel2.default,
        _extends({
          title: titleText,
          bounds: '#main',
          className: 'add-wms-panel'
        }, passThroughOpts),
        _react2.default.createElement(
          _checkbox2.default.Group,
          { onChange: this.onSelectedLayersChange },
          wmsLayers.map(function (layer, idx) {
            return _react2.default.createElement(_AddWmsLayerEntry2.default, {
              wmsLayer: layer,
              key: idx });
          })
        ),
        _react2.default.createElement(_Titlebar2.default, { tools: [_react2.default.createElement(
            _SimpleButton2.default,
            {
              size: 'small',
              key: 'useSelectedBtn',
              disabled: selectedWmsLayers.length === 0,
              onClick: this.onAddSelectedLayers
            },
            addSelectedLayersText
          ), _react2.default.createElement(
            _SimpleButton2.default,
            {
              size: 'small',
              key: 'useAllBtn',
              onClick: this.onAddAllLayers
            },
            addAllLayersText
          ), onCancel ? _react2.default.createElement(
            _SimpleButton2.default,
            {
              size: 'small',
              key: 'cancelBtn',
              onClick: onCancel
            },
            cancelText
          ) : null] })
      ) : null;
    }
  }]);

  return AddWmsPanel;
}(_react2.default.Component);

AddWmsPanel.propTypes = {
  /**
   * Array containing layers (e.g. `Capability.Layer.Layer` of ol capabilities
   * parser)
   * @type {Array} -- required
   */
  wmsLayers: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.instanceOf(_tile2.default), _propTypes2.default.instanceOf(_image2.default)])).isRequired,

  /**
   * Optional instance of OlMap which is used if onLayerAddToMap is not provided
   * @type {OlMap}
   */
  map: _propTypes2.default.instanceOf(_map2.default),

  /**
   * Optional function being called when onAddSelectedLayers or onAddAllLayers
   * is triggered
   * @type {Function}
   */
  onLayerAddToMap: _propTypes2.default.func,

  /**
   * Optional function that is called if cancel button is clicked
   * @type {Function}
   */
  onCancel: _propTypes2.default.func,

  /**
   * Optional function that is called if selection has changed.
   * @type {Function}
   */
  onSelectionChange: _propTypes2.default.func,

  /**
   * Optional text to be shown in button to add all layers
   * @type {String}
   */
  addAllLayersText: _propTypes2.default.string,

  /**
   * Optional text to be shown in button to add selected layers
   * @type {String}
   */
  addSelectedLayersText: _propTypes2.default.string,

  /**
   * Optional text to be shown in cancel button
   * @type {String}
   */
  cancelText: _propTypes2.default.string,

  /**
   * Optional text to be shown in panel title
   * @type {String}
   */
  titleText: _propTypes2.default.string };
AddWmsPanel.defaultProps = {
  addAllLayersText: 'Add all layers',
  addSelectedLayersText: 'Add selected layers',
  cancelText: 'Cancel',
  titleText: 'Add WMS layer' };
exports.default = AddWmsPanel;
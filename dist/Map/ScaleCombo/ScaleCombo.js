'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _css = require('antd/lib/select/style/css');

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _Logger = require('../../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _MapUtil = require('../../Util/MapUtil');

var _MapUtil2 = _interopRequireDefault(_MapUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Option = _select2.default.Option;

/**
 * Class representating a scale combo to choose map scale via a dropdown menu.
 *
 * @class The ScaleCombo
 * @extends React.Component
 */
var ScaleCombo = function (_React$Component) {
  _inherits(ScaleCombo, _React$Component);

  /**
   * Create a map.
   * @constructs Map
   */
  function ScaleCombo(props) {
    _classCallCheck(this, ScaleCombo);

    var _this = _possibleConstructorReturn(this, (ScaleCombo.__proto__ || Object.getPrototypeOf(ScaleCombo)).call(this, props));

    _this.pushScaleOption = function (resolution, mv) {
      var scale = _MapUtil2.default.getScaleForResolution(resolution, mv.getProjection().getUnits());
      // Round scale to nearest multiple of 10.
      var roundScale = Math.round(scale / 10) * 10;
      var option = _react2.default.createElement(
        Option,
        { key: roundScale.toString(), value: roundScale.toString() },
        '1:',
        roundScale.toLocaleString()
      );
      _this.state.scales.push(option);
    };

    _this.getOptionsFromMap = function () {
      if (!(0, _lodash.isEmpty)(_this.state.scales)) {
        _Logger2.default.debug('Array with scales found. Returning');
        return;
      }
      if (!_this.props.map) {
        _Logger2.default.warn('Map component not found. Could not initialize options array.');
        return;
      }

      var map = _this.props.map;
      var mv = map.getView();
      // use existing resolutions array if exists
      var resolutions = mv.getResolutions();
      if ((0, _lodash.isEmpty)(resolutions)) {
        for (var currentZoomLevel = mv.getMaxZoom(); currentZoomLevel >= mv.getMinZoom(); currentZoomLevel--) {
          var resolution = mv.getResolutionForZoom(currentZoomLevel);
          _this.pushScaleOption(resolution, mv);
        }
      } else {
        var reversedResolutions = (0, _lodash.reverse)((0, _lodash.clone)(resolutions));
        reversedResolutions.forEach(function (resolution) {
          _this.pushScaleOption(resolution, mv);
        });
      }
    };

    _this.handleOnKeyDown = function (event) {
      if (event.key === 'Enter') {
        _this.props.onZoomLevelSelect(event.target.value);
      }
    };

    _this.getInputElement = function () {
      return _react2.default.createElement('input', { onKeyDown: _this.handleOnKeyDown });
    };

    _this.pushScaleOption = _this.pushScaleOption.bind(_this);
    _this.getOptionsFromMap = _this.getOptionsFromMap.bind(_this);
    _this.determineOptionKeyForZoomLevel = _this.determineOptionKeyForZoomLevel.bind(_this);
    _this.handleOnKeyDown = _this.handleOnKeyDown.bind(_this);
    _this.getInputElement = _this.getInputElement.bind(_this);
    _this.componentWillMount = _this.componentWillMount.bind(_this);

    _this.state = {
      zoomLevel: props.zoomLevel,
      scales: props.scales
    };
    return _this;
  }

  /**
   * Called on componentWillReceiveProps lifecycle event.
   *
   * @param {Object} newProps The new properties.
   */


  /**
   * The default props
   */


  _createClass(ScaleCombo, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      if (!(0, _lodash.isEqual)(newProps.zoomLevel, this.props.zoomLevel)) {
        this.setState({
          zoomLevel: newProps.zoomLevel
        });
      }
    }

    /**
     * @function pushScaleOption: Helper function to create a {@link Option} scale component
     * based on a resolution and the {@link Ol.View}
     *
     * @param {Number} resolution map cresolution to generate the option for
     * @param {Ol.View} mv The map view
     *
     */


    /**
     * @function getOptionsFromMap: Helper function generate {@link Option} scale components
     * based on an existing instance of {@link Ol.Map}
     */

  }, {
    key: 'determineOptionKeyForZoomLevel',


    /**
     * Determine option element for provided zoom level out of array of valid options.
     *
     * @param {Number} zoom zoom level
     *
     * @return {Element} Option element for provided zoom level
     */
    value: function determineOptionKeyForZoomLevel(zoom) {
      if (!(0, _lodash.isNumber)(zoom) || this.state.scales.length - 1 - zoom < 0) {
        return undefined;
      }
      return this.state.scales[this.state.scales.length - 1 - zoom].key;
    }

    /**
     * handleOnKeyDown of input:
     * trigger setScale (passed by props) after ENTER key pressed
     *
     * @param {Event} event KeyBoard event
     */


    /**
     * Create input element with registered onKeyDown event used in Select
     *
     * @return {Element} input of scale chooser
     */

  }, {
    key: 'componentWillMount',


    /**
     * componentWillMount - Description
     *
     * @return {type} Description
     */
    value: function componentWillMount() {
      if ((0, _lodash.isEmpty)(this.state.scales) && this.props.map) {
        this.getOptionsFromMap();
      }
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          onZoomLevelSelect = _props.onZoomLevelSelect,
          style = _props.style;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _select2.default,
          {
            showSearch: true,
            onChange: onZoomLevelSelect,
            getInputElement: this.getInputElement,
            filterOption: false,
            value: this.determineOptionKeyForZoomLevel(this.state.zoomLevel),
            size: 'small',
            style: style,
            className: 'scale-select'
          },
          this.state.scales
        )
      );
    }
  }]);

  return ScaleCombo;
}(_react2.default.Component);

ScaleCombo.propTypes = {
  /**
   * The zoomLevel.
   * @type {Number}
   */
  zoomLevel: _propTypes2.default.number,

  /**
   * The onZoomLevelSelect function. This function is passed to Select component
   * @type {Function}
   */
  onZoomLevelSelect: _propTypes2.default.func.isRequired,

  /**
   * The resolutions.
   * @type {Array}
   */
  resolutions: _propTypes2.default.arrayOf(_propTypes2.default.number),

  /**
   * The scales.
   * @type {Array}
   */
  scales: _propTypes2.default.arrayOf(_propTypes2.default.shape),

  /**
   * The style object
   * @type {Object}
   */
  style: _propTypes2.default.object,

  /**
   * The map
   * @type {Ol.Map}
   */
  map: _propTypes2.default.object };
ScaleCombo.defaultProps = {
  style: {
    width: 100
  },
  scales: [] };
exports.default = ScaleCombo;
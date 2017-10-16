'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slider = require('antd/lib/slider');

var _slider2 = _interopRequireDefault(_slider);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('antd/lib/slider/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _base = require('ol/layer/base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The LayerTransparencySlider.
 *
 * @class The LayerTransparencySlider
 * @extends React.Component
 */
var LayerTransparencySlider = function (_React$Component) {
  _inherits(LayerTransparencySlider, _React$Component);

  /**
   * Create the LayerTransparencySlider.
   *
   * @constructs LayerTransparencySlider
   */
  function LayerTransparencySlider(props) {
    _classCallCheck(this, LayerTransparencySlider);

    return _possibleConstructorReturn(this, (LayerTransparencySlider.__proto__ || Object.getPrototypeOf(LayerTransparencySlider)).call(this, props));
  }

  /**
   * Sets the transparency to the provided layer.
   *
   * @param {Number} transparency The transparency to set, provide a value
   *                              between 0 (fully visible) and 100 (fully
   *                              transparent).
   */


  /**
   * The properties.
   * @type {Object}
   */


  _createClass(LayerTransparencySlider, [{
    key: 'setLayerTransparency',
    value: function setLayerTransparency(transparency) {
      var opacity = 1 - transparency / 100;
      // Round the opacity to two digits.
      opacity = Math.round(opacity * 100) / 100;
      this.props.layer.setOpacity(opacity);
    }

    /**
     * Returns the transparency from the provided layer.
     *
     * @return {Number} The transparency of the layer.
     */

  }, {
    key: 'getLayerTransparency',
    value: function getLayerTransparency() {
      // 1 = fully opaque/visible.
      var opacity = this.props.layer.getOpacity();
      var transparency = (1 - opacity) * 100;
      // Remove any digits.
      transparency = Math.round(transparency);
      return transparency;
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          layer = _props.layer,
          passThroughProps = _objectWithoutProperties(_props, ['layer']);

      return _react2.default.createElement(_slider2.default, _extends({
        tipFormatter: function tipFormatter(value) {
          return value + '%';
        },
        defaultValue: this.getLayerTransparency(),
        onChange: function onChange(value) {
          _this2.setLayerTransparency(value);
        }
      }, passThroughProps));
    }
  }]);

  return LayerTransparencySlider;
}(_react2.default.Component);

LayerTransparencySlider.propTypes = {
  /**
   * The layer to handle.
   * @type {ol.layer.Base}
   */
  layer: _propTypes2.default.instanceOf(_base2.default).isRequired
};
exports.default = LayerTransparencySlider;
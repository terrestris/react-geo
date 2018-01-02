'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slider = require('antd/lib/slider');

var _slider2 = _interopRequireDefault(_slider);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('antd/lib/slider/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Customized slider that uses ISO 8601 time strings as input.
 *
 * @class The TimeSlider
 * @extends React.Component
 */
var TimeSlider = function (_React$Component) {
  _inherits(TimeSlider, _React$Component);

  /**
   * The constructor.
   *
   * @constructs TimeSlider
   * @param {Object} props The properties.
   */
  function TimeSlider(props) {
    _classCallCheck(this, TimeSlider);

    var _this = _possibleConstructorReturn(this, (TimeSlider.__proto__ || Object.getPrototypeOf(TimeSlider)).call(this, props));

    _this.convertTimestamps = function () {
      return {
        min: (0, _moment2.default)(_this.props.min).unix(),
        max: (0, _moment2.default)(_this.props.max).unix(),
        defaultValue: _this.convert(_this.props.defaultValue)
      };
    };

    _this.convert = function (val) {
      if (val === undefined) {
        return val;
      }
      return (0, _lodash.isArray)(val) ? val.map(function (iso) {
        return (0, _moment2.default)(iso).unix();
      }) : (0, _moment2.default)(val).unix();
    };

    _this.formatTimestamp = function (unix) {
      return (0, _moment2.default)(unix * 1000).format('DD.MM. HH:mm');
    };

    _this.valueUpdated = function (value) {
      _this.props.onChange((0, _lodash.isArray)(value) ? [(0, _moment2.default)(value[0] * 1000).toISOString(), (0, _moment2.default)(value[1] * 1000).toISOString()] : (0, _moment2.default)(value * 1000).toISOString());
    };

    _this.state = _this.convertTimestamps();
    return _this;
  }

  /**
   * Converts the various input strings to unix timestamps.
   * @return {Object} the converted values
   */


  /**
   * Convert a value to unix timestamps.
   * @param  {Array | String} val the input value(s)
   * @return {Array | Number}     the converted value(s)
   */


  /**
   * Formats a timestamp for user display.
   * @param  {Number} unix unix timestamps
   * @return {String}      the formatted timestamps
   */


  /**
   * Called when the value(s) are changed. Converts the value(s) back to ISO
   * timestrings.
   * @param  {Array | Number} value the new value
   */


  _createClass(TimeSlider, [{
    key: 'render',


    /**
     * The render function.
     */
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_slider2.default, {
          className: this.props.className,
          defaultValue: this.props.defaultValue,
          range: this.props.useRange,
          min: (0, _moment2.default)(this.props.min).unix(),
          max: (0, _moment2.default)(this.props.max).unix(),
          tipFormatter: this.formatTimestamp,
          onChange: this.valueUpdated,
          value: this.convert(this.props.value)
        })
      );
    }
  }]);

  return TimeSlider;
}(_react2.default.Component);

TimeSlider.propTypes = {
  /**
   * A class name string to use on surrounding div.
   * @type {String}
   */
  className: _propTypes2.default.string,

  /**
   * Whether to allow range selection.
   * @type {Boolean}
   */
  useRange: _propTypes2.default.bool,

  /**
   * The default value(s).
   * @type {any}
   */
  defaultValue: _propTypes2.default.any,

  /**
   * The minimum value.
   * @type {String}
   */
  min: _propTypes2.default.string,

  /**
   * The maximum value.
   * @type {String}
   */
  max: _propTypes2.default.string,

  /**
   * Called when the value changes.
   * @type {Function}
   */
  onChange: _propTypes2.default.func,

  /**
   * The current value(s).
   * @type {any}
   */
  value: _propTypes2.default.any
};
TimeSlider.defaultProps = {
  useRange: false,
  defaultValue: (0, _moment2.default)().toISOString(),
  min: (0, _moment2.default)().subtract(1, 'hour').toISOString(),
  max: (0, _moment2.default)().toISOString(),
  onChange: function onChange() {
    return undefined;
  },
  value: (0, _moment2.default)().toISOString() };
exports.default = TimeSlider;
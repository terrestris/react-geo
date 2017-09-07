'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _css = require('antd/lib/tooltip/style/css');

var _tooltip = require('antd/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _css2 = require('antd/lib/button/style/css');

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactFa = require('react-fa');

var _Logger = require('../../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

require('./SimpleButton.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The SimpleButton.
 *
 * @class The SimpleButton
 * @extends React.Component
 */
var SimpleButton = function (_React$Component) {
  _inherits(SimpleButton, _React$Component);

  /**
   * Create the SimpleButton.
   *
   * @constructs SimpleButton
   */


  /**
   * The properties.
   * @type {Object}
   */
  function SimpleButton(props) {
    _classCallCheck(this, SimpleButton);

    var _this = _possibleConstructorReturn(this, (SimpleButton.__proto__ || Object.getPrototypeOf(SimpleButton)).call(this, props));

    _this.onClick = function () {
      if (_this.props.onClick) {
        _this.props.onClick();
      } else {
        _Logger2.default.debug('No onClick method given. Please provide it as ' + 'prop to this instance.');
      }
    };

    return _this;
  }

  /**
   * Handles the given click callback.
   */


  /**
   * The default properties.
   * @type {Object}
   */


  _createClass(SimpleButton, [{
    key: 'render',


    /**
     * The render function.
     */
    value: function render() {
      var _props = this.props,
          tooltip = _props.tooltip,
          tooltipPlacement = _props.tooltipPlacement,
          icon = _props.icon,
          fontIcon = _props.fontIcon,
          antBtnProps = _objectWithoutProperties(_props, ['tooltip', 'tooltipPlacement', 'icon', 'fontIcon']);

      return _react2.default.createElement(
        _tooltip2.default,
        {
          title: tooltip,
          placement: tooltipPlacement
        },
        _react2.default.createElement(
          _button2.default,
          _extends({
            className: 'btn-simple',
            onClick: this.onClick
          }, antBtnProps),
          _react2.default.createElement(_reactFa.Icon, {
            name: icon,
            className: fontIcon
          })
        )
      );
    }
  }]);

  return SimpleButton;
}(_react2.default.Component);

SimpleButton.propTypes = {
  icon: _propTypes2.default.string,
  fontIcon: _propTypes2.default.string,
  shape: _propTypes2.default.string,
  size: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  onClick: _propTypes2.default.func,
  tooltip: _propTypes2.default.string,
  tooltipPlacement: _propTypes2.default.string
};
SimpleButton.defaultProps = {
  type: 'primary',
  icon: '',
  shape: 'circle',
  size: 'default',
  disabled: false };
exports.default = SimpleButton;
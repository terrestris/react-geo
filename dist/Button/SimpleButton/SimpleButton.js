'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _style3 = require('antd/lib/tooltip/style');

var _tooltip = require('antd/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _style4 = require('antd/lib/button/style');

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

    _this.className = 'react-geo-simplebutton';

    _this.onClick = _this.onClick.bind(_this);
    return _this;
  }

  /**
   * Handles the given click callback.
   */


  /**
   * The default properties.
   * @type {Object}
   */


  /**
   * The className added to this component.
   * @type {String}
   * @private
   */


  _createClass(SimpleButton, [{
    key: 'onClick',
    value: function onClick() {
      if (this.props.onClick) {
        this.props.onClick();
      } else {
        _Logger2.default.debug('No onClick method given. Please provide it as ' + 'prop to this instance.');
      }
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          icon = _props.icon,
          fontIcon = _props.fontIcon,
          onClick = _props.onClick,
          tooltip = _props.tooltip,
          tooltipPlacement = _props.tooltipPlacement,
          antBtnProps = _objectWithoutProperties(_props, ['className', 'icon', 'fontIcon', 'onClick', 'tooltip', 'tooltipPlacement']);

      var finalClassName = className ? className + ' ' + this.className : this.className;

      return _react2.default.createElement(
        _tooltip2.default,
        {
          title: tooltip,
          placement: tooltipPlacement
        },
        _react2.default.createElement(
          _button2.default,
          _extends({
            className: finalClassName,
            onClick: this.onClick
          }, antBtnProps),
          _react2.default.createElement(_reactFa.Icon, {
            name: icon,
            className: fontIcon,
            style: {
              display: icon || fontIcon ? 'inherit' : 'none'
            }
          }),
          antBtnProps.children
        )
      );
    }
  }]);

  return SimpleButton;
}(_react2.default.Component);

SimpleButton.propTypes = {
  /**
   * The className which should be added.
   * @type {String}
   */
  className: _propTypes2.default.string,
  icon: _propTypes2.default.string,
  fontIcon: _propTypes2.default.string,
  onClick: _propTypes2.default.func,
  tooltip: _propTypes2.default.string,
  tooltipPlacement: _propTypes2.default.string
};
SimpleButton.defaultProps = {
  type: 'primary',
  icon: '' };
exports.default = SimpleButton;
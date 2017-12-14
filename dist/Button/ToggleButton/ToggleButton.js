'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tooltip = require('antd/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('antd/lib/tooltip/style');

require('antd/lib/button/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactFa = require('react-fa');

var _lodash = require('lodash');

require('./ToggleButton.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The ToggleButton.
 *
 * @class The ToggleButton
 * @extends React.Component
 */
var ToggleButton = function (_React$Component) {
  _inherits(ToggleButton, _React$Component);

  /**
   * Create the ToggleButton.
   *
   * @constructs ToggleButton
   */


  /**
   * The default properties.
   * @type {Object}
   */


  /**
   * The class to apply for a toggled/pressed button.
   * @type {String}
   */
  function ToggleButton(props) {
    _classCallCheck(this, ToggleButton);

    // Instantiate the state.
    var _this = _possibleConstructorReturn(this, (ToggleButton.__proto__ || Object.getPrototypeOf(ToggleButton)).call(this, props));

    _this.className = 'react-geo-togglebutton';
    _this.pressedClass = 'btn-pressed';
    _this.state = {
      pressed: props.pressed
    };

    if (props.pressed) {
      _this.props.onToggle(_this.state.pressed);
    }

    _this.onClick = _this.onClick.bind(_this);
    return _this;
  }

  /**
   * Called if this component receives properties.
   *
   * @param {Object} nextProps The received properties.
   */


  /**
   * The context types.
   * @type {Object}
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


  _createClass(ToggleButton, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (this.props.pressed != nextProps.pressed) {
        this.setState({
          pressed: nextProps.pressed
        }, function () {
          _this2.props.onToggle(_this2.state.pressed);
        });
      }
    }

    /**
     * Called on click
     *
     * @param {ClickEvent} evt the clickeEvent
     */

  }, {
    key: 'onClick',
    value: function onClick(evt) {
      if (this.context.toggleGroup && (0, _lodash.isFunction)(this.context.toggleGroup.onChange)) {
        this.context.toggleGroup.onChange(this.props);
      } else if (this.props.onToggle) {
        this.props.onToggle(!this.state.pressed, evt);
      }

      this.setState({
        pressed: !this.state.pressed
      });
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          name = _props.name,
          icon = _props.icon,
          pressedIcon = _props.pressedIcon,
          fontIcon = _props.fontIcon,
          pressed = _props.pressed,
          onToggle = _props.onToggle,
          tooltip = _props.tooltip,
          tooltipPlacement = _props.tooltipPlacement,
          antBtnProps = _objectWithoutProperties(_props, ['className', 'name', 'icon', 'pressedIcon', 'fontIcon', 'pressed', 'onToggle', 'tooltip', 'tooltipPlacement']);

      var finalClassName = className ? className + ' ' + this.className : this.className;

      var iconName = icon;
      var pressedClass = '';

      if (this.state.pressed) {
        iconName = pressedIcon || icon;
        pressedClass = ' ' + this.pressedClass + ' ';
      }

      return _react2.default.createElement(
        _tooltip2.default,
        {
          title: tooltip,
          placement: tooltipPlacement
        },
        _react2.default.createElement(
          _button2.default,
          _extends({
            className: '' + finalClassName + pressedClass,
            onClick: this.onClick
          }, antBtnProps),
          _react2.default.createElement(_reactFa.Icon, {
            name: iconName,
            className: fontIcon
          }),
          antBtnProps.children
        )
      );
    }
  }]);

  return ToggleButton;
}(_react2.default.Component);

ToggleButton.propTypes = {
  name: _propTypes2.default.string,
  icon: _propTypes2.default.string,
  pressedIcon: _propTypes2.default.string,
  fontIcon: _propTypes2.default.string,
  pressed: _propTypes2.default.bool,
  onToggle: _propTypes2.default.func.isRequired,
  tooltip: _propTypes2.default.string,
  tooltipPlacement: _propTypes2.default.string,
  className: _propTypes2.default.string
};
ToggleButton.defaultProps = {
  type: 'primary',
  icon: '',
  pressed: false };
ToggleButton.contextTypes = {
  toggleGroup: _propTypes2.default.object
};
exports.default = ToggleButton;
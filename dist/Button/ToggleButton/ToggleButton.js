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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactFa = require('react-fa');

var _lodash = require('lodash');

var _Logger = require('../../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

require('./ToggleButton.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    var _this = _possibleConstructorReturn(this, (ToggleButton.__proto__ || Object.getPrototypeOf(ToggleButton)).call(this, props));

    _this.className = 'react-geo-togglebutton';
    _this.pressedClass = 'btn-pressed';

    _this.onClick = function () {
      if (_this.context.toggleGroup && (0, _lodash.isFunction)(_this.context.toggleGroup.onChange)) {
        _this.context.toggleGroup.onChange(_this.props);
      } else if (_this.props.onToggle) {
        _this.props.onToggle(!_this.state.pressed);
      }

      _this.setState({
        pressed: !_this.state.pressed
      });
    };

    if (!props.onToggle) {
      _Logger2.default.debug('No onToggle method given. Please provide it as ' + 'prop to this instance.');
    }

    // Instantiate the state.
    _this.state = {
      pressed: props.pressed
    };
    return _this;
  }

  // TODO I think we should not call the onToggle Handler here. This needs to be
  // refactored.
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

      if (nextProps.onToggle || this.state.onToggle) {
        if (this.props.pressed != nextProps.pressed) {
          this.setState({
            pressed: nextProps.pressed
          }, function () {
            _this2.props.onToggle(_this2.state.pressed);
          });
        }
      } else {
        _Logger2.default.debug('No onToggle method given. Please provide it as ' + 'prop to this instance.');
      }
    }

    /**
     * Called on click
     */

  }, {
    key: 'render',


    /**
     * The render function.
     */
    value: function render() {
      var iconName = this.state.pressed ? this.props.pressedIcon || this.props.icon : this.props.icon;
      var className = this.props.className ? this.props.className + ' ' + this.className : this.className;
      var pressedClass = this.state.pressed ? ' ' + this.pressedClass : '';

      return _react2.default.createElement(
        _tooltip2.default,
        {
          title: this.props.tooltip,
          placement: this.props.tooltipPlacement
        },
        _react2.default.createElement(
          _button2.default,
          {
            type: this.props.type,
            shape: this.props.shape,
            size: this.props.size,
            disabled: this.props.disabled,
            onClick: this.onClick,
            className: '' + className + pressedClass
          },
          _react2.default.createElement(_reactFa.Icon, {
            name: iconName,
            className: this.props.fontIcon
          })
        )
      );
    }
  }]);

  return ToggleButton;
}(_react2.default.Component);

ToggleButton.propTypes = {
  name: _propTypes2.default.string,
  type: _propTypes2.default.string,
  icon: _propTypes2.default.string,
  pressedIcon: _propTypes2.default.string,
  fontIcon: _propTypes2.default.string,
  shape: _propTypes2.default.string,
  size: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  pressed: _propTypes2.default.bool,
  onToggle: _propTypes2.default.func,
  tooltip: _propTypes2.default.string,
  tooltipPlacement: _propTypes2.default.string,
  className: _propTypes2.default.string
};
ToggleButton.defaultProps = {
  type: 'primary',
  icon: '',
  shape: 'circle',
  size: 'default',
  disabled: false,
  pressed: false };
ToggleButton.contextTypes = {
  toggleGroup: _propTypes2.default.object
};
exports.default = ToggleButton;
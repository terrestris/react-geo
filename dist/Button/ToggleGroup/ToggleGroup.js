'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

require('./ToggleGroup.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A group for toggle components (e.g. buttons)
 *
 * @class The ToggleGroup
 * @extends React.Component
 */
var ToggleGroup = function (_React$Component) {
  _inherits(ToggleGroup, _React$Component);

  /**
   * The constructor.
   *
   * @param {Object} props The properties.
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
  function ToggleGroup(props) {
    _classCallCheck(this, ToggleGroup);

    /**
     * The initial state.
     * @type {Object}
     */
    var _this = _possibleConstructorReturn(this, (ToggleGroup.__proto__ || Object.getPrototypeOf(ToggleGroup)).call(this, props));

    _this.className = 'react-geo-togglegroup';

    _this.onChange = function (childProps) {

      if ((0, _lodash.isFunction)(_this.props.onChange)) {
        _this.props.onChange(childProps);
      }

      // Allow deselect.
      if (_this.props.allowDeselect && childProps.name === _this.state.selectedName) {
        _this.setState({ selectedName: null });
      } else {
        _this.setState({ selectedName: childProps.name });
      }
    };

    _this.state = {
      selectedName: props.selectedName
    };
    return _this;
  }

  /**
   * Returns the context for the children.
   *
   * @return {Object} The child context.
   */


  /**
   * The child context types.
   * @type {Object}
   */


  /**
   * The properties.
   * @type {Object}
   */


  _createClass(ToggleGroup, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        toggleGroup: {
          name: this.props.name,
          selectedName: this.props.selectedName,
          onChange: this.onChange
        }
      };
    }

    /**
     * The onChange handler.
     *
     * @param {Object} childProps The properties if the children.
     */

  }, {
    key: 'render',


    /**
     * The render function.
     */
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          orientation = _props.orientation,
          children = _props.children;

      var className = this.props.className ? this.props.className + ' ' + this.className : this.className;
      var orientationClass = orientation === 'vertical' ? 'vertical-toggle-group' : 'horizontal-toggle-group';

      var childrenWithProps = _react2.default.Children.map(children, function (child) {
        return _react2.default.cloneElement(child, {
          pressed: _this2.state.selectedName === child.props.name
        });
      });

      return _react2.default.createElement(
        'div',
        {
          className: className + ' ' + orientationClass
        },
        childrenWithProps
      );
    }
  }]);

  return ToggleGroup;
}(_react2.default.Component);

ToggleGroup.propTypes = {
  /**
   * The className which should be added.
   * @type {String}
   */
  className: _propTypes2.default.string,

  /**
   * The name of this group.
   * @type {String}
   */
  name: _propTypes2.default.string,

  /**
   * The orientation of the children. Either `vertical` (default)
   * or `horizontal`.
   * @type {String}
   */
  orientation: _propTypes2.default.string,

  /**
   * Whether it's allowed to deselect a children or not.
   * @type {Boolean}
   */
  allowDeselect: _propTypes2.default.bool,

  /**
   * The value fo the `name` attribute of the children to select/press
   * initially.
   * @type {String}
   */
  selectedName: _propTypes2.default.string,

  /**
   * Callback function for onChange.
   * @type {Function}
   */
  onChange: _propTypes2.default.func,

  /**
   * The children of this group. Typically a set of `ToggleButton`s.
   * @type {Object}
   */
  children: _propTypes2.default.node };
ToggleGroup.defaultProps = {
  orientation: 'vertical',
  allowDeselect: true };
ToggleGroup.childContextTypes = {
  toggleGroup: _propTypes2.default.object };
exports.default = ToggleGroup;
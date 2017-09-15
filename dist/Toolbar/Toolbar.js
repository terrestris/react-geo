'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./Toolbar.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A base class representating a toolbar having n children
 * The child components of this toolbar can be aligned in vertical and
 * horizontal (default) way
 *
 * @class The Toolbar
 * @extends React.Component
 */
var Toolbar = function (_React$Component) {
  _inherits(Toolbar, _React$Component);

  function Toolbar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Toolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call.apply(_ref, [this].concat(args))), _this), _this.className = 'react-geo-toolbar', _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */


  /**
   * The properties.
   * @type {Object}
   */


  /**
   * The default properties.
   * @type {Object}
   */


  _createClass(Toolbar, [{
    key: 'render',


    /**
     * The render function
     */
    value: function render() {
      var _props = this.props,
          style = _props.style,
          className = _props.className;


      var finalClassName = className ? className + ' ' + this.className : this.className;

      return _react2.default.createElement(
        'div',
        { className: finalClassName + ' ' + this.props.alignment + '-toolbar', style: style },
        this.props.children
      );
    }
  }]);

  return Toolbar;
}(_react2.default.Component);

Toolbar.propTypes = {

  /**
   * The className which should be added.
   * @type {String}
   */
  className: _propTypes2.default.string,

  /**
   * The children.
   * @type {Array}
   */
  children: _propTypes2.default.node,

  /**
   * The alignment of the sub components.
   * @type {String}
   */
  alignment: _propTypes2.default.oneOf(['horizontal', 'vertical']),

  /**
   * An object containing style informations. Applied to Toolbar.
   * @type {Boolean}
   */
  style: _propTypes2.default.object };
Toolbar.defaultProps = {
  children: [],
  alignment: 'horizontal' };
exports.default = Toolbar;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./FloatingMapLogo.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representating a floating map logo
 *
 * @class The FloatingMapLogo
 * @extends React.Component
 */
var FloatingMapLogo = function (_React$Component) {
  _inherits(FloatingMapLogo, _React$Component);

  function FloatingMapLogo() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FloatingMapLogo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FloatingMapLogo.__proto__ || Object.getPrototypeOf(FloatingMapLogo)).call.apply(_ref, [this].concat(args))), _this), _this.className = 'react-geo-floatingmaplogo', _temp), _possibleConstructorReturn(_this, _ret);
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


  _createClass(FloatingMapLogo, [{
    key: 'render',


    /**
     * The render function.
     */
    value: function render() {
      var _props = this.props,
          imageSrc = _props.imageSrc,
          imageHeight = _props.imageHeight,
          absolutelyPostioned = _props.absolutelyPostioned,
          className = _props.className,
          style = _props.style;


      var finalClassName = className ? className + ' ' + this.className : this.className;

      if (absolutelyPostioned) {
        Object.assign(style, { 'position': 'absolute' });
      }

      return _react2.default.createElement('img', {
        className: finalClassName,
        src: imageSrc,
        height: imageHeight,
        style: style
      });
    }
  }]);

  return FloatingMapLogo;
}(_react2.default.Component);

FloatingMapLogo.propTypes = {
  /**
   * The className which should be added.
   * @type {String}
   */
  className: _propTypes2.default.string,

  /**
   * The imageSrc (required property).
   * @type {String}
   */
  imageSrc: _propTypes2.default.string.isRequired,

  /**
   * The image height
   * @type {String}
   */
  imageHeight: _propTypes2.default.string,

  /**
   * Whether the map-logo is absolutely postioned or not
   * @type {boolean}
   */
  absolutelyPostioned: _propTypes2.default.bool,

  /**
   * The style object
   * @type {Object}
   */
  style: _propTypes2.default.object };
FloatingMapLogo.defaultProps = {
  imageSrc: 'logo.png',
  absolutelyPostioned: false };
exports.default = FloatingMapLogo;
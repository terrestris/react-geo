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
    _classCallCheck(this, FloatingMapLogo);

    return _possibleConstructorReturn(this, (FloatingMapLogo.__proto__ || Object.getPrototypeOf(FloatingMapLogo)).apply(this, arguments));
  }

  _createClass(FloatingMapLogo, [{
    key: 'render',


    /**
     * The render function.
     */


    /**
     * The properties.
     * @type {Object}
     */
    value: function render() {
      var _props = this.props,
          imageSrc = _props.imageSrc,
          imageHeight = _props.imageHeight,
          absolutelyPostioned = _props.absolutelyPostioned,
          style = _props.style;


      if (absolutelyPostioned) {
        Object.assign(style, { 'position': 'absolute' });
      }

      return _react2.default.createElement('img', {
        className: 'map-logo',
        src: imageSrc,
        height: imageHeight,
        style: style
      });
    }

    /**
     * The default properties.
     * @type {Object}
     */

  }]);

  return FloatingMapLogo;
}(_react2.default.Component);

FloatingMapLogo.propTypes = {
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
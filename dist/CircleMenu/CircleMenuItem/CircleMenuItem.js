'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CircleMenuItem = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./CircleMenuItem.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The CircleMenuItem.
 *
 * @class CircleMenuItem
 * @extends React.Component
 */
var CircleMenuItem = exports.CircleMenuItem = function (_React$Component) {
  _inherits(CircleMenuItem, _React$Component);

  function CircleMenuItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CircleMenuItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CircleMenuItem.__proto__ || Object.getPrototypeOf(CircleMenuItem)).call.apply(_ref, [this].concat(args))), _this), _this.className = 'react-geo-circlemenuitem', _this._ref = null, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */


  /**
   * Internal reference used to apply the transformation right on the div.
   * @private
   */


  _createClass(CircleMenuItem, [{
    key: 'componentDidMount',


    /**
     * A react lifecycle method called when the component did mount.
     * It calls the applyTransformation method right after updating.
     */
    value: function componentDidMount() {
      setTimeout(this.applyTransformation.bind(this), 1);
    }

    /**
     * A react lifecycle method called when the component did update.
     * It calls the applyTransformation method right after updating.
     */

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      setTimeout(this.applyTransformation.bind(this), 1);
    }

    /**
     * Applies the transformation to the component.
     */

  }, {
    key: 'applyTransformation',
    value: function applyTransformation() {
      var _props = this.props,
          rotationAngle = _props.rotationAngle,
          radius = _props.radius;

      this._ref.style.transform = 'rotate(' + rotationAngle + 'deg) translate(' + radius + 'px) rotate(-' + rotationAngle + 'deg)';
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          rotationAngle = _props2.rotationAngle,
          radius = _props2.radius,
          animationDuration = _props2.animationDuration,
          className = _props2.className,
          passThroughProps = _objectWithoutProperties(_props2, ['rotationAngle', 'radius', 'animationDuration', 'className']);

      var finalClassName = className ? className + ' ' + this.className : this.className;

      return _react2.default.createElement(
        'div',
        _extends({
          className: finalClassName,
          ref: function ref(i) {
            return _this2._ref = i;
          },
          style: {
            display: 'block',
            top: '50%',
            left: '50%',
            margin: '-1.3em',
            position: 'absolute',
            transform: 'rotate(0deg) translate(0px) rotate(0deg)',
            transition: 'transform ' + animationDuration + 'ms'
          }
        }, passThroughProps),
        this.props.children
      );
    }
  }]);

  return CircleMenuItem;
}(_react2.default.Component);

CircleMenuItem.propTypes = {
  className: _propTypes2.default.string,
  /**
   * The duration of the animation in milliseconds. Pass 0 to avoid animation.
   * Default is 300.
   *
   * @type {Number}
   */
  animationDuration: _propTypes2.default.number,
  /**
   * The radius of the CircleMenu in pixels.
   *
   * @type {Number}
   */
  radius: _propTypes2.default.number.isRequired,
  /**
   * The children of the CircleMenuItem. Should be just one Node.
   *
   * @type {Node}
   */
  children: _propTypes2.default.node,
  /**
   * The rotation Angle in degree.
   *
   * @type {Number}
   */
  rotationAngle: _propTypes2.default.number.isRequired
};
CircleMenuItem.defaultProps = {
  animationDuration: 300
};
exports.default = CircleMenuItem;
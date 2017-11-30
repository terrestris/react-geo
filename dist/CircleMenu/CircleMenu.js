'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CircleMenu = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _CircleMenuItem = require('./CircleMenuItem/CircleMenuItem.js');

var _CircleMenuItem2 = _interopRequireDefault(_CircleMenuItem);

require('./CircleMenu.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The CircleMenu.
 *
 * @class CircleMenu
 * @extends React.Component
 */
var CircleMenu = exports.CircleMenu = function (_React$Component) {
  _inherits(CircleMenu, _React$Component);

  function CircleMenu() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CircleMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CircleMenu.__proto__ || Object.getPrototypeOf(CircleMenu)).call.apply(_ref, [this].concat(args))), _this), _this.className = 'react-geo-circlemenu', _this._ref = null, _temp), _possibleConstructorReturn(_this, _ret);
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


  _createClass(CircleMenu, [{
    key: 'componentDidMount',


    /**
     * A react lifecycle method called when the component did mount.
     * It calls the applyTransformation method right after mounting.
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
      if (this._ref) {
        this._ref.style.width = this.props.diameter + 'px';
        this._ref.style.height = this.props.diameter + 'px';
        this._ref.style.opacity = 1;
      }
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          animationDuration = _props.animationDuration,
          className = _props.className,
          diameter = _props.diameter,
          children = _props.children,
          position = _props.position,
          segmentAngles = _props.segmentAngles,
          style = _props.style,
          passThroughProps = _objectWithoutProperties(_props, ['animationDuration', 'className', 'diameter', 'children', 'position', 'segmentAngles', 'style']);

      var finalClassName = className ? className + ' ' + this.className : this.className;

      return _react2.default.createElement(
        'div',
        _extends({
          ref: function ref(i) {
            return _this2._ref = i;
          },
          className: finalClassName,
          style: _extends({
            transition: 'all ' + animationDuration + 'ms',
            left: position[0] - diameter / 2,
            top: position[1] - diameter / 2
          }, style)
        }, passThroughProps),
        children.map(function (child, idx, children) {
          var start = segmentAngles[0];
          var end = segmentAngles[1];
          var range = end - start;
          var amount = range > 270 ? children.length : children.length - 1;
          var rotationAngle = start + range / amount * idx;
          return _react2.default.createElement(
            _CircleMenuItem2.default,
            {
              radius: diameter / 2,
              rotationAngle: rotationAngle,
              idx: idx,
              animationDuration: _this2.props.animationDuration,
              key: idx
            },
            child
          );
        })
      );
    }
  }]);

  return CircleMenu;
}(_react2.default.Component);

CircleMenu.propTypes = {
  className: _propTypes2.default.string,
  style: _propTypes2.default.object,
  /**
   * The duration of the animation in milliseconds. Pass 0 to avoid animation.
   * Default is 300.
   *
   * @type {Number}
   */
  animationDuration: _propTypes2.default.number,
  /**
   * The diameter of the CircleMenu in pixels. Default is 100.
   *
   * @type {Number}
   */
  diameter: _propTypes2.default.number,
  /**
   * The children of the CircleMenu. Most common are buttons.
   *
   * @type {Node}
   */
  children: _propTypes2.default.node.isRequired,
  /**
   * An array containing the x and y coordinates of the CircleMenus Center.
   * @type {Number[]}
   */
  position: _propTypes2.default.arrayOf(_propTypes2.default.number).isRequired,
  /**
   * Optional Segement of angles where to show the children. Default is [0, 360].
   */
  segmentAngles: _propTypes2.default.arrayOf(_propTypes2.default.number)
};
CircleMenu.defaultProps = {
  animationDuration: 300,
  diameter: 100,
  segmentAngles: [0, 360]
};
exports.default = CircleMenu;
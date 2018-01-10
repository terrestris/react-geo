'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.mappify = mappify;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _map = require('ol/map');

var _map2 = _interopRequireDefault(_map);

var _Logger = require('../../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The HOC factory function.
 *
 * Wrapped components will receive the map from the context as a prop.
 *
 * @param {Component} WrappedComponent The component to wrap and enhance.
 * @return {Component} The wrapped component.
 */
function mappify(WrappedComponent) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$withRef = _ref.withRef,
      withRef = _ref$withRef === undefined ? false : _ref$withRef;

  /**
   * The wrapper class for the given component.
   *
   * @class The MappifiedComponent
   * @extends React.Component
   */
  var MappifiedComponent = function (_React$Component) {
    _inherits(MappifiedComponent, _React$Component);

    /**
     * Create the MappifiedComponent.
     *
     * @constructs MappifiedComponent
     */
    function MappifiedComponent(props) {
      _classCallCheck(this, MappifiedComponent);

      /**
       * The wrapped instance.
       * @type {Element}
       */
      var _this = _possibleConstructorReturn(this, (MappifiedComponent.__proto__ || Object.getPrototypeOf(MappifiedComponent)).call(this, props));

      _this.getWrappedInstance = function () {
        if (withRef) {
          return _this.wrappedInstance;
        } else {
          _Logger2.default.warn('No wrapped instance referenced, please call the ' + 'mappify with option withRef = true.');
        }
      };

      _this.setWrappedInstance = function (instance) {
        if (withRef) {
          _this.wrappedInstance = instance;
        }
      };

      _this.wrappedInstance = null;
      return _this;
    }

    /**
     * Returns the wrapped instance. Only applicable if withRef is set to true.
     *
     * @return {Element} The wrapped instance.
     */


    /**
     * The context types.
     * @type {Object}
     */


    /**
     * Sets the wrapped instance.
     *
     * @param {Element} instance The instance to set.
     */


    _createClass(MappifiedComponent, [{
      key: 'render',


      /**
       * The render function.
       */
      value: function render() {
        var map = this.context.map;


        if (!map) {
          _Logger2.default.warn('You trying to mappify a component without any map in the ' + 'context. Did you implement the MapProvider?');
        }

        return _react2.default.createElement(WrappedComponent, _extends({
          ref: this.setWrappedInstance,
          map: map
        }, this.props));
      }
    }]);

    return MappifiedComponent;
  }(_react2.default.Component);

  MappifiedComponent.contextTypes = {
    map: _propTypes2.default.instanceOf(_map2.default).isRequired };


  return MappifiedComponent;
}
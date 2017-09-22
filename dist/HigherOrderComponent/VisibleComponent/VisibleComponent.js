'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.isVisibleComponent = isVisibleComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Logger = require('../../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The HOC factory function.
 *
 * Wrapped components will be checked against the activeModules array of
 * the state: If the wrapped component (identified by it's name) is included
 * in the state, it will be rendered, if not, it wont.
 *
 * @param {Component} WrappedComponent The component to wrap and enhance.
 * @param {Object} options The options to apply.
 * @return {Component} The wrapped component.
 */
function isVisibleComponent(WrappedComponent) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$withRef = _ref.withRef,
      withRef = _ref$withRef === undefined ? false : _ref$withRef;

  /**
   * The wrapper class for the given component.
   *
   * @class The VisibleComponent
   * @extends React.Component
   */
  var VisibleComponent = function (_React$Component) {
    _inherits(VisibleComponent, _React$Component);

    /**
     * Create the VisibleComponent.
     *
     * @constructs VisibleComponent
     */
    function VisibleComponent(props) {
      _classCallCheck(this, VisibleComponent);

      /**
       * The wrapped instance.
       * @type {Element}
       */
      var _this = _possibleConstructorReturn(this, (VisibleComponent.__proto__ || Object.getPrototypeOf(VisibleComponent)).call(this, props));

      _this.getWrappedInstance = function () {
        if (withRef) {
          return _this.wrappedInstance;
        } else {
          _Logger2.default.debug('No wrapped instance referenced, please call the ' + 'isVisibleComponent with option withRef = true.');
        }
      };

      _this.setWrappedInstance = function (instance) {
        if (withRef) {
          _this.wrappedInstance = instance;
        }
      };

      _this.isVisibleComponent = function (componentName) {
        var activeModules = _this.props.activeModules || [];

        return activeModules.some(function (activeModule) {
          if (!activeModule.name) {
            return false;
          } else {
            return activeModule.name === componentName;
          }
        });
      };

      _this.wrappedInstance = null;
      return _this;
    }

    /**
     * Returns the wrapped instance. Only applicable if withRef is set to true.
     *
     * @return {Element} The wrappend instance.
     */


    /**
     * The props.
     * @type {Object}
     */


    /**
     * Sets the wrapped instance.
     *
     * @param {Element} instance The instance to set.
     */


    /**
     * Checks if the current component (identified by it's name) should be
     * visible or not.
     *
     * @param {String} componentName The name of the component.
     * @return {Boolean} Whether the component should be visible or not.
     */


    _createClass(VisibleComponent, [{
      key: 'render',


      /**
       * The render function.
       */
      value: function render() {
        // Filter out extra props that are specific to this HOC and shouldn't be
        // passed through.
        var _props = this.props,
            activeModules = _props.activeModules,
            passThroughProps = _objectWithoutProperties(_props, ['activeModules']);

        // Check if the current component should be visible or not.


        var isVisibleComponent = this.isVisibleComponent(passThroughProps.name);

        // Inject props into the wrapped component. These are usually state
        // values or instance methods.
        return isVisibleComponent ? _react2.default.createElement(WrappedComponent, _extends({
          ref: this.setWrappedInstance
        }, passThroughProps)) : null;
      }
    }]);

    return VisibleComponent;
  }(_react2.default.Component);

  VisibleComponent.propTypes = {
    activeModules: _propTypes2.default.arrayOf(_propTypes2.default.object) };


  return VisibleComponent;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapComponent = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _map = require('ol/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representating a map.
 *
 * @class The MapComponent.
 * @extends React.Component
 */
var MapComponent = exports.MapComponent = function (_React$Component) {
  _inherits(MapComponent, _React$Component);

  /**
   * Create a MapComponent.
   *
   * @constructs Map
   */


  /**
   * The properties.
   * @type {Object}
   */
  function MapComponent(props) {
    _classCallCheck(this, MapComponent);

    return _possibleConstructorReturn(this, (MapComponent.__proto__ || Object.getPrototypeOf(MapComponent)).call(this, props));
  }

  /**
   * The componentDidMount function
   *
   * @method componentDidMount
   */


  /**
   * The default properties.
   * @type {Object}
   */


  _createClass(MapComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.map.setTarget(this.props.mapDivId);
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var mapDiv = void 0;

      var _props = this.props,
          map = _props.map,
          mapDivId = _props.mapDivId,
          children = _props.children,
          passThroughProps = _objectWithoutProperties(_props, ['map', 'mapDivId', 'children']);

      if (map) {
        mapDiv = _react2.default.createElement(
          'div',
          _extends({
            className: 'map',
            id: mapDivId
          }, passThroughProps),
          children
        );
      }

      return mapDiv;
    }
  }]);

  return MapComponent;
}(_react2.default.Component);

MapComponent.propTypes = {
  children: _propTypes2.default.node,
  map: _propTypes2.default.instanceOf(_map2.default).isRequired,
  mapDivId: _propTypes2.default.string };
MapComponent.defaultProps = {
  mapDivId: 'map' };
exports.default = MapComponent;
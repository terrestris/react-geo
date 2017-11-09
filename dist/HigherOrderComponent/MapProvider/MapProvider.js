'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _map = require('ol/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The MapProvider.
 *
 * @type {Object}
 */
var MapProvider = function (_React$Component) {
  _inherits(MapProvider, _React$Component);

  /**
   * The constructor of the MapProvider sets the
   *
   * @constructs MapProvider
   * @param {Object} props The initial props.
   */


  /**
   * The properties.
   * @type {Object}
   */
  function MapProvider(props) {
    _classCallCheck(this, MapProvider);

    var _this = _possibleConstructorReturn(this, (MapProvider.__proto__ || Object.getPrototypeOf(MapProvider)).call(this, props));

    _this.state = {
      map: null,
      ready: false
    };

    if (props.map instanceof _map2.default) {
      _this.setState({
        map: props.map,
        ready: true
      });
    } else {
      props.map.then(function (map) {
        _this.setState({
          map: map,
          ready: true
        });
      });
    }
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


  _createClass(MapProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var map = this.state.map;


      return { map: map };
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      if (!this.state.ready) {
        return null;
      } else {
        return this.props.children;
      }
    }
  }]);

  return MapProvider;
}(_react2.default.Component);

MapProvider.propTypes = {
  /**
   * The children of the MapProvider.
   * @type {Object}
   */
  children: _propTypes2.default.node,

  /**
   * The map can be either an OlMap or a Promise that resolves with an OlMap
   * if your map is created asynchronously.
   *
   * @type {ol.Map|Promise}
   */
  map: _propTypes2.default.oneOfType([_propTypes2.default.instanceOf(_map2.default), _propTypes2.default.instanceOf(Promise)]).isRequired };
MapProvider.childContextTypes = {
  map: _propTypes2.default.instanceOf(_map2.default) };
exports.default = MapProvider;
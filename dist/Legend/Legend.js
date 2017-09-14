'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Legend = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Logger = require('../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _MapUtil = require('../Util/MapUtil');

var _MapUtil2 = _interopRequireDefault(_MapUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representing the Legend.
 *
 * @class Legend
 * @extends React.Component
 */
var Legend = exports.Legend = function (_React$Component) {
  _inherits(Legend, _React$Component);

  /**
   * Create the Legend.
   *
   * @constructs Legend
   */


  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  function Legend(props) {
    _classCallCheck(this, Legend);

    var _this = _possibleConstructorReturn(this, (Legend.__proto__ || Object.getPrototypeOf(Legend)).call(this, props));

    _this.className = 'react-geo-legend';


    _this.state = {
      legendUrl: null
    };
    return _this;
  }

  /**
   * Calls getLegendUrl.
   */


  /**
   * The properties.
   * @type {Object}
   */


  _createClass(Legend, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.getLegendUrl();
    }

    /**
     * Get the corresponding legendGraphic of a layer. If layer is configured with
     * "legendUrl" this will be used. Otherwise a getLegendGraphic requestString
     * will be created by the MapUtil.
     *
     */

  }, {
    key: 'getLegendUrl',
    value: function getLegendUrl() {
      var layer = this.props.layer;

      var legendUrl = void 0;
      if (layer.get('legendUrl')) {
        legendUrl = layer.get('legendUrl');
      } else {
        legendUrl = _MapUtil2.default.getLegendGraphicUrl(layer, this.props.extraParams);
      }
      this.setState({ legendUrl: legendUrl });
    }

    /**
     * onError handler for the rendered img.
     */

  }, {
    key: 'onError',
    value: function onError() {
      _Logger2.default.warn('Image error for legend of "' + this.props.layer.get('name') + '".');
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var layer = this.props.layer;

      var className = this.props.className ? this.props.className + ' ' + this.className : this.className;
      var alt = layer.get('name') ? layer.get('name') + ' legend' : 'layer legend';

      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement('img', {
          src: this.state.legendUrl,
          alt: alt,
          onError: this.onError.bind(this)
        })
      );
    }
  }]);

  return Legend;
}(_react2.default.Component);

Legend.propTypes = {
  /**
   * The className which should be added.
   * @type {String}
   */
  className: _propTypes2.default.string,

  /**
   * The layer you want to display the legend of.
   * @type {ol.layer.Layer}
   */
  layer: _propTypes2.default.object.isRequired,

  /**
   * An object containing additional request params like "{HEIGHT: 400}" will
   * be transformed to "&HEIGHT=400" an added to the GetLegendGraphic request.
   * @type {Object}
   */
  extraParams: _propTypes2.default.object };
exports.default = Legend;
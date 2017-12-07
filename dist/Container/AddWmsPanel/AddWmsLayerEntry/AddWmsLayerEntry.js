'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddWmsLayerEntry = undefined;

var _checkbox = require('antd/lib/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _tooltip = require('antd/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('antd/lib/checkbox/style');

require('antd/lib/tooltip/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _tile = require('ol/layer/tile');

var _tile2 = _interopRequireDefault(_tile);

var _reactFa = require('react-fa');

require('./AddWmsLayerEntry.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representating a layer parsed from capabilities document.
 * This componment is used in AddWmsPanel
 *
 * @class AddWmsLayerEntry
 * @extends React.Component
 */
var AddWmsLayerEntry = exports.AddWmsLayerEntry = function (_React$Component) {
  _inherits(AddWmsLayerEntry, _React$Component);

  /**
   * Create the AddWmsLayerEntry.
   *
   * @constructs AddWmsLayerEntry
   */
  function AddWmsLayerEntry(props) {
    _classCallCheck(this, AddWmsLayerEntry);

    var _this = _possibleConstructorReturn(this, (AddWmsLayerEntry.__proto__ || Object.getPrototypeOf(AddWmsLayerEntry)).call(this, props));

    _this.state = {
      copyright: props.wmsLayer.wmsAttribution,
      queryable: props.wmsLayer.queryable
    };
    return _this;
  }

  /**
   * The defaultProps.
   * @type {Object}
   */


  /**
   * The prop types.
   * @type {Object}
   */


  _createClass(AddWmsLayerEntry, [{
    key: 'render',


    /**
     * The render function
     */
    value: function render() {
      var _props = this.props,
          wmsLayer = _props.wmsLayer,
          layerQueryableText = _props.layerQueryableText;
      var _state = this.state,
          copyright = _state.copyright,
          queryable = _state.queryable;


      var title = wmsLayer.get('title');
      var abstract = wmsLayer.get('abstract');

      var abstractTextSpan = wmsLayer.Abstract ? _react2.default.createElement(
        'span',
        null,
        title + ' - ' + abstract + ':'
      ) : _react2.default.createElement(
        'span',
        null,
        '' + title
      );

      return _react2.default.createElement(
        _checkbox2.default,
        { value: title, className: 'add-wms-layer-checkbox-line' },
        _react2.default.createElement(
          'div',
          { className: 'add-wms-layer-entry' },
          abstractTextSpan,
          copyright ? _react2.default.createElement(_reactFa.Icon, { className: 'add-wms-add-info-icon', name: 'copyright' }) : null,
          queryable ? _react2.default.createElement(
            _tooltip2.default,
            { title: layerQueryableText },
            _react2.default.createElement(_reactFa.Icon, { className: 'add-wms-add-info-icon', name: 'info' })
          ) : null
        )
      );
    }
  }]);

  return AddWmsLayerEntry;
}(_react2.default.Component);

AddWmsLayerEntry.propTypes = {
  /**
   * Object containing layer information
   * @type {Object}
   */
  wmsLayer: _propTypes2.default.instanceOf(_tile2.default).isRequired,

  /**
   * Optional text to be shown in Tooltip for a layer that can be queried
   * @type {Object}
   */
  layerQueryableText: _propTypes2.default.string };
AddWmsLayerEntry.defaultProps = {
  layerQueryableText: 'Layer is queryable' };
exports.default = AddWmsLayerEntry;
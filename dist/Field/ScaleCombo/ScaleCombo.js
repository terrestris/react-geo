'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('antd/lib/select/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _Logger = require('../../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _MapUtil = require('../../Util/MapUtil/MapUtil');

var _MapUtil2 = _interopRequireDefault(_MapUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Option = _select2.default.Option;

/**
 * Class representating a scale combo to choose map scale via a dropdown menu.
 *
 * @class The ScaleCombo
 * @extends React.Component
 */
var ScaleCombo = function (_React$Component) {
  _inherits(ScaleCombo, _React$Component);

  /**
   * Create a map.
   * @constructs Map
   */
  function ScaleCombo(props) {
    _classCallCheck(this, ScaleCombo);

    /**
     * The default onZoomLevelSelect function sets the resolution of the passed
     * map according to the selected Scale.
     *
     * @param  {Number} selectedScale The selectedScale.
     */
    var _this = _possibleConstructorReturn(this, (ScaleCombo.__proto__ || Object.getPrototypeOf(ScaleCombo)).call(this, props));

    _this.className = 'react-geo-scalecombo';

    _this.zoomListener = function (evt) {
      var zoom = evt.target.getView().getZoom();
      var roundZoom = Math.round(zoom);
      if (!roundZoom) {
        roundZoom = 0;
      }
      _this.setState({
        zoomLevel: roundZoom
      });
    };

    _this.pushScale = function (resolution, mv) {
      var scale = _MapUtil2.default.getScaleForResolution(resolution, mv.getProjection().getUnits());
      var roundScale = _MapUtil2.default.roundScale(scale);
      if (_this.state.scales.includes(roundScale)) {
        return;
      }
      _this.state.scales.push(roundScale);
    };

    _this.getOptionsFromMap = function () {
      if (!(0, _lodash.isEmpty)(_this.state.scales)) {
        _Logger2.default.debug('Array with scales found. Returning');
        return;
      }
      if (!_this.props.map) {
        _Logger2.default.warn('Map component not found. Could not initialize options array.');
        return;
      }

      var map = _this.props.map;
      var mv = map.getView();
      // use existing resolutions array if exists
      var resolutions = mv.getResolutions();
      if ((0, _lodash.isEmpty)(resolutions)) {
        for (var currentZoomLevel = mv.getMaxZoom(); currentZoomLevel >= mv.getMinZoom(); currentZoomLevel--) {
          var resolution = mv.getResolutionForZoom(currentZoomLevel);
          _this.pushScale(resolution, mv);
        }
      } else {
        var reversedResolutions = (0, _lodash.reverse)((0, _lodash.clone)(resolutions));
        reversedResolutions.forEach(function (resolution) {
          _this.pushScale(resolution, mv);
        });
      }
    };

    _this.determineOptionKeyForZoomLevel = function (zoom) {
      if (!(0, _lodash.isInteger)(zoom) || _this.state.scales.length - 1 - zoom < 0) {
        return undefined;
      }
      return _this.state.scales[_this.state.scales.length - 1 - zoom];
    };

    var defaultOnZoomLevelSelect = function defaultOnZoomLevelSelect(selectedScale) {
      var mapView = _this.props.map.getView();
      var calculatedResolution = _MapUtil2.default.getResolutionForScale(selectedScale, mapView.getProjection().getUnits());
      mapView.setResolution(calculatedResolution);
    };

    _this.state = {
      zoomLevel: props.zoomLevel || _this.props.map.getView().getZoom(),
      onZoomLevelSelect: props.onZoomLevelSelect || defaultOnZoomLevelSelect,
      scales: props.scales
    };

    if (props.syncWithMap) {
      _this.props.map.on('moveend', _this.zoomListener);
    }
    return _this;
  }

  /**
   * Set the zoomLevel of the to the ScaleCombo.
   *
   * @param  {Object} evt The 'moveend' event
   * @private
   */


  /**
   * The default props
   */


  /**
   * The className added to this component.
   * @type {String}
   * @private
   */


  _createClass(ScaleCombo, [{
    key: 'componentWillReceiveProps',


    /**
     * Called on componentWillReceiveProps lifecycle event.
     *
     * @param {Object} newProps The new properties.
     */
    value: function componentWillReceiveProps(newProps) {
      if (!(0, _lodash.isEqual)(newProps.zoomLevel, this.props.zoomLevel)) {
        this.setState({
          zoomLevel: newProps.zoomLevel
        });
      }

      if (!newProps.syncWithMap !== this.props.syncWithMap) {
        if (newProps.syncWithMap) {
          this.props.map.on('moveend', this.zoomListener);
        } else {
          this.props.map.un('moveend', this.zoomListener);
        }
      }

      if ((0, _lodash.isFunction)(newProps.onZoomLevelSelect) && !(0, _lodash.isEqual)(newProps.onZoomLevelSelect, this.state.onZoomLevelSelect)) {
        this.setState({
          onZoomLevelSelect: newProps.onZoomLevelSelect
        });
      }
    }

    /**
     * @function pushScaleOption: Helper function to create a {@link Option} scale component
     * based on a resolution and the {@link Ol.View}
     *
     * @param {Number} resolution map cresolution to generate the option for
     * @param {Ol.View} mv The map view
     *
     */


    /**
     * @function getOptionsFromMap: Helper function generate {@link Option} scale components
     * based on an existing instance of {@link Ol.Map}
     */


    /**
     * Determine option element for provided zoom level out of array of valid options.
     *
     * @param {Number} zoom zoom level
     *
     * @return {Element} Option element for provided zoom level
     */

  }, {
    key: 'componentWillMount',


    /**
     * componentWillMount - Description
     *
     * @return {type} Description
     */
    value: function componentWillMount() {
      if ((0, _lodash.isEmpty)(this.state.scales) && this.props.map) {
        this.getOptionsFromMap();
      }
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          style = _props.style,
          className = _props.className;


      var finalClassName = className ? className + ' ' + this.className : this.className;

      var options = this.state.scales.map(function (roundScale) {
        return _react2.default.createElement(
          Option,
          {
            key: roundScale,
            value: roundScale
          },
          '1:' + roundScale.toLocaleString()
        );
      });

      return _react2.default.createElement(
        _select2.default,
        {
          showSearch: true,
          onChange: this.state.onZoomLevelSelect,
          filterOption: false,
          value: this.determineOptionKeyForZoomLevel(this.state.zoomLevel),
          size: 'small',
          style: style,
          className: finalClassName
        },
        options
      );
    }
  }]);

  return ScaleCombo;
}(_react2.default.Component);

ScaleCombo.propTypes = {
  /**
   * The className which should be added.
   * @type {String}
   */
  className: _propTypes2.default.string,

  /**
   * The zoomLevel.
   * @type {Number}
   */
  zoomLevel: _propTypes2.default.number,

  /**
   * The onZoomLevelSelect function. Pass a function if you want something
   * different than the resolution of the passed map.
   *
   * @type {Function}
   */
  onZoomLevelSelect: _propTypes2.default.func,

  /**
   * The resolutions.
   * @type {Array}
   */
  resolutions: _propTypes2.default.arrayOf(_propTypes2.default.number),

  /**
   * The scales.
   * @type {Array}
   */
  scales: _propTypes2.default.arrayOf(_propTypes2.default.shape),

  /**
   * The style object
   * @type {Object}
   */
  style: _propTypes2.default.object,

  /**
   * The map
   * @type {Ol.Map}
   */
  map: _propTypes2.default.object.isRequired,

  /**
   * Set to false to not listen to the map moveend event.
   *
   * @type {Boolean} [true]
   */
  syncWithMap: _propTypes2.default.bool };
ScaleCombo.defaultProps = {
  style: {
    width: 100
  },
  scales: [],
  syncWithMap: true };
exports.default = ScaleCombo;
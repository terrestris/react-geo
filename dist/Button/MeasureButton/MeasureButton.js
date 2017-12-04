'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _map = require('ol/map');

var _map2 = _interopRequireDefault(_map);

var _vector = require('ol/layer/vector');

var _vector2 = _interopRequireDefault(_vector);

var _vector3 = require('ol/source/vector');

var _vector4 = _interopRequireDefault(_vector3);

var _collection = require('ol/collection');

var _collection2 = _interopRequireDefault(_collection);

var _style = require('ol/style/style');

var _style2 = _interopRequireDefault(_style);

var _stroke = require('ol/style/stroke');

var _stroke2 = _interopRequireDefault(_stroke);

var _fill = require('ol/style/fill');

var _fill2 = _interopRequireDefault(_fill);

var _circle = require('ol/style/circle');

var _circle2 = _interopRequireDefault(_circle);

var _draw = require('ol/interaction/draw');

var _draw2 = _interopRequireDefault(_draw);

var _observable = require('ol/observable');

var _observable2 = _interopRequireDefault(_observable);

var _overlay = require('ol/overlay');

var _overlay2 = _interopRequireDefault(_overlay);

var _ToggleButton = require('../ToggleButton/ToggleButton.js');

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

var _MeasureUtil = require('../../Util/MeasureUtil/MeasureUtil');

var _MeasureUtil2 = _interopRequireDefault(_MeasureUtil);

var _MapUtil = require('../../Util/MapUtil/MapUtil');

var _MapUtil2 = _interopRequireDefault(_MapUtil);

require('./MeasureButton.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The MeasureButton.
 *
 * @class The MeasureButton
 * @extends React.Component
 */
var MeasureButton = function (_React$Component) {
  _inherits(MeasureButton, _React$Component);

  /**
   * Creates the MeasureButton.
   *
   * @constructs MeasureButton
   */


  /**
   * The properties.
   * @type {Object}
   */


  /**
   * An array of created divs we use for the tooltips. Used to eventually
   * clean up everything we added.
   *
   * @type{Array<HTMLDivElement>}
   * @private
   */


  /**
   * The measure tooltip element.
   *
   * @type {Element}
   * @private
   */


  /**
  * Overlay to show the help messages.
  *
  * @type {olOverlay}
  * @private
  */


  /**
   * Currently drawn feature.
   *
   * @type {OlFeature}
   * @private
   */
  function MeasureButton(props) {
    _classCallCheck(this, MeasureButton);

    var _this = _possibleConstructorReturn(this, (MeasureButton.__proto__ || Object.getPrototypeOf(MeasureButton)).call(this, props));

    _this.className = 'react-geo-measurebutton';
    _this._feature = null;
    _this._measureTooltip = null;
    _this._helpTooltip = null;
    _this._helpTooltipElement = null;
    _this._measureTooltipElement = null;
    _this._createdTooltipOverlays = [];
    _this._createdTooltipDivs = [];
    _this._eventKeys = {
      drawstart: null,
      drawend: null,
      pointermove: null,
      click: null
    };

    _this.onToggle = function (pressed) {
      _this.cleanup();

      if (pressed) {
        _this.state.drawInteraction.setActive(pressed);
        _this._eventKeys.drawstart = _this.state.drawInteraction.on('drawstart', _this.drawStart, _this);
        _this._eventKeys.drawend = _this.state.drawInteraction.on('drawend', _this.drawEnd, _this);
        _this._eventKeys.pointermove = _this.props.map.on('pointermove', _this.pointerMoveHandler, _this);
      }
    };

    _this.createMeasureLayer = function () {
      var _this$props = _this.props,
          measureLayerName = _this$props.measureLayerName,
          fillColor = _this$props.fillColor,
          strokeColor = _this$props.strokeColor,
          map = _this$props.map;


      var measureLayer = _MapUtil2.default.getLayerByName(map, measureLayerName);

      if (!measureLayer) {
        measureLayer = new _vector2.default({
          name: measureLayerName,
          source: new _vector4.default({
            features: new _collection2.default()
          }),
          style: new _style2.default({
            fill: new _fill2.default({
              color: fillColor
            }),
            stroke: new _stroke2.default({
              color: strokeColor,
              width: 2
            }),
            image: new _circle2.default({
              radius: 7,
              fill: new _fill2.default({
                color: fillColor
              })
            })
          })
        });
        map.addLayer(measureLayer);
      }
      _this.setState({ measureLayer: measureLayer }, function () {
        _this.createDrawInteraction();
      });
    };

    _this.createDrawInteraction = function () {
      var _this$props2 = _this.props,
          fillColor = _this$props2.fillColor,
          strokeColor = _this$props2.strokeColor,
          measureType = _this$props2.measureType,
          pressed = _this$props2.pressed,
          map = _this$props2.map;


      var maxPoints = measureType === 'angle' ? 2 : undefined;
      var drawType = measureType === 'polygon' ? 'MultiPolygon' : 'MultiLineString';

      var drawInteraction = new _draw2.default({
        name: 'react-geo_drawaction',
        source: _this.state.measureLayer.getSource(),
        type: drawType,
        maxPoints: maxPoints,
        style: new _style2.default({
          fill: new _fill2.default({
            color: fillColor
          }),
          stroke: new _stroke2.default({
            color: strokeColor,
            lineDash: [10, 10],
            width: 2
          }),
          image: new _circle2.default({
            radius: 5,
            stroke: new _stroke2.default({
              color: strokeColor
            }),
            fill: new _fill2.default({
              color: fillColor
            })
          })
        }),
        freehandCondition: function freehandCondition() {
          return false;
        }
      });

      drawInteraction.setActive(pressed);
      drawInteraction.on('change:active', _this.onDrawInteractionActiveChange, _this);
      map.addInteraction(drawInteraction);

      _this.setState({ drawInteraction: drawInteraction });
    };

    _this.onDrawInteractionActiveChange = function () {
      if (_this.state.drawInteraction.getActive()) {
        _this.createHelpTooltip();
        _this.createMeasureTooltip();
      } else {
        _this.removeHelpTooltip();
        _this.removeMeasureTooltip();
      }
    };

    _this.drawStart = function (evt) {
      var _this$props3 = _this.props,
          showMeasureInfoOnClickedPoints = _this$props3.showMeasureInfoOnClickedPoints,
          multipleDrawing = _this$props3.multipleDrawing,
          measureType = _this$props3.measureType,
          map = _this$props3.map;


      var source = _this.state.measureLayer.getSource();
      _this._feature = evt.feature;

      if (showMeasureInfoOnClickedPoints && measureType === 'line') {
        _this._eventKeys.click = map.on('click', _this.addMeasureStopTooltip, _this);
      }

      if (!multipleDrawing && source.getFeatures().length > 0) {
        _this.cleanupTooltips();
        _this.createMeasureTooltip();
        _this.createHelpTooltip();
        source.clear();
      }
    };

    _this.drawEnd = function () {
      var _this$props4 = _this.props,
          measureType = _this$props4.measureType,
          showMeasureInfoOnClickedPoints = _this$props4.showMeasureInfoOnClickedPoints,
          measureTooltipCssClasses = _this$props4.measureTooltipCssClasses;


      if (_this._eventKeys.click) {
        _observable2.default.unByKey(_this._eventKeys.click);
      }

      // Fix doubled label for lastPoint of line
      if (showMeasureInfoOnClickedPoints && measureType === 'line') {
        _this.removeMeasureTooltip();
      } else {
        _this._measureTooltipElement.className = measureTooltipCssClasses.tooltip + ' ' + measureTooltipCssClasses.tooltipStatic;
        _this._measureTooltip.setOffset([0, -7]);
      }

      // unset sketch
      _this._feature = null;

      // fix doubled label for last point of line
      if (showMeasureInfoOnClickedPoints && measureType === 'line') {
        _this._measureTooltipElement = null;
        _this.createMeasureTooltip();
      }
    };

    _this.addMeasureStopTooltip = function (evt) {
      var _this$props5 = _this.props,
          measureType = _this$props5.measureType,
          decimalPlacesInTooltips = _this$props5.decimalPlacesInTooltips,
          map = _this$props5.map,
          measureTooltipCssClasses = _this$props5.measureTooltipCssClasses;


      if (!(0, _lodash.isEmpty)(_this._feature)) {
        var geom = _this._feature.getGeometry();
        var value = measureType === 'line' ? _MeasureUtil2.default.formatLength(geom, map, decimalPlacesInTooltips) : _MeasureUtil2.default.formatArea(geom, map, decimalPlacesInTooltips);

        if (parseInt(value, 10) > 0) {
          var div = document.createElement('div');
          div.className = measureTooltipCssClasses.tooltip + ' ' + measureTooltipCssClasses.tooltipStatic;
          div.innerHTML = value;
          var tooltip = new _overlay2.default({
            element: div,
            offset: [0, -15],
            positioning: 'bottom-center'
          });
          map.addOverlay(tooltip);
          tooltip.setPosition(evt.coordinate);

          _this._createdTooltipDivs.push(div);
          _this._createdTooltipOverlays.push(tooltip);
        }
      }
    };

    _this.createMeasureTooltip = function () {
      var _this$props6 = _this.props,
          map = _this$props6.map,
          measureTooltipCssClasses = _this$props6.measureTooltipCssClasses;


      if (_this._measureTooltipElement) {
        return;
      }

      _this._measureTooltipElement = document.createElement('div');
      _this._measureTooltipElement.className = measureTooltipCssClasses.tooltip + ' ' + measureTooltipCssClasses.tooltipDynamic;
      _this._measureTooltip = new _overlay2.default({
        element: _this._measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
      });
      map.addOverlay(_this._measureTooltip);
    };

    _this.createHelpTooltip = function () {
      var _this$props7 = _this.props,
          map = _this$props7.map,
          measureTooltipCssClasses = _this$props7.measureTooltipCssClasses;


      if (_this._helpTooltipElement) {
        return;
      }

      _this._helpTooltipElement = document.createElement('div');
      _this._helpTooltipElement.className = measureTooltipCssClasses.tooltip;
      _this._helpTooltip = new _overlay2.default({
        element: _this._helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
      });
      map.addOverlay(_this._helpTooltip);
    };

    _this.removeHelpTooltip = function () {
      if (_this._helpTooltip) {
        _this.props.map.removeOverlay(_this._helpTooltip);
      }
      _this._helpTooltipElement = null;
      _this._helpTooltip = null;
    };

    _this.removeMeasureTooltip = function () {
      if (_this._measureTooltip) {
        _this.props.map.removeOverlay(_this._measureTooltip);
      }
      _this._measureTooltipElement = null;
      _this._measureTooltip = null;
    };

    _this.cleanupTooltips = function () {
      var map = _this.props.map;


      _this._createdTooltipOverlays.forEach(function (tooltipOverlay) {
        map.removeOverlay(tooltipOverlay);
      });

      _this._createdTooltipOverlays = [];

      _this._createdTooltipDivs.forEach(function (tooltipDiv) {
        var parent = tooltipDiv && tooltipDiv.parentNode;
        if (parent) {
          parent.removeChild(tooltipDiv);
        }
      });
      _this._createdTooltipDivs = [];
    };

    _this.cleanup = function () {
      _this.state.drawInteraction.setActive(false);

      Object.keys(_this._eventKeys).forEach(function (key) {
        if (_this._eventKeys[key]) {
          _observable2.default.unByKey(_this._eventKeys[key]);
        }
      });
      _this.cleanupTooltips();
      _this.state.measureLayer.getSource().clear();
    };

    _this.pointerMoveHandler = function (evt) {
      var _this$props8 = _this.props,
          clickToDrawText = _this$props8.clickToDrawText,
          continuePolygonMsg = _this$props8.continuePolygonMsg,
          continueLineMsg = _this$props8.continueLineMsg,
          continueAngleMsg = _this$props8.continueAngleMsg,
          measureType = _this$props8.measureType,
          decimalPlacesInTooltips = _this$props8.decimalPlacesInTooltips,
          map = _this$props8.map;


      if (evt.dragging) {
        return;
      }

      if (!_this._helpTooltipElement || !_this._measureTooltipElement) {
        return;
      }

      var helpMsg = clickToDrawText;
      var helpTooltipCoord = evt.coordinate;
      var measureTooltipCoord = evt.coordinate;

      if (_this._feature) {
        var output = void 0;
        var geom = _this._feature.getGeometry();
        measureTooltipCoord = geom.getLastCoordinate();
        if (measureType === 'polygon') {
          output = _MeasureUtil2.default.formatArea(geom, map, decimalPlacesInTooltips);
          helpMsg = continuePolygonMsg;
          // attach area at interior point
          measureTooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (measureType === 'line') {
          output = _MeasureUtil2.default.formatLength(geom, map, decimalPlacesInTooltips);
          helpMsg = continueLineMsg;
          measureTooltipCoord = geom.getLastCoordinate();
        } else if (measureType === 'angle') {
          output = _MeasureUtil2.default.formatAngle(geom, map, decimalPlacesInTooltips);
          helpMsg = continueAngleMsg;
        }
        _this._measureTooltipElement.innerHTML = output;
        _this._measureTooltip.setPosition(measureTooltipCoord);
      }

      _this._helpTooltipElement.innerHTML = helpMsg;
      _this._helpTooltip.setPosition(helpTooltipCoord);
    };

    _this.state = {
      measureLayer: null,
      drawInteraction: null
    };
    return _this;
  }

  /**
   * `componentWillMount` method of the MeasureButton. Just calls a
   * `createMeasureLayer` method.
   *
   * @method
   */


  /**
   * The default properties.
   * @type {Object}
   */


  /**
   * An object holding keyed `OlEventsKey` instances returned by the `on`
   * method of `OlObservable`. These keys are used to unbind temporary
   * listeners on events of the `OlInteractionDraw` or `OlMap`. The keys
   * are the names of the events on the various objects. The `click` key is
   * not always bound, but only for certain #measureType values.
   *
   * In #cleanup, we unbind all events we have bound so as to not leak
   * memory, and to ensure we have no concurring listeners being active at a
   * time (E.g. when multiple measure buttons are in an application).
   *
   * @type {Object}
   * @private
   */


  /**
   * An array of created overlays we use for the tooltips. Used to eventually
   * clean up everything we added.
   *
   * @type{Array<OlOverlay>}
   * @private
   */


  /**
  * The help tooltip element.
  *
  * @type {Element}
  * @private
  */


  /**
   * Overlay to show the measurement.
   *
   * @type {olOverlay}
   * @private
   */


  /**
   * The className added to this component.
   *
   * @type {String}
   * @private
   */


  _createClass(MeasureButton, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.createMeasureLayer();
    }

    /**
     * Called when the button is toggled, this method ensures that everything
     * is cleaned up when unpressed, and that measuring can start when pressed.
     *
     * @method
     */


    /**
     * Creates measure vector layer and add this to the map.
     *
     * @method
     */


    /**
     * Creates a correctly configured OL draw interaction depending on
     * the configured measureType.
     *
     * @return {OlInteractionDraw} The created interaction, which is not yet
     *   added to the map.
     *
     * @method
     */


    /**
     * Adjusts visibility of measurement related tooltips depending on active
     * status of draw interaction.
     *
     * @method
     */


    /**
     * Sets up listeners whenever the drawing of a measurement sketch is
     * started.
     *
     * @param {OlInteractionDrawEvent} evt The event which contains the
     *   feature we are drawing.
     *
     * @method
     */


    /**
     * Called whenever measuring stops, this method draws static tooltips with
     * the result onto the map canvas and unregisters various listeners.
     *
     * @method
     */


    /**
     * Adds a tooltip on click where a measuring stop occured.
     *
     * @param {OlMapBrowserEvent} evt The event which contains the coordinate
     *   for the tooltip.
     *
     * @method
     */


    /**
     * Creates a new measure tooltip as `OlOverlay`.
     *
     * @method
     */


    /**
     * Creates a new help tooltip as `OlOverlay`.
     *
     * @method
     */


    /**
     * Removes help tooltip from the map if measure button was untoggled.
     *
     * @method
     */


    /**
     * Removes measure tooltip from the map if measure button was untoggled.
     *
     * @method
     */


    /**
     * Cleans up tooltips when the button is unpressed.
     *
     * @method
     */


    /**
     * Cleans up artifacts from measuring when the button is unpressed.
     *
     * @method
     */


    /**
     * Handle pointer move by updating and repositioning the dynamic tooltip.
     *
     * @param {OlMapBrowserEvent} evt The event from the pointermove.
     *
     * @method
     */

  }, {
    key: 'render',


    /**
     * The render function.
     */
    value: function render() {
      var _props = this.props,
          className = _props.className,
          map = _props.map,
          measureType = _props.measureType,
          measureLayerName = _props.measureLayerName,
          fillColor = _props.fillColor,
          strokeColor = _props.strokeColor,
          showMeasureInfoOnClickedPoints = _props.showMeasureInfoOnClickedPoints,
          multipleDrawing = _props.multipleDrawing,
          clickToDrawText = _props.clickToDrawText,
          continuePolygonMsg = _props.continuePolygonMsg,
          continueLineMsg = _props.continueLineMsg,
          continueAngleMsg = _props.continueAngleMsg,
          decimalPlacesInTooltips = _props.decimalPlacesInTooltips,
          measureTooltipCssClasses = _props.measureTooltipCssClasses,
          passThroughProps = _objectWithoutProperties(_props, ['className', 'map', 'measureType', 'measureLayerName', 'fillColor', 'strokeColor', 'showMeasureInfoOnClickedPoints', 'multipleDrawing', 'clickToDrawText', 'continuePolygonMsg', 'continueLineMsg', 'continueAngleMsg', 'decimalPlacesInTooltips', 'measureTooltipCssClasses']);

      var finalClassName = className ? className + ' ' + this.className : this.className;

      return _react2.default.createElement(_ToggleButton2.default, _extends({
        onToggle: this.onToggle,
        className: finalClassName
      }, passThroughProps));
    }
  }]);

  return MeasureButton;
}(_react2.default.Component);

MeasureButton.propTypes = {
  /**
   * The className which should be added.
   *
   * @type {String}
   */
  className: _propTypes2.default.string,

  /**
   * Instance of OL map this component is bound to.
   *
   * @type {OlMap}
   */
  map: _propTypes2.default.instanceOf(_map2.default).isRequired,

  /**
   * Whether line, area or angle will be measured.
   *
   * @type {String}
   */
  measureType: _propTypes2.default.oneOf(['line', 'polygon', 'angle']).isRequired,

  /**
   * Name of system vector layer which will be used to draw measurement
   * results.
   *
   * @type {String}
   */
  measureLayerName: _propTypes2.default.string,

  /**
   * Fill color of the measurement feature.
   *
   * @type {String}
   */
  fillColor: _propTypes2.default.string,

  /**
   * Stroke color of the measurement feature.
   *
   * @type {String}
   */
  strokeColor: _propTypes2.default.string,

  /**
   * Determines if a marker with current measurement should be shown every
   * time the user clicks while drawing. Default is false.
   *
   * @type {Boolean}
   */
  showMeasureInfoOnClickedPoints: _propTypes2.default.bool,

  /**
   * Used to allow / disallow multiple drawings at a time on the map.
   * Default is false.
   * TODO known issue: only label of the last drawn feature will be shown!
   *
   * @type {Boolean}
   */
  multipleDrawing: _propTypes2.default.bool,

  /**
  * Tooltip which will be shown on map mouserover after measurement button
  * was activated.
  *
  * @type {String}
  */
  clickToDrawText: _propTypes2.default.string,

  /**
   * Tooltip which will be shown after polygon measurement button was toggled
   * and at least one click in the map is occured.
   *
   * @type {String}
   */
  continuePolygonMsg: _propTypes2.default.string,

  /**
   * Tooltip which will be shown after line measurement button was toggled
   * and at least one click in the map is occured.
   *
   * @type {String}
   */
  continueLineMsg: _propTypes2.default.string,

  /**
   * Tooltip which will be shown after angle measurement button was toggled
   * and at least one click in the map is occured.
   *
   * @type {String}
   */
  continueAngleMsg: _propTypes2.default.string,

  /**
  * How many decimal places will be allowed for the measure tooltips.
  * Default is 2.
  *
  * @param {Number} decimalPlacesInTooltips.
  */
  decimalPlacesInTooltips: _propTypes2.default.number,

  /**
   * CSS classes we'll assign to the popups and tooltips from measuring.
   * Overwrite this object to style the text of the popups / overlays, if you
   * don't want to use default classes.
   *
   * @param {Object} measureTooltipCssClasses
   */
  measureTooltipCssClasses: _propTypes2.default.object,

  /**
   * Whether the measure button is pressed.
   *
   * @param {Boolean} pressed
   */
  pressed: _propTypes2.default.bool
};
MeasureButton.defaultProps = {
  measureLayerName: 'react-geo_measure',
  fillColor: 'rgba(255, 0, 0, 0.5)',
  strokeColor: 'rgba(255, 0, 0, 0.8)',
  showMeasureInfoOnClickedPoints: false,
  decimalPlacesInTooltips: 2,
  multipleDrawing: false,
  continuePolygonMsg: 'Click to draw area',
  continueLineMsg: 'Click to draw line',
  continueAngleMsg: 'Click to draw angle',
  clickToDrawText: 'Click to measure',
  measureTooltipCssClasses: {
    tooltip: 'react-geo-measure-tooltip',
    tooltipDynamic: 'react-geo-measure-tooltip-dynamic',
    tooltipStatic: 'react-geo-measure-tooltip-static'
  },
  pressed: false };
exports.default = MeasureButton;
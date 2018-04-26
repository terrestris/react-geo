import React from 'react';
import PropTypes from 'prop-types';

import isEmpty from 'lodash/isEmpty.js';

import OlMap from 'ol/Map';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlCollection from 'ol/Collection';
import OlMultiPolygon from 'ol/geom/MultiPolygon';
import OlMultiLinestring from 'ol/geom/MultiLineString';
import OlStyleStyle from 'ol/style/Style';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleFill from 'ol/style/Fill';
import OlStyleCircle from 'ol/style/Circle';
import OlInteractionDraw from 'ol/interaction/Draw';
import { unByKey } from 'ol/Observable';
import OlOverlay from 'ol/Overlay';

import ToggleButton from '../ToggleButton/ToggleButton.jsx';
import MeasureUtil from '@terrestris/ol-util/src/MeasureUtil/MeasureUtil';
import MapUtil from '@terrestris/ol-util/src/MapUtil/MapUtil';
import { CSS_PREFIX } from '../../constants';

import './MeasureButton.less';

/**
 * The MeasureButton.
 *
 * @class The MeasureButton
 * @extends React.Component
 */
class MeasureButton extends React.Component {

  /**
   * The className added to this component.
   *
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}measurebutton`;

  /**
   * Currently drawn feature.
   *
   * @type {OlFeature}
   * @private
   */
  _feature = null;

  /**
   * Overlay to show the measurement.
   *
   * @type {olOverlay}
   * @private
   */
  _measureTooltip = null;

  /**
  * Overlay to show the help messages.
  *
  * @type {olOverlay}
  * @private
  */
  _helpTooltip = null;

  /**
  * The help tooltip element.
  *
  * @type {Element}
  * @private
  */
  _helpTooltipElement = null;

  /**
   * The measure tooltip element.
   *
   * @type {Element}
   * @private
   */
  _measureTooltipElement = null;

  /**
   * An array of created overlays we use for the tooltips. Used to eventually
   * clean up everything we added.
   *
   * @type{Array<OlOverlay>}
   * @private
   */
  _createdTooltipOverlays = [];

  /**
   * An array of created divs we use for the tooltips. Used to eventually
   * clean up everything we added.
   *
   * @type{Array<HTMLDivElement>}
   * @private
   */
  _createdTooltipDivs = [];

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
  _eventKeys = {
    drawstart: null,
    drawend: null,
    pointermove: null,
    click: null
  };

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * The className which should be added.
     *
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * Instance of OL map this component is bound to.
     *
     * @type {OlMap}
     */
    map: PropTypes.instanceOf(OlMap).isRequired,

    /**
     * Whether line, area or angle will be measured.
     *
     * @type {String}
     */
    measureType: PropTypes.oneOf(['line', 'polygon', 'angle']).isRequired,

    /**
     * Name of system vector layer which will be used to draw measurement
     * results.
     *
     * @type {String}
     */
    measureLayerName: PropTypes.string,

    /**
     * Fill color of the measurement feature.
     *
     * @type {String}
     */
    fillColor: PropTypes.string,

    /**
     * Stroke color of the measurement feature.
     *
     * @type {String}
     */
    strokeColor: PropTypes.string,

    /**
     * Determines if a marker with current measurement should be shown every
     * time the user clicks while drawing. Default is false.
     *
     * @type {Boolean}
     */
    showMeasureInfoOnClickedPoints: PropTypes.bool,

    /**
     * Determines if a tooltip with helpful information is shown next to the mouse
     * position. Default is true.
     *
     * @type {Boolean}
     */
    showHelpTooltip: PropTypes.bool,

    /**
     * Used to allow / disallow multiple drawings at a time on the map.
     * Default is false.
     * TODO known issue: only label of the last drawn feature will be shown!
     *
     * @type {Boolean}
     */
    multipleDrawing: PropTypes.bool,

    /**
    * Tooltip which will be shown on map mouserover after measurement button
    * was activated.
    *
    * @type {String}
    */
    clickToDrawText: PropTypes.string,

    /**
     * Tooltip which will be shown after polygon measurement button was toggled
     * and at least one click in the map is occured.
     *
     * @type {String}
     */
    continuePolygonMsg: PropTypes.string,

    /**
     * Tooltip which will be shown after line measurement button was toggled
     * and at least one click in the map is occured.
     *
     * @type {String}
     */
    continueLineMsg: PropTypes.string,

    /**
     * Tooltip which will be shown after angle measurement button was toggled
     * and at least one click in the map is occured.
     *
     * @type {String}
     */
    continueAngleMsg: PropTypes.string,

    /**
     * How many decimal places will be allowed for the measure tooltips.
     * Default is 2.
     *
     * @type {Number} decimalPlacesInTooltips
     */
    decimalPlacesInTooltips: PropTypes.number,

    /**
     * CSS classes we'll assign to the popups and tooltips from measuring.
     * Overwrite this object to style the text of the popups / overlays, if you
     * don't want to use default classes.
     *
     * @type {Object} measureTooltipCssClasses
     */
    measureTooltipCssClasses: PropTypes.shape({
      tooltip: PropTypes.string,
      tooltipDynamic: PropTypes.string,
      tooltipStatic: PropTypes.string
    }),

    /**
     * Whether the measure button is pressed.
     *
     * @type {Boolean} pressed
     */
    pressed: PropTypes.bool,

    /**
     * A custom onToogle function that will be called
     * if button is toggled
     *
     * @type {Function} onToggle
     */
    onToggle: PropTypes.func
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    measureLayerName: 'react-geo_measure',
    fillColor: 'rgba(255, 0, 0, 0.5)',
    strokeColor: 'rgba(255, 0, 0, 0.8)',
    showMeasureInfoOnClickedPoints: false,
    showHelpTooltip: true,
    decimalPlacesInTooltips: 2,
    multipleDrawing: false,
    continuePolygonMsg: 'Click to draw area',
    continueLineMsg: 'Click to draw line',
    continueAngleMsg: 'Click to draw angle',
    clickToDrawText: 'Click to measure',
    measureTooltipCssClasses: {
      tooltip: `${CSS_PREFIX}measure-tooltip`,
      tooltipDynamic: `${CSS_PREFIX}measure-tooltip-dynamic`,
      tooltipStatic: `${CSS_PREFIX}measure-tooltip-static`
    },
    pressed: false,
    onToggle: () => {}
  }

  /**
   * Creates the MeasureButton.
   *
   * @constructs MeasureButton
   */
  constructor(props) {

    super(props);

    this.state = {
      measureLayer: null,
      drawInteraction: null
    };
  }

  /**
   * `componentDidMount` method of the MeasureButton. Just calls a
   * `createMeasureLayer` method.
   *
   * @method
   */
  componentDidMount() {
    this.createMeasureLayer();
  }

  /**
   * Called when the button is toggled, this method ensures that everything
   * is cleaned up when unpressed, and that measuring can start when pressed.
   *
   * @method
   */
  onToggle = (pressed) => {
    this.cleanup();

    this.props.onToggle(pressed);

    if (pressed && this.state.drawInteraction) {
      this.state.drawInteraction.setActive(pressed);
      this._eventKeys.drawstart = this.state.drawInteraction.on(
        'drawstart', this.drawStart, this
      );
      this._eventKeys.drawend = this.state.drawInteraction.on(
        'drawend', this.drawEnd, this
      );
      this._eventKeys.pointermove = this.props.map.on(
        'pointermove', this.updateMeasureTooltip, this
      );
    }
  }

  /**
   * Creates measure vector layer and add this to the map.
   *
   * @method
   */
  createMeasureLayer = () => {
    const {
      measureLayerName,
      fillColor,
      strokeColor,
      map
    } = this.props;

    let measureLayer = MapUtil.getLayerByName(map, measureLayerName);

    if (!measureLayer) {
      measureLayer = new OlLayerVector({
        name: measureLayerName,
        source: new OlSourceVector({
          features: new OlCollection()
        }),
        style: new OlStyleStyle({
          fill: new OlStyleFill({
            color: fillColor
          }),
          stroke: new OlStyleStroke({
            color: strokeColor,
            width: 2
          }),
          image: new OlStyleCircle({
            radius: 7,
            fill: new OlStyleFill({
              color: fillColor
            })
          })
        })
      });
      map.addLayer(measureLayer);
    }
    this.setState({measureLayer}, () => {
      this.createDrawInteraction();
    });
  }

  /**
   * Creates a correctly configured OL draw interaction depending on
   * the configured measureType.
   *
   * @return {OlInteractionDraw} The created interaction, which is not yet
   *   added to the map.
   *
   * @method
   */
  createDrawInteraction = () => {
    const {
      fillColor,
      strokeColor,
      measureType,
      pressed,
      map
    } = this.props;

    const maxPoints = measureType === 'angle' ? 2 : undefined;
    const drawType = measureType === 'polygon' ? 'MultiPolygon' : 'MultiLineString';

    const drawInteraction = new OlInteractionDraw({
      name: 'react-geo_drawaction',
      source: this.state.measureLayer.getSource(),
      type: drawType,
      maxPoints: maxPoints,
      style: new OlStyleStyle({
        fill: new OlStyleFill({
          color: fillColor
        }),
        stroke: new OlStyleStroke({
          color: strokeColor,
          lineDash: [10, 10],
          width: 2
        }),
        image: new OlStyleCircle({
          radius: 5,
          stroke: new OlStyleStroke({
            color: strokeColor
          }),
          fill: new OlStyleFill({
            color: fillColor
          })
        })
      }),
      freehandCondition: function() {
        return false;
      }
    });

    map.addInteraction(drawInteraction);
    drawInteraction.on('change:active', this.onDrawInteractionActiveChange, this);

    this.setState({drawInteraction}, () => {
      if (pressed) {
        this.onDrawInteractionActiveChange();
      }
      drawInteraction.setActive(pressed);
    });
  }

  /**
   * Adjusts visibility of measurement related tooltips depending on active
   * status of draw interaction.
   *
   * @method
   */
  onDrawInteractionActiveChange = () => {
    if (this.state.drawInteraction.getActive()) {
      if (this.props.showHelpTooltip) {
        this.createHelpTooltip();
      }
      this.createMeasureTooltip();
    } else {
      if (this.props.showHelpTooltip) {
        this.removeHelpTooltip();
      }
      this.removeMeasureTooltip();
    }
  }

  /**
   * Sets up listeners whenever the drawing of a measurement sketch is
   * started.
   *
   * @param {OlInteractionDrawEvent} evt The event which contains the
   *   feature we are drawing.
   *
   * @method
   */
  drawStart = (evt) => {
    const {
      showMeasureInfoOnClickedPoints,
      showHelpTooltip,
      multipleDrawing,
      measureType,
      map
    } = this.props;

    const source = this.state.measureLayer.getSource();
    this._feature = evt.feature;

    if (showMeasureInfoOnClickedPoints) {
      if (measureType === 'line') {
        this._eventKeys.click = map.on('click', this.addMeasureStopTooltip, this);
      } else if (measureType === 'polygon') {
        this._eventKeys.click = map.on('click', this.updateMeasureTooltip, this);
      }
    }

    if (!multipleDrawing && source.getFeatures().length > 0) {
      this.cleanupTooltips();
      this.createMeasureTooltip();
      if (showHelpTooltip) {
        this.createHelpTooltip();
      }
      source.clear();
    }
  }

  /**
   * Called whenever measuring stops, this method draws static tooltips with
   * the result onto the map canvas and unregisters various listeners.
   *
   * @method
   */
  drawEnd = (evt) => {
    const {
      measureType,
      showMeasureInfoOnClickedPoints,
      measureTooltipCssClasses
    } = this.props;

    if (this._eventKeys.click) {
      unByKey(this._eventKeys.click);
    }

    // Fix doubled label for lastPoint of line
    if (showMeasureInfoOnClickedPoints && measureType === 'line') {
      this.removeMeasureTooltip();
    } else {
      this._measureTooltipElement.className =
        `${measureTooltipCssClasses.tooltip} ${measureTooltipCssClasses.tooltipStatic}`;
      this._measureTooltip.setOffset([0, -7]);
    }

    this.updateMeasureTooltip(evt);

    // unset sketch
    this._feature = null;

    // fix doubled label for last point of line
    if (showMeasureInfoOnClickedPoints && measureType === 'line') {
      this._measureTooltipElement = null;
      this.createMeasureTooltip();
    }

  }

  /**
   * Adds a tooltip on click where a measuring stop occured.
   *
   * @param {OlMapBrowserEvent} evt The event which contains the coordinate
   *   for the tooltip.
   *
   * @method
   */
  addMeasureStopTooltip = (evt) => {
    const {
      measureType,
      decimalPlacesInTooltips,
      map,
      measureTooltipCssClasses
    } = this.props;

    if (!isEmpty(this._feature)) {
      let geom = this._feature.getGeometry();
      if (geom instanceof OlMultiPolygon) {
        geom = geom.getPolygons()[0];
      }
      if (geom instanceof OlMultiLinestring) {
        geom = geom.getLineStrings()[0];
      }
      const value = measureType === 'line' ?
        MeasureUtil.formatLength(geom, map, decimalPlacesInTooltips) :
        MeasureUtil.formatArea(geom, map, decimalPlacesInTooltips);

      if (parseInt(value, 10) > 0) {
        const div = document.createElement('div');
        div.className = `${measureTooltipCssClasses.tooltip} ${measureTooltipCssClasses.tooltipStatic}`;
        div.innerHTML = value;
        const tooltip = new OlOverlay({
          element: div,
          offset: [0, -15],
          positioning: 'bottom-center'
        });
        map.addOverlay(tooltip);
        tooltip.setPosition(evt.coordinate);

        this._createdTooltipDivs.push(div);
        this._createdTooltipOverlays.push(tooltip);
      }
    }
  }

  /**
   * Creates a new measure tooltip as `OlOverlay`.
   *
   * @method
   */
  createMeasureTooltip = () => {
    const {
      map,
      measureTooltipCssClasses
    } = this.props;

    if (this._measureTooltipElement) {
      return;
    }

    this._measureTooltipElement = document.createElement('div');
    this._measureTooltipElement.className =
      `${measureTooltipCssClasses.tooltip} ${measureTooltipCssClasses.tooltipDynamic}`;
    this._measureTooltip = new OlOverlay({
      element: this._measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    map.addOverlay(this._measureTooltip);
  }

  /**
   * Creates a new help tooltip as `OlOverlay`.
   *
   * @method
   */
  createHelpTooltip = () => {
    const {
      map,
      measureTooltipCssClasses
    } = this.props;

    if (this._helpTooltipElement) {
      return;
    }

    this._helpTooltipElement = document.createElement('div');
    this._helpTooltipElement.className = measureTooltipCssClasses.tooltip;
    this._helpTooltip = new OlOverlay({
      element: this._helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    });
    map.addOverlay(this._helpTooltip);
  }

  /**
   * Removes help tooltip from the map if measure button was untoggled.
   *
   * @method
   */
  removeHelpTooltip = () => {
    if (this._helpTooltip) {
      this.props.map.removeOverlay(this._helpTooltip);
    }
    this._helpTooltipElement = null;
    this._helpTooltip = null;
  }

  /**
   * Removes measure tooltip from the map if measure button was untoggled.
   *
   * @method
   */
  removeMeasureTooltip = () => {
    if (this._measureTooltip) {
      this.props.map.removeOverlay(this._measureTooltip);
    }
    this._measureTooltipElement = null;
    this._measureTooltip = null;
  }

  /**
   * Cleans up tooltips when the button is unpressed.
   *
   * @method
   */
  cleanupTooltips = () => {
    const {
      map
    } = this.props;

    this._createdTooltipOverlays.forEach((tooltipOverlay) => {
      map.removeOverlay(tooltipOverlay);
    });

    this._createdTooltipOverlays = [];

    this._createdTooltipDivs.forEach((tooltipDiv) => {
      const parent = tooltipDiv && tooltipDiv.parentNode;
      if (parent) {
        parent.removeChild(tooltipDiv);
      }
    });
    this._createdTooltipDivs = [];
    this.removeMeasureTooltip();
  }

  /**
   * Cleans up artifacts from measuring when the button is unpressed.
   *
   * @method
   */
  cleanup = () => {
    if (this.state.drawInteraction) {
      this.state.drawInteraction.setActive(false);
    }

    Object.keys(this._eventKeys).forEach(key => {
      if (this._eventKeys[key]) {
        unByKey(this._eventKeys[key]);
      }
    });
    this.cleanupTooltips();
    if (this.state.measureLayer) {
      this.state.measureLayer.getSource().clear();
    }
  }

  /**
   * Handle pointer move or click by updating and repositioning the dynamic tooltip.
   *
   * @param {OlMapBrowserEvent} evt The event from the pointermoveor click.
   *
   * @method
   */
  updateMeasureTooltip = (evt) => {
    const {
      clickToDrawText,
      continuePolygonMsg,
      continueLineMsg,
      continueAngleMsg,
      measureType,
      decimalPlacesInTooltips,
      map
    } = this.props;

    if (evt.dragging) {
      return;
    }

    if (!this._measureTooltipElement) {
      return;
    }

    let helpMsg = clickToDrawText;
    const helpTooltipCoord = evt.coordinate;
    let measureTooltipCoord = evt.coordinate;

    if (this._feature) {
      let output;
      let geom = this._feature.getGeometry();
      if (geom instanceof OlMultiPolygon) {
        geom = geom.getPolygons()[0];
      }
      if (geom instanceof OlMultiLinestring) {
        geom = geom.getLineStrings()[0];
      }
      measureTooltipCoord = geom.getLastCoordinate();
      if (measureType === 'polygon') {
        output = MeasureUtil.formatArea(geom, map, decimalPlacesInTooltips);
        helpMsg = continuePolygonMsg;
        // attach area at interior point
        measureTooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (measureType === 'line') {
        output = MeasureUtil.formatLength(geom, map, decimalPlacesInTooltips);
        helpMsg = continueLineMsg;
        measureTooltipCoord = geom.getLastCoordinate();
      } else if (measureType === 'angle') {
        output = MeasureUtil.formatAngle(geom, map, decimalPlacesInTooltips);
        helpMsg = continueAngleMsg;
      }
      this._measureTooltipElement.innerHTML = output;
      this._measureTooltip.setPosition(measureTooltipCoord);
    }

    if (this._helpTooltipElement) {
      this._helpTooltipElement.innerHTML = helpMsg;
      this._helpTooltip.setPosition(helpTooltipCoord);
    }
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      map,
      measureType,
      measureLayerName,
      fillColor,
      strokeColor,
      showMeasureInfoOnClickedPoints,
      showHelpTooltip,
      multipleDrawing,
      clickToDrawText,
      continuePolygonMsg,
      continueLineMsg,
      continueAngleMsg,
      decimalPlacesInTooltips,
      measureTooltipCssClasses,
      onToggle,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <ToggleButton
        onToggle={this.onToggle}
        className={finalClassName}
        {...passThroughProps}
      />
    );
  }
}

export default MeasureButton;

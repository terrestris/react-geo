import * as React from 'react';

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

const _isEmpty = require('lodash/isEmpty');

import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';
import MeasureUtil from '@terrestris/ol-util/dist/MeasureUtil/MeasureUtil';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import { CSS_PREFIX } from '../../constants';

import './MeasureButton.less';

interface DefaultProps {
  /**
   * Name of system vector layer which will be used to draw measurement
   * results.
   */
  measureLayerName: string;
  /**
   * Fill color of the measurement feature.
   */
  fillColor: string;
  /**
   * Stroke color of the measurement feature.
   */
  strokeColor: string;
  /**
   * Determines if a marker with current measurement should be shown every
   * time the user clicks while measuring a distance. Default is false.
   */
  showMeasureInfoOnClickedPoints: boolean;
  /**
   * Determines if a tooltip with helpful information is shown next to the mouse
   * position. Default is true.
   */
  showHelpTooltip: boolean;
  /**
   * How many decimal places will be allowed for the measure tooltips.
   * Default is 2.
   */
  decimalPlacesInTooltips: number;
  /**
   * Used to allow / disallow multiple drawings at a time on the map.
   * Default is false.
   * TODO known issue: only label of the last drawn feature will be shown!
   */
  multipleDrawing: boolean;
  /**
   * Tooltip which will be shown on map mouserover after measurement button
   * was activated.
   */
  clickToDrawText: string;
  /**
   * Tooltip which will be shown after polygon measurement button was toggled
   * and at least one click in the map is occured.
   */
  continuePolygonMsg: string;
  /**
   * Tooltip which will be shown after line measurement button was toggled
   * and at least one click in the map is occured.
   */
  continueLineMsg: string;
  /**
   * Tooltip which will be shown after angle measurement button was toggled
   * and at least one click in the map is occured.
   */
  continueAngleMsg: string;
  /**
   * CSS classes we'll assign to the popups and tooltips from measuring.
   * Overwrite this object to style the text of the popups / overlays, if you
   * don't want to use default classes.
   */
  measureTooltipCssClasses: {
    tooltip: string;
    tooltipDynamic: string;
    tooltipStatic: string;
  };
  /**
   * Whether the measure button is pressed.
   */
  pressed: boolean;
  /**
   * A custom onToogle function that will be called if button is toggled
   */
  onToggle: (pressed: boolean) => void;
}

interface BaseProps {
  /**
   * The className which should be added.
   */
  className?: string;
  /**
   * Instance of OL map this component is bound to.
   */
  map: OlMap;
  /**
   * Whether line, area or angle will be measured.
   */
  measureType: 'line' | 'polygon' | 'angle';
}

export type MeasureButtonProps = BaseProps & Partial<DefaultProps> & ToggleButtonProps;

/**
 * The MeasureButton.
 *
 * @class The MeasureButton
 * @extends React.Component
 */
class MeasureButton extends React.Component<MeasureButtonProps> {

  /**
   * The className added to this component.
   *
   * @private
   */
  className = `${CSS_PREFIX}measurebutton`;

  /**
   * Currently drawn feature.
   *
   * @private
   */
  _feature = null;

  /**
   * Overlay to show the measurement.
   *
   * @private
   */
  _measureTooltip = null;

  /**
   * Overlay to show the help messages.
   *
   * @private
   */
  _helpTooltip = null;

  /**
   * The help tooltip element.
   *
   * @private
   */
  _helpTooltipElement = null;

  /**
   * The measure tooltip element.
   *
   * @private
   */
  _measureTooltipElement = null;

  /**
   * An array of created overlays we use for the tooltips. Used to eventually
   * clean up everything we added.
   *
   * @private
   */
  _createdTooltipOverlays = [];

  /**
   * An array of created divs we use for the tooltips. Used to eventually
   * clean up everything we added.
   *
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
   * @private
   */
  _eventKeys = {
    drawstart: null,
    drawend: null,
    pointermove: null,
    click: null,
    change: null
  };

  /**
   * The vector layer showing the geometries added by the draw interaction.
   *
   * @private
   */
  _measureLayer = null;

  /**
   * The draw interaction used to draw the geometries to measure.
   *
   * @private
   */
  _drawInteraction = null;

  /**
   * The default properties.
   */
  static defaultProps: DefaultProps = {
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
    onToggle: () => undefined
  };

  /**
   * Creates the MeasureButton.
   *
   * @constructs MeasureButton
   */
  constructor(props: BaseProps) {

    super(props);

    this.onDrawInteractionActiveChange = this.onDrawInteractionActiveChange.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onDrawStart = this.onDrawStart.bind(this);
    this.onDrawEnd = this.onDrawEnd.bind(this);
    this.onDrawInteractionGeometryChange = this.onDrawInteractionGeometryChange.bind(this);
    this.onMapPointerMove = this.onMapPointerMove.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
  }

  /**
   * `componentDidMount` method of the MeasureButton.
   *
   * @method
   */
  componentDidMount() {
    this.createMeasureLayer();
    this.createDrawInteraction();
  }

  /**
   * Called when the button is toggled, this method ensures that everything
   * is cleaned up when unpressed, and that measuring can start when pressed.
   *
   * @method
   */
  onToggle(pressed: boolean) {
    const {
      map,
      onToggle
    } = this.props;

    this.cleanup();

    onToggle(pressed);

    if (pressed && this._drawInteraction) {
      this._drawInteraction.setActive(pressed);

      this._eventKeys.drawstart = this._drawInteraction.on(
        'drawstart', this.onDrawStart, this
      );

      this._eventKeys.drawend = this._drawInteraction.on(
        'drawend', this.onDrawEnd, this
      );

      this._eventKeys.pointermove = map.on(
        'pointermove', this.onMapPointerMove, this
      );
    }
  }

  /**
   * Creates measure vector layer and add this to the map.
   *
   * @method
   */
  createMeasureLayer() {
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

    this._measureLayer = measureLayer;
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
  createDrawInteraction() {
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
      source: this._measureLayer.getSource(),
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

    this._drawInteraction = drawInteraction;

    if (pressed) {
      this.onDrawInteractionActiveChange();
    }

    drawInteraction.setActive(pressed);
  }

  /**
   * Adjusts visibility of measurement related tooltips depending on active
   * status of draw interaction.
   */
  onDrawInteractionActiveChange() {
    const {
      showHelpTooltip
    } = this.props;

    if (this._drawInteraction.getActive()) {
      if (showHelpTooltip) {
        this.createHelpTooltip();
      }
      this.createMeasureTooltip();
    } else {
      if (showHelpTooltip) {
        this.removeHelpTooltip();
      }
      this.removeMeasureTooltip();
    }
  }

  /**
   * Called if the current geometry of the draw interaction has changed.
   *
   * @param evt The generic change event.
   */
  onDrawInteractionGeometryChange(/*evt*/) {
    this.updateMeasureTooltip();
  }

  /**
   * Called on map click.
   *
   * @param evt The pointer event.
   */
  onMapClick(evt: any) {
    const {
      measureType,
      showMeasureInfoOnClickedPoints
    } = this.props;

    if (showMeasureInfoOnClickedPoints && measureType === 'line') {
      this.addMeasureStopTooltip(evt.coordinate);
    }
  }

  /**
   * Sets up listeners whenever the drawing of a measurement sketch is
   * started.
   *
   * @param evt The event which contains the
   *   feature we are drawing.
   *
   * @method
   */
  onDrawStart(evt: any) {
    const {
      showHelpTooltip,
      multipleDrawing,
      map
    } = this.props;

    const source = this._measureLayer.getSource();
    this._feature = evt.feature;

    this._eventKeys.change = this._feature.getGeometry().on('change',
      this.onDrawInteractionGeometryChange);

    this._eventKeys.click = map.on('click', this.onMapClick, this);

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
  onDrawEnd(evt: any) {
    const {
      measureType,
      multipleDrawing,
      showMeasureInfoOnClickedPoints,
      measureTooltipCssClasses
    } = this.props;

    if (this._eventKeys.click) {
      unByKey(this._eventKeys.click);
    }

    if (this._eventKeys.change) {
      unByKey(this._eventKeys.change);
    }

    if (multipleDrawing) {
      this.addMeasureStopTooltip(evt.feature.getGeometry().getLastCoordinate());
    }

    // Fix doubled label for lastPoint of line
    if ((multipleDrawing || showMeasureInfoOnClickedPoints) && measureType === 'line') {
      this.removeMeasureTooltip();
    } else {
      this._measureTooltipElement.className =
        `${measureTooltipCssClasses.tooltip} ${measureTooltipCssClasses.tooltipStatic}`;
      this._measureTooltip.setOffset([0, -7]);
    }

    this.updateMeasureTooltip();

    // unset sketch
    this._feature = null;

    // fix doubled label for last point of line
    if ((multipleDrawing || showMeasureInfoOnClickedPoints) && measureType === 'line') {
      this._measureTooltipElement = null;
      this.createMeasureTooltip();
    }
  }

  /**
   * Adds a tooltip on click where a measuring stop occured.
   *
   * @param coordinate The coordinate for the tooltip.
   */
  addMeasureStopTooltip(coordinate: Array<number>) {
    const {
      measureType,
      decimalPlacesInTooltips,
      map,
      measureTooltipCssClasses
    } = this.props;

    if (!_isEmpty(this._feature)) {
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

        tooltip.setPosition(coordinate);

        this._createdTooltipDivs.push(div);
        this._createdTooltipOverlays.push(tooltip);
      }
    }
  }

  /**
   * Creates a new measure tooltip as `OlOverlay`.
   */
  createMeasureTooltip() {
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
   */
  createHelpTooltip() {
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
   */
  removeHelpTooltip() {
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
  removeMeasureTooltip() {
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
  cleanupTooltips() {
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
  cleanup() {
    if (this._drawInteraction) {
      this._drawInteraction.setActive(false);
    }

    Object.keys(this._eventKeys).forEach(key => {
      if (this._eventKeys[key]) {
        unByKey(this._eventKeys[key]);
      }
    });

    this.cleanupTooltips();

    if (this._measureLayer) {
      this._measureLayer.getSource().clear();
    }
  }

  /**
   * Called on map's pointermove event.
   *
   * @param evt The pointer event.
   */
  onMapPointerMove(evt: any) {
    if (!evt.dragging) {
      this.updateHelpTooltip(evt.coordinate);
    }
  }

  /**
   * Updates the position and the text of the help tooltip.
   *
   * @param coordinate The coordinate to center the tooltip to.
   */
  updateHelpTooltip(coordinate: any) {
    const {
      measureType,
      clickToDrawText,
      continuePolygonMsg,
      continueLineMsg,
      continueAngleMsg
    } = this.props;

    if (!this._helpTooltipElement) {
      return;
    }

    let msg = clickToDrawText;

    if (this._helpTooltipElement) {
      if (measureType === 'polygon') {
        msg = continuePolygonMsg;
      } else if (measureType === 'line') {
        msg = continueLineMsg;
      } else if (measureType === 'angle') {
        msg = continueAngleMsg;
      }

      this._helpTooltipElement.innerHTML = msg;
      this._helpTooltip.setPosition(coordinate);
    }
  }

  /**
   * Updates the text and position of the measture tooltip.
   */
  updateMeasureTooltip() {
    const {
      measureType,
      decimalPlacesInTooltips,
      map
    } = this.props;

    if (!this._measureTooltipElement) {
      return;
    }

    if (this._feature) {
      let output;
      let geom = this._feature.getGeometry();

      if (geom instanceof OlMultiPolygon) {
        geom = geom.getPolygons()[0];
      }

      if (geom instanceof OlMultiLinestring) {
        geom = geom.getLineStrings()[0];
      }

      let measureTooltipCoord = geom.getLastCoordinate();

      if (measureType === 'polygon') {
        output = MeasureUtil.formatArea(geom, map, decimalPlacesInTooltips);
        // attach area at interior point
        measureTooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (measureType === 'line') {
        output = MeasureUtil.formatLength(geom, map, decimalPlacesInTooltips);
      } else if (measureType === 'angle') {
        output = MeasureUtil.formatAngle(geom, map, decimalPlacesInTooltips);
      }

      this._measureTooltipElement.innerHTML = output;
      this._measureTooltip.setPosition(measureTooltipCoord);
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

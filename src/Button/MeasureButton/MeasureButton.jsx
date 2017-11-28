import React from 'react';
import PropTypes from 'prop-types';

import OlMap from 'ol/map';
import OlLayerVector from 'ol/layer/vector';
import OlSourceVector from ' ol/source/vector';
import OlCollection from 'ol/collection';
import OlStyleStyle from 'ol/style/style';
import OlStyleStroke from 'ol/style/stroke';
import OlStyleFill from 'ol/style/fill';
import OlStyleCircle from 'ol/style/circle';
import OlInteractionDraw from 'ol/interaction/draw';
import OlObservableUnByKey from 'ol/observable/unbykey';

import ToggleButton from '../../index.js';

/**
 * The MeasureButton.
 *
 * @class The MeasureButton
 * @extends React.Component
 */
class MeasureButton extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = 'react-geo-measurebutton';

  /**
   * Currently drawn feature.
   *
   * @type {OlFeature}
   * @private
   */
  _feature = null;

  /**
   * An object holding keyed `ol.EventsKey` instances returned by the `on`
   * method of `ol.Observable`. These keys are used to unbind temporary
   * listeners on events of the `ol.interaction.Draw` or `ol.Map`. The keys
   * are the names of the events on the various objects. The `click` key is
   * not always bound, but only for certain #measureType values.
   *
   * In #cleanUp, we unbind all events we have bound so as to not leak
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
     * @type {String}
     */
    className: PropTypes.string,
    /**
     *
     */
    map: PropTypes.instanceOf(OlMap),
    /**
     *
     */
    measureType: PropTypes.oneOf(['line', 'polygon', 'angle']),
    /**
     *
     */
    measureLayerName: PropTypes.string,
    /**
     *
     */
    fillColor: PropTypes.string,
    /**
     *
     */
    strokeColor: PropTypes.string,
    /**
     *
     */
    showMeasureInfoOnClickedPoints: PropTypes.bool,
    /**
     *
     */
    multipleDrawing: PropTypes.bool,
    /**
     *
     */
    clickToDrawText: PropTypes.string,

    /**
     *
     */
    continuePolygonMsg: PropTypes.string,
    /**
     *
     */
    continueLineMsg: PropTypes.string,
    /**
     *
     */
    continueAngleMsg: PropTypes.string
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    measureLayerName: 'react-geo_measure',
    fillColor: 'blue',
    strokeColor: 'red',
    showMeasureInfoOnClickedPoints: false,
    multipleDrawing: false,
    continuePolygonMsg: 'Click to draw area',
    continueLineMsg: 'Click to draw line',
    continueAngleMsg: 'Click to draw angle',
    clickToDrawText: 'Click to measure'
  }

  /**
   * Create the MeasureButton.
   *
   * @constructs MeasureButton
   */
  constructor(props) {
    super(props);

    this.state = {
      measureLayer: null,
      drawInteraction: null
    };

    this.onToggle = this.onToggle.bind(this);
  }

  /**
   *
   */
  componentWillMount() {
    this.createMeasureLayer();
    this.createDrawInteraction();
  }

  /**
   *
   */
  onToggle() {

  }

  /**
   *
   */
  createMeasureLayer() {
    const {
      measureLayerName,
      fillColor,
      strokeColor
    } = this.props;

    const measureLayer = new OlLayerVector({
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
    this.setState({measureLayer});
  }

  /**
   *
   */
  createDrawInteraction() {
    const {
      fillColor,
      strokeColor,
      measureType,
    } = this.props;

    const maxPoints = measureType === 'angle' ? 2 : undefined;
    const drawInteraction = new OlInteractionDraw({
      name: 'react-geo_drawaction',
      source: this.state.measureVectorLayer.getSource(),
      type: 'MultiLineString',
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

    this.setState({drawInteraction});
  }

  /**
   *
   */
  drawStart = (evt) => {
    const {
      showMeasureInfoOnClickedPoints,
      multipleDrawing,
      measureType,
      map
    } = this.props;

    const source = this.state.measureLayer.getSource();
    this._feature = evt.feature;

    if (showMeasureInfoOnClickedPoints && measureType === 'line') {
      this._eventKeys.click = map.on('click', this.addMeasureStopToolTip, this);
    }

    if (!multipleDrawing && source.getFeatures().length > 0) {
      this.cleanUpToolTips();
      this.createMeasureTooltip();
      this.createHelpTooltip();
      source.clear();
    }
  }

  /**
   * Called whenever measuring stops, this method draws static tooltips with
   * the result onto the map canvas and unregisters various listeners.
   *
   */
  drawEnd = () => {
    const {
      measureType,
      showMeasureInfoOnClickedPoints
    } = this.props;

    if (this._eventKeys.click) {
      OlObservableUnByKey(this._eventKeys.click);
    }

    // Fix doubled label for lastPoint of line
    if (this.showMeasureInfoOnClickedPoints && measureType === 'line') {
      this.removeMeasureTooltip();
    } else {
      this._measureTooltipElement.className = `${CSS.TOOLTIP} ${CSS.TOOLTIP_STATIC}`;
      this._measureTooltip.setOffset([0, -7]);
    }

    // unset sketch
    this._feature = null;

    // Fix doubled label for lastPoint of line
    if (showMeasureInfoOnClickedPoints && measureType === 'line') {
      this._measureTooltipElement = null;
      this.createMeasureTooltip();
    }
  }

  /**
   * Handle pointer move by updating and repositioning the dynamic tooltip.
   *
   * @param {ol.MapBrowserEvent} evt The event from the pointermove.
   */
  pointerMoveHandler = (evt) => {
    const {
      clickToDrawText,
      continuePolygonMsg,
      continueLineMsg,
      continueAngleMsg,
      measureType
    } = this.props;

    if (evt.dragging) {
      return;
    }

    if (!this._helpTooltipElement || !this._measureTooltipElement) {
      return;
    }

    let helpMsg = clickToDrawText;
    const helpTooltipCoord = evt.coordinate;
    let measureTooltipCoord = evt.coordinate;

    if (this._feature) {
      var output;
      var geom = this._feature.getGeometry();
      measureTooltipCoord = geom.getLastCoordinate();
      if (measureType === 'polygon') {
        output = me.formatArea(geom);
        helpMsg = continuePolygonMsg;
        // attach area at interior point
        measureTooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (measureType === 'line') {
        output = me.formatLength(geom);
        helpMsg = continueLineMsg;
        measureTooltipCoord = geom.getLastCoordinate();
      } else if (measureType === 'angle') {
        output = me.formatAngle(geom);
        helpMsg = continueAngleMsg;
      }
      this._measureTooltipElement.innerHTML = output;
      this._measureTooltip.setPosition(measureTooltipCoord);
    }

    this._helpTooltipElement.innerHTML = helpMsg;
    this._helpTooltip.setPosition(helpTooltipCoord);
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
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


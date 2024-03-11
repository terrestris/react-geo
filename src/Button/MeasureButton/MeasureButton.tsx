import './MeasureButton.less';

import MeasureUtil from '@terrestris/ol-util/dist/MeasureUtil/MeasureUtil';
import {
  useMap,
  useOlInteraction,
  useOlLayer
} from '@terrestris/react-util';
import _isNil from 'lodash/isNil';
import OlCollection from 'ol/Collection';
import {
  Coordinate as OlCoordinate
} from 'ol/coordinate';
import OlFeature from 'ol/Feature';
import OlGeomCircle from 'ol/geom/Circle';
import OlGeometry, { Type } from 'ol/geom/Geometry';
import OlGeomLineString from 'ol/geom/LineString';
import OlMultiLineString from 'ol/geom/MultiLineString';
import OlMultiPolygon from 'ol/geom/MultiPolygon';
import OlGeomPolygon from 'ol/geom/Polygon';
import OlInteractionDraw, { DrawEvent } from 'ol/interaction/Draw';
import OlLayerVector from 'ol/layer/Vector';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import { unByKey } from 'ol/Observable';
import OlOverlay from 'ol/Overlay';
import OlSourceVector from 'ol/source/Vector';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleFill from 'ol/style/Fill';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleStyle from 'ol/style/Style';
import React, {
  FC,
  useCallback,
  useEffect,
  useState
} from 'react';

import { CSS_PREFIX } from '../../constants';
import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';

interface OwnProps {
  /**
   * Name of system vector layer which will be used to draw measurement
   * results.
   */
  measureLayerName?: string;
  /**
   * Fill color of the measurement feature.
   */
  fillColor?: string;
  /**
   * Stroke color of the measurement feature.
   */
  strokeColor?: string;
  /**
   * Determines if a marker with current measurement should be shown every
   * time the user clicks while measuring a distance. Default is false.
   */
  showMeasureInfoOnClickedPoints?: boolean;
  /**
   * Determines if a tooltip with helpful information is shown next to the mouse
   * position. Default is true.
   */
  showHelpTooltip?: boolean;
  /**
   * How many decimal places will be allowed for the measure tooltips.
   * Default is 2.
   */
  decimalPlacesInTooltips?: number;
  /**
   * Used to allow / disallow multiple drawings at a time on the map.
   * Default is false.
   * TODO known issue: only label of the last drawn feature will be shown!
   */
  multipleDrawing?: boolean;
  /**
   * Tooltip which will be shown on map mouserover after measurement button
   * was activated.
   */
  clickToDrawText?: string;
  /**
   * Tooltip which will be shown after polygon measurement button was toggled
   * and at least one click in the map is occured.
   */
  continuePolygonMsg?: string;
  /**
   * Tooltip which will be shown after line measurement button was toggled
   * and at least one click in the map is occured.
   */
  continueLineMsg?: string;
  /**
   * Tooltip which will be shown after angle measurement button was toggled
   * and at least one click in the map is occured.
   */
  continueAngleMsg?: string;
  /**
   * CSS classes we'll assign to the popups and tooltips from measuring.
   * Overwrite this object to style the text of the popups / overlays, if you
   * don't want to use default classes.
   */
  measureTooltipCssClasses?: {
    tooltip: string;
    tooltipDynamic: string;
    tooltipStatic: string;
  };
  /**
   * Whether the measure button is pressed.
   */
  pressed?: boolean;
  /**
   * The className which should be added.
   */
  className?: string;
  /**
   * Whether line, area, circle or angle will be measured.
   */
  measureType: MeasureType;
  /**
   * Whether the measure is using geodesic or cartesian mode. Geodesic is used by default.
   */
  geodesic: boolean;
  /**
   * If set true, instead of the area, the radius  will be measured.
   */
  measureRadius?: boolean;
}

export type MeasureType = 'line' | 'polygon' | 'angle' | 'circle';
export type MeasureButtonProps = OwnProps & Partial<ToggleButtonProps>;
export type EventName = 'drawstart' | 'drawend' | 'pointermove' | 'click' | 'change';
export type EventsKeyType = {[K in EventName]: EventsKey | undefined};

const defaulClassName = `${CSS_PREFIX}measurebutton`;

export const MeasureButton: FC<MeasureButtonProps> = ({
  measureType,
  measureLayerName = 'react-geo_measure',
  fillColor = 'rgba(255, 0, 0, 0.5)',
  strokeColor = 'rgba(255, 0, 0, 0.8)',
  showMeasureInfoOnClickedPoints = false,
  showHelpTooltip = true,
  decimalPlacesInTooltips = 2,
  multipleDrawing = false,
  continuePolygonMsg = 'Click to draw area',
  continueLineMsg = 'Click to draw line',
  continueAngleMsg = 'Click to draw angle',
  clickToDrawText = 'Click to measure',
  measureTooltipCssClasses = {
    tooltip: `${CSS_PREFIX}measure-tooltip`,
    tooltipDynamic: `${CSS_PREFIX}measure-tooltip-dynamic`,
    tooltipStatic: `${CSS_PREFIX}measure-tooltip-static`
  },
  pressed = false,
  geodesic = true,
  measureRadius = false,
  className,
  ...passThroughProps
}) => {

  const [feature, setFeature] = useState<OlFeature<OlGeometry>>();
  const [measureTooltip, setMeasureTooltip] = useState<OlOverlay>();
  const [helpTooltip, setHelpTooltip] = useState<OlOverlay>();
  const [stepMeasureTooltips, setStepMeasureTooltips] = useState<OlOverlay[]>([]);

  const map = useMap();

  const measureLayer = useOlLayer(() => new OlLayerVector({
    properties: {
      name: measureLayerName
    },
    source: new OlSourceVector({
      features: new OlCollection<OlFeature<OlGeometry>>()
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
  }), [
    measureLayerName,
    fillColor,
    strokeColor,
    fillColor
  ], pressed);

  const drawInteraction = useOlInteraction(() => {
    const getDrawType = (input: MeasureType): Type => {
      switch (input) {
        case 'line':
        case 'angle':
          return 'MultiLineString';
        case 'polygon':
          return 'MultiPolygon';
        case 'circle':
          return 'Circle';
        default:
          return 'MultiLineString';
      }
    };

    return (
      new OlInteractionDraw({
        source: measureLayer?.getSource() || undefined,
        type: getDrawType(measureType),
        maxPoints: measureType === 'angle' ? 2 : undefined,
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
      })
    );
  }, [measureType, measureLayer, fillColor, strokeColor, fillColor], pressed);

  const removeMeasureTooltip = useCallback(() => {
    if (!map) {
      return;
    }

    if (measureTooltip) {
      map.removeOverlay(measureTooltip);
    }

    setMeasureTooltip(undefined);
  }, [measureTooltip, map]);

  const removeStepMeasureTooltips = useCallback(() => {
    if (!map) {
      return;
    }

    if (stepMeasureTooltips.length > 0) {
      stepMeasureTooltips.forEach(overlay => {
        map.removeOverlay(overlay);
      });

      setStepMeasureTooltips([]);
    }
  }, [stepMeasureTooltips, map]);

  const removeHelpTooltip = useCallback(() => {
    if (!map) {
      return;
    }

    if (helpTooltip) {
      map.removeOverlay(helpTooltip);
    }

    setHelpTooltip(undefined);
  }, [map, helpTooltip]);

  const cleanupTooltips = useCallback(() => {
    removeMeasureTooltip();

    removeStepMeasureTooltips();

    removeHelpTooltip();
  }, [removeMeasureTooltip, removeStepMeasureTooltips, removeHelpTooltip]);

  const createHelpTooltip = useCallback(() => {
    if (!map || helpTooltip) {
      return;
    }

    const tooltip = document.createElement('div');
    tooltip.className = measureTooltipCssClasses?.tooltip ?? '';

    const overlay = new OlOverlay({
      element: tooltip,
      offset: [15, 0],
      positioning: 'center-left'
    });

    setHelpTooltip(overlay);

    map.addOverlay(overlay);
  }, [map, helpTooltip, measureTooltipCssClasses?.tooltip]);

  const createMeasureTooltip = useCallback(() => {
    if (!map || measureTooltip?.getElement()) {
      return;
    }

    const element = document.createElement('div');
    if (measureTooltipCssClasses) {
      element.className = `${measureTooltipCssClasses.tooltip} ${measureTooltipCssClasses.tooltipDynamic}`;
    }

    const overlay = new OlOverlay({
      element: element,
      offset: [0, -15],
      positioning: 'bottom-center'
    });

    setMeasureTooltip(overlay);

    map.addOverlay(overlay);
  }, [map, measureTooltip, measureTooltipCssClasses]);

  const updateMeasureTooltip = useCallback(() => {
    if (!measureTooltip || !feature || !map) {
      return;
    }

    let output;
    let geom = feature.getGeometry();

    if (geom instanceof OlMultiPolygon) {
      geom = geom.getPolygons()[0];
    } else if (geom instanceof OlMultiLineString) {
      geom = geom.getLineStrings()[0];
    }

    let measureTooltipCoord;

    if (geom instanceof OlGeomCircle) {
      if (!measureRadius) {
        output = MeasureUtil.formatArea(geom, map, decimalPlacesInTooltips, geodesic);
      } else {
        const area = MeasureUtil.getAreaOfCircle(geom, map);
        const decimalHelper = Math.pow(10, decimalPlacesInTooltips);
        const radius = Math.round(geom.getRadius() * decimalHelper) / decimalHelper;
        output = `${radius.toString()} m`;
        if (area > (Math.PI * 1000000)) {
          output = (Math.round(geom.getRadius() / 1000 * decimalHelper) /
          decimalHelper) + ' km';
        }
      }
    } else if (geom instanceof OlGeomPolygon) {
      output = MeasureUtil.formatArea(geom, map, decimalPlacesInTooltips, geodesic);
      // attach area at interior point
      measureTooltipCoord = geom.getInteriorPoint().getCoordinates();
    } else if (geom instanceof OlGeomLineString) {
      measureTooltipCoord = geom.getLastCoordinate();
      if (measureType === 'line') {
        output = MeasureUtil.formatLength(geom, map, decimalPlacesInTooltips, geodesic);
      } else if (measureType === 'angle') {
        output = MeasureUtil.formatAngle(geom, 0);
      }
    } else {
      return;
    }

    const el = measureTooltip.getElement();
    if (output && el) {
      el.innerHTML = output;
    }

    measureTooltip.setPosition(measureTooltipCoord);
  }, [decimalPlacesInTooltips, feature, geodesic, map, measureTooltip, measureType, measureRadius]);

  const onDrawStart = useCallback((evt: DrawEvent) => {
    if (!measureLayer || !map) {
      return;
    }

    const source = measureLayer.getSource();

    setFeature(evt.feature);

    const features = source?.getFeatures();

    if (!multipleDrawing && features && features.length > 0) {
      cleanupTooltips();

      source?.clear();
    }
  }, [cleanupTooltips, map, measureLayer, multipleDrawing]);

  const addMeasureStopTooltip = useCallback((coordinate: OlCoordinate) => {
    if (!feature || !map) {
      return;
    }

    let geom = feature.getGeometry();

    if (geom instanceof OlMultiPolygon) {
      geom = geom.getPolygons()[0];
    }

    if (geom instanceof OlMultiLineString) {
      geom = geom.getLineStrings()[0];
    }

    const value = measureType === 'line' ?
      MeasureUtil.formatLength(geom as OlGeomLineString, map, decimalPlacesInTooltips, geodesic) :
      MeasureUtil.formatArea(geom as OlGeomPolygon, map, decimalPlacesInTooltips, geodesic);

    if (parseInt(value, 10) > 0) {
      const div = document.createElement('div');
      if (measureTooltipCssClasses) {
        div.className = `${measureTooltipCssClasses.tooltip} ${measureTooltipCssClasses.tooltipStatic}`;
      }
      div.innerHTML = value;
      const tooltip = new OlOverlay({
        element: div,
        offset: [0, -15],
        positioning: 'bottom-center'
      });
      map.addOverlay(tooltip);

      tooltip.setPosition(coordinate);

      setStepMeasureTooltips([...stepMeasureTooltips, tooltip]);
    }
  }, [stepMeasureTooltips, decimalPlacesInTooltips, feature,
    geodesic, map, measureTooltipCssClasses, measureType]);

  const onDrawEnd = useCallback((evt: DrawEvent) => {
    if (multipleDrawing) {
      addMeasureStopTooltip((evt.feature.getGeometry() as OlMultiPolygon|OlMultiLineString).getLastCoordinate());
    }

    // TODO Recheck this
    // Fix doubled label for lastPoint of line
    if (
      (multipleDrawing || showMeasureInfoOnClickedPoints) &&
      (measureType === 'line' || measureType === 'polygon')
    ) {
      removeMeasureTooltip();
    } else {
      const el = measureTooltip?.getElement();
      if (el && measureTooltipCssClasses) {
        el.className = `${measureTooltipCssClasses.tooltip} ${measureTooltipCssClasses.tooltipStatic}`;
      }
      measureTooltip?.setOffset([0, -7]);
    }

    updateMeasureTooltip();

    // unset sketch
    setFeature(undefined);

    // fix doubled label for last point of line
    if (
      (multipleDrawing || showMeasureInfoOnClickedPoints) &&
      (measureType === 'line' || measureType === 'polygon')
    ) {
      measureTooltip?.setElement(undefined);
      createMeasureTooltip();
    }
  }, [addMeasureStopTooltip, createMeasureTooltip, measureTooltip, measureTooltipCssClasses,
    measureType, multipleDrawing, removeMeasureTooltip, showMeasureInfoOnClickedPoints, updateMeasureTooltip]);

  const updateHelpTooltip = useCallback((coordinate: OlCoordinate) => {
    if (!helpTooltip) {
      return;
    }

    const helpTooltipElement = helpTooltip?.getElement();

    if (!helpTooltipElement) {
      return;
    }

    let msg = clickToDrawText;

    if (measureType === 'polygon') {
      msg = continuePolygonMsg;
    } else if (measureType === 'line') {
      msg = continueLineMsg;
    } else if (measureType === 'angle') {
      msg = continueAngleMsg;
    }

    helpTooltipElement.innerHTML = msg ?? '';
    helpTooltip.setPosition(coordinate);
  }, [clickToDrawText, continueAngleMsg, continueLineMsg, continuePolygonMsg, helpTooltip, measureType]);

  const onMapPointerMove = useCallback((evt: any) => {
    if (!evt.dragging && pressed) {
      updateHelpTooltip(evt.coordinate);
    }
  }, [updateHelpTooltip, pressed]);

  const onMapClick = useCallback((evt: OlMapBrowserEvent<MouseEvent>) => {
    if (showMeasureInfoOnClickedPoints && measureType === 'line') {
      addMeasureStopTooltip(evt.coordinate);
    }
  }, [addMeasureStopTooltip, measureType, showMeasureInfoOnClickedPoints]);

  useEffect(() => {
    const onDrawStartKey = drawInteraction?.on('drawstart', onDrawStart);

    const onDrawEndKey = drawInteraction?.on('drawend', onDrawEnd);

    const onMapPointerMoveKey = map?.on('pointermove', onMapPointerMove);

    const onMapClickKey = map?.on('click', onMapClick);

    return () => {
      if (!_isNil(onDrawStartKey)) {
        unByKey(onDrawStartKey);
      }
      if (!_isNil(onDrawEndKey)) {
        unByKey(onDrawEndKey);
      }
      if (onMapPointerMoveKey) {
        unByKey(onMapPointerMoveKey);
      }
      if (onMapClickKey) {
        unByKey(onMapClickKey);
      }
    };
  }, [drawInteraction, map, onDrawEnd, onDrawStart, onMapClick, onMapPointerMove]);

  useEffect(() => {
    createMeasureTooltip();

    if (showHelpTooltip) {
      createHelpTooltip();
    }
  }, [createHelpTooltip, createMeasureTooltip, showHelpTooltip]);

  useEffect(() => {
    if (!pressed) {
      measureLayer?.getSource()?.clear();

      cleanupTooltips();
    }
  }, [pressed, measureLayer, cleanupTooltips]);

  useEffect(() => {
    if (!feature) {
      return;
    }

    const onFeatureChangeKey = feature.getGeometry()?.on('change', updateMeasureTooltip);

    return () => {
      if (onFeatureChangeKey) {
        unByKey(onFeatureChangeKey);
      }
    };
  }, [feature, updateMeasureTooltip]);

  const finalClassName = className
    ? `${className} ${defaulClassName}`
    : defaulClassName;

  return (
    <ToggleButton
      pressed={pressed}
      className={finalClassName}
      {...passThroughProps}
    />
  );
};

export default MeasureButton;

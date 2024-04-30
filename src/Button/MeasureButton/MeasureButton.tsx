import './MeasureButton.less';

import useMeasure from '@terrestris/react-util/dist/Hooks/useMeasure/useMeasure';
import _isNil from 'lodash/isNil';
import React, { FC } from 'react';

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
  geodesic?: boolean;
  /**
   * If set true, instead of the area, the radius  will be measured.
   */
  measureRadius?: boolean;
}

export type MeasureType = 'line' | 'polygon' | 'angle' | 'circle';
export type MeasureButtonProps = OwnProps & Partial<ToggleButtonProps>;

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

  useMeasure({
    active: !!pressed,
    measureType,
    measureLayerName,
    fillColor,
    strokeColor,
    showMeasureInfoOnClickedPoints,
    showHelpTooltip,
    decimalPlacesInTooltips,
    multipleDrawing,
    continuePolygonMsg,
    continueLineMsg,
    continueAngleMsg,
    clickToDrawText,
    measureTooltipCssClasses,
    geodesic,
    measureRadius
  });

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

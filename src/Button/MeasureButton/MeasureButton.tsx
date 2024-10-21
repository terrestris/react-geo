import './MeasureButton.less';

import React, { FC } from 'react';

import useMeasure, { UseMeasureProps } from '@terrestris/react-util/dist/Hooks/useMeasure/useMeasure';

import { CSS_PREFIX } from '../../constants';
import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';

interface OwnProps {
  /**
   * Whether the measure button is pressed or not.
   */
  pressed?: boolean;
}

export type MeasureButtonProps = OwnProps & Partial<Omit<UseMeasureProps, 'active'>> & Partial<ToggleButtonProps>;

const defaultClassName = `${CSS_PREFIX}measurebutton`;

export const MeasureButton: FC<MeasureButtonProps> = ({
  measureType = 'line',
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
    active: pressed,
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
    ? `${className} ${defaultClassName}`
    : defaultClassName;

  return (
    <ToggleButton
      pressed={pressed}
      className={finalClassName}
      {...passThroughProps}
    />
  );
};

export default MeasureButton;

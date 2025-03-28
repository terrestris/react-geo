import React from 'react';

import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DragRotateAndZoom } from 'ol/interaction.js';

import useOlInteraction from '@terrestris/react-util/dist/Hooks/useOlInteraction/useOlInteraction';

import ToggleButton, {
  ToggleButtonProps
} from '../ToggleButton/ToggleButton';

export type RotationButtonProps =  Partial<ToggleButtonProps>;

export const RotationButton: React.FC<RotationButtonProps> = ({
  pressed = false,
  tooltip = 'Shift + Drag to rotate and zoom the map around its center',
  pressedIcon = <FontAwesomeIcon icon={faArrowsRotate} />,
  tooltipProps,
  ...passThroughProps}
) => {

  useOlInteraction(() => {
    return (
      new DragRotateAndZoom()
    );
  }, [], pressed);

  return (
    <ToggleButton
      tooltip={tooltip}
      icon={<FontAwesomeIcon icon={faArrowsRotate} />}
      pressedIcon={pressedIcon}
      pressed={pressed}
      tooltipProps={tooltipProps}
      {...passThroughProps}
    />
  );
};

export default RotationButton;

import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOlInteraction } from '@terrestris/react-util/';
import { DragRotateAndZoom } from 'ol/interaction.js';
import React from 'react';

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
      pressedIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
      pressed={pressed}
      tooltipProps={tooltipProps}
      {...passThroughProps}
    />
  );
};
export default RotationButton;

import React from 'react';

import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DragRotateAndZoom } from 'ol/interaction.js';

import { useMap } from '../../Hook/useMap';
import ToggleButton, {
  ToggleButtonProps
} from '../ToggleButton/ToggleButton';

export type RotationButtonProps =  Partial<ToggleButtonProps>;

export const RotationButton: React.FC<RotationButtonProps> = ({
  tooltip = 'Shift + Drag to rotate and zoom the map around its center',
  pressedIcon = <FontAwesomeIcon icon={faArrowsRotate} />,
  tooltipProps,
  ...passThroughProps}
) => {
  const map = useMap();

  if (!map) {
    return <></>;
  }
  let action = new DragRotateAndZoom();
  const onToggle = (pressed: boolean) => {
    if (pressed) {
      map.addInteraction(action);
    } else {
      map.removeInteraction(action);
    }
  };

  return (
    <ToggleButton
      tooltip={tooltip}
      icon={<FontAwesomeIcon icon={faArrowsRotate} />}
      pressedIcon={<FontAwesomeIcon icon={faArrowsRotate} />}
      onToggle={onToggle}
      tooltipProps={tooltipProps}
      {...passThroughProps}
    />
  );
};
export default RotationButton;

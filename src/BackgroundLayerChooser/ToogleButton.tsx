import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SimpleButton from '../Button/SimpleButton/SimpleButton';

type ToggleButtonProps = {
  layerOptionsVisible: boolean;
  setLayerOptionsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  buttonTooltip: string;
  onClick: () => void;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
  layerOptionsVisible,
  setLayerOptionsVisible,
  buttonTooltip,
  onClick,
}) => {
  return (
    <SimpleButton
      className={`change-bg-btn${layerOptionsVisible ? ' toggled' : ''}`}
      size="small"
      tooltip={buttonTooltip}
      icon={
        layerOptionsVisible ? (
          <FontAwesomeIcon icon={faChevronRight} />
        ) : (
          <FontAwesomeIcon icon={faChevronLeft} />
        )
      }
      onClick={onClick}
    />
  );
};

export default ToggleButton;
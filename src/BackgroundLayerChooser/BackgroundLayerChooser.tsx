import './BackgroundLayerChooser.less';

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BackgroudLayerChooserBase, {
  BackgroundLayerButtonProps
} from '@terrestris/react-util/dist/BackgroundLayerChooser/BackgroundLayerChooser';
import {
  BackgroundLayerLoadingMaskProps
} from '@terrestris/react-util/dist/BackgroundLayerPreview/BackgroundLayerPreview';
import Spin from 'antd/lib/spin';
import OlLayerBase from 'ol/layer/Base';
import OlLayer from 'ol/layer/Layer';
import React from 'react';

import SimpleButton from '../Button/SimpleButton/SimpleButton';

export type BackgroundLayerChooserProps = {
  layers: OlLayer[];
  tooltip?: string;
  backgroundLayerFilter?: (layer: OlLayerBase) => boolean;
};

const SwitcherButton: React.FC<BackgroundLayerButtonProps> = ({
  layerOptionsVisible,
  onClick,
  buttonTooltip
}) => {
  return (
    <SimpleButton
      className={`change-bg-btn${layerOptionsVisible ? ' toggled' : ''}`}
      size="small"
      tooltip={buttonTooltip}
      icon={layerOptionsVisible ?
        <FontAwesomeIcon
          icon={faChevronRight}
        /> :
        <FontAwesomeIcon
          icon={faChevronLeft}
        />
      }
      onClick={onClick}
    />
  );
};

const LoadingMask: React.FC<BackgroundLayerLoadingMaskProps> = ({
  loading,
  children
}) => {
  return (
    <Spin spinning={loading}>
      {children}
    </Spin>
  );
};

export const BackgroundLayerChooser: React.FC<BackgroundLayerChooserProps> = ({
  tooltip,
  layers,
  backgroundLayerFilter
}) => {

  return (
    <BackgroudLayerChooserBase
      layers={layers}
      backgroundLayerFilter={backgroundLayerFilter}
      Button={SwitcherButton}
      buttonTooltip={tooltip}
      LoadingMask={LoadingMask}
    />
  );
};

export default BackgroundLayerChooser;

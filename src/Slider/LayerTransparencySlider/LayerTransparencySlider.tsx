import * as React from 'react';

import { Slider } from 'antd';
import { SliderSingleProps } from 'antd/lib/slider';
import OlLayerBase from 'ol/layer/Base';

export interface OwnProps {
  /**
   * The layer to handle.
   */
  layer: OlLayerBase;
}

export type LayerTransparencySliderProps = OwnProps & SliderSingleProps;

const LayerTransparencySlider: React.FC<LayerTransparencySliderProps> = ({
  layer,
  ...passThroughProps
}) => {

  const setLayerTransparency = (transparency: number) => {
    let opacity = 1 - (transparency / 100);
    // Round the opacity to two digits.
    opacity = Math.round((opacity) * 100) / 100;
    layer.setOpacity(opacity);
  };

  const getLayerTransparency = () => {
    // 1 = fully opaque/visible.
    const opacity = layer.getOpacity();
    let transparency = (1 - opacity) * 100;
    // Remove any digits.
    transparency = Math.round(transparency);
    return transparency;
  };

  return (
    <Slider
      tooltip={{
        formatter: value => `${value}%`
      }}
      defaultValue={getLayerTransparency()}
      onChange={(value: number) => {
        setLayerTransparency(value);
      }}
      {...passThroughProps}
    />
  );
};

export default LayerTransparencySlider;

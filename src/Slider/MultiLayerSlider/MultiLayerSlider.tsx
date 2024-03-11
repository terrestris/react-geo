import { ArrayTwoOrMore } from '@terrestris/base-util/dist/types';
import { Slider } from 'antd';
import { SliderSingleProps } from 'antd/lib/slider';
import _isNumber from 'lodash/isNumber';
import OlLayerBase from 'ol/layer/Base';
import React, {
  useEffect
} from 'react';

import { CSS_PREFIX } from '../../constants';

export type OwnProps = {
  /**
   * The default value(s).
   */
  defaultValue?: number;
  /**
   * layer property that will define the name shown on the lables. Defaults to 'name'.
   */
  nameProperty?: string;
  /**
   * The layers that should be handled.
   */
  layers: ArrayTwoOrMore<OlLayerBase>;
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
};

export type MultiLayerSliderProps = OwnProps & SliderSingleProps;

const defaultClassName = `${CSS_PREFIX}multilayerslider`;

const MultiLayerSlider: React.FC<MultiLayerSliderProps> = ({
  layers,
  defaultValue = 0,
  nameProperty = 'name',
  className,
  ...passThroughProps
}) => {

  useEffect(() => {
    layers.forEach(l => l.setOpacity(0));
    layers[0].setOpacity(1);
  }, [layers]);

  const formatTip = (val?: number) => {
    if (!_isNumber(val)) {
      return '';
    }
    const layerIdx = getLayerIndexForSliderValue(val);
    let tip: string = '';
    if (layers[layerIdx]) {
      const opacity = Math.round(layers[layerIdx].get('opacity') * 100);
      const layer = layers[layerIdx];
      const layername = (nameProperty ? layer.get(nameProperty) : undefined) ?? `Layer ${layerIdx + 1}`;
      tip = `${layername} ${opacity}%`;
    }
    return tip;
  };

  const valueUpdated = (val: number) => {
    const layerIdx = getLayerIndexForSliderValue(val);
    const opacity = getOpacityForValue(val);

    // set all opacities to 0 first
    layers.forEach(l => l.setOpacity(0));
    if (layers[layerIdx]) {
      layers[layerIdx].setOpacity(1 - opacity);
    }
    if (layers[layerIdx - 1] && opacity > 0.5) {
      layers[layerIdx - 1].setOpacity(opacity - 0.5);
    }
    if (layers[layerIdx + 1]) {
      layers[layerIdx + 1].setOpacity(opacity);
    }
  };

  const getOpacityForValue = (val: number) => {
    const length = layers.length - 1;
    const ticksPerLayer = Math.round(100 / length);
    const idx = Math.floor(val / ticksPerLayer);
    const opacity = val / ticksPerLayer - (idx > length ? length : idx);
    return opacity > 1 ? 1 : opacity;
  };

  const getLayerIndexForSliderValue = (val: number) => {
    const length = layers.length - 1;
    const ticksPerLayer = Math.round(100 / length);
    const idx = Math.floor(val / ticksPerLayer);
    return idx > length ? length : idx;
  };

  const getMarks = () => {
    const marks: {[index: number]: any} = {};
    const length = layers.length - 1;
    layers.forEach((layer, index) => {
      const layername = (nameProperty ? layer.get(nameProperty) : undefined) ?? `Layer ${index + 1}`;
      const idx = Math.round(100 / length * index);
      marks[idx] = layername;
    });
    return marks;
  };

  const finalClassName = className
    ? `${className} ${defaultClassName}`
    : defaultClassName;

  return (
    <Slider
      className={finalClassName}
      marks={getMarks()}
      defaultValue={defaultValue}
      min={0}
      max={100}
      tooltip={{
        formatter: formatTip
      }}
      onChange={valueUpdated}
      {...passThroughProps}
    />
  );
};

export default MultiLayerSlider;

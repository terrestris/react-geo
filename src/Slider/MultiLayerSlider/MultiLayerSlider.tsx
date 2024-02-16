import { ArrayTwoOrMore } from '@terrestris/base-util/dist/types';
import { Slider } from 'antd';
import { SliderSingleProps } from 'antd/lib/slider';
import _isNumber from 'lodash/isNumber';
import OlLayerBase from 'ol/layer/Base';
import * as React from 'react';

import { CSS_PREFIX } from '../../constants';

interface DefaultProps {
  /**
   * The default value(s).
   */
  defaultValue: number;
  /**
   * layer property that will define the name shown on the lables. Defaults to 'name'.
   */
  nameProperty: string;
}

/**
 *
 * @export
 * @interface TimeSliderProps
 */
export interface BaseProps {
  /**
   * The layers that should be handled.
   *
   */
  layers: ArrayTwoOrMore<OlLayerBase>;
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
}

export type MultiLayerSliderProps = BaseProps & Partial<DefaultProps> & SliderSingleProps;

/**
 * Slider that changes opacity on a set of layers.
 *
 * @class The MultiLayerSlider
 * @extends React.Component
 */
class MultiLayerSlider extends React.Component<MultiLayerSliderProps> {

  static defaultProps: DefaultProps = {
    defaultValue: 0,
    nameProperty: 'name'
  };

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}multilayerslider`;

  /**
   * The constructor.
   *
   * @constructs MultiLayerSlider
   * @param props The properties.
   */
  constructor(props: MultiLayerSliderProps) {
    super(props);
    const {
      layers
    } = props;
    layers.forEach(l => l.setOpacity(0));
    layers[0].setOpacity(1);
  }

  /**
   * Formats the tip for the slider.
   * @param value The slider value
   * @return The formatted tip value
   */
  formatTip(value?: number) {
    if (!_isNumber(value)) {
      return '';
    }
    const {
      layers,
      nameProperty
    } = this.props;
    const layerIdx = this.getLayerIndexForSliderValue(value);
    let tip: string = '';
    if (layers[layerIdx]) {
      const opacity = Math.round(layers[layerIdx].get('opacity') * 100);
      const layer = layers[layerIdx];
      const layername = (nameProperty ? layer.get(nameProperty) : undefined) ?? `Layer ${layerIdx + 1}`;
      tip = `${layername} ${opacity}%`;
    }
    return tip;
  }

  /**
   * Called when the value of the slider changed.
   */
  valueUpdated(value: number) {
    const layerIdx = this.getLayerIndexForSliderValue(value);
    const opacity = this.getOpacityForValue(value);
    const layers = this.props.layers;
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
  }

  /**
   * Gets the opacity for a given slider value
   * @param value The current slider value
   * @return The opacity
   */
  getOpacityForValue(value: number) {
    const {
      layers
    } = this.props;
    const length = layers.length - 1;
    const ticksPerLayer = Math.round(100 / length);
    const idx = Math.floor(value / ticksPerLayer);
    const opacity = value / ticksPerLayer - (idx > length ? length : idx);
    return opacity > 1 ? 1 : opacity;
  }

  /**
   * Gets the matching index of the layer array for a given slider value
   * @param value the current slider value
   * @return The layer array index
   */
  getLayerIndexForSliderValue(value: number) {
    const {
      layers
    } = this.props;
    const length = layers.length - 1;
    const ticksPerLayer = Math.round(100 / length);
    const idx = Math.floor(value / ticksPerLayer);
    return idx > length ? length : idx;
  }

  /**
   * Creates the marks used with the slider based on the layers names.
   * @return The marks object
   */
  getMarks() {
    const marks: {[index: number]: any} = {};
    const {
      layers,
      nameProperty
    } = this.props;
    const length = layers.length - 1;
    layers.forEach((layer, index) => {
      const layername = (nameProperty ? layer.get(nameProperty) : undefined) ?? `Layer ${index + 1}`;
      const idx = Math.round(100 / length * index);
      marks[idx] = layername;
    });
    return marks;
  }

  /**
   * The render function.
   */
  render() {
    const {
      layers,
      defaultValue,
      className,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <Slider
        className={finalClassName}
        marks={this.getMarks()}
        defaultValue={defaultValue}
        min={0}
        max={100}
        tooltip={{
          formatter: this.formatTip.bind(this)
        }}
        onChange={this.valueUpdated.bind(this)}
        {...passThroughProps}
      />
    );
  }
}

export default MultiLayerSlider;

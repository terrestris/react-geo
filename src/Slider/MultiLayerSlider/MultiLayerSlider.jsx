import React from 'react';
import PropTypes from 'prop-types';
import OlLayerBase from 'ol/layer/Base';
import { Slider } from 'antd';

import { CSS_PREFIX } from '../../constants';

/**
 * Slider that changes opacity on a set of layers.
 *
 * @class The MultiLayerSlider
 * @extends React.Component
 */
class MultiLayerSlider extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}multilayerslider`;

  static propTypes = {
    /**
     * An optional CSS class which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * The layers that should be handled. Default is: `[]`.
     *
     * @type {Array}
     */
    layers: PropTypes.arrayOf(PropTypes.instanceOf(OlLayerBase)).isRequired,

    /**
     * The default value(s). Default is `0`
     * @type {Array<String> | String}
     */
    defaultValue: PropTypes.any
  }

  static defaultProps = {
    layers: [],
    defaultValue: 0
  }

  /**
   * The constructor.
   *
   * @constructs MultiLayerSlider
   * @param {Object} props The properties.
   */
  constructor(props) {
    super(props);
    const layers = this.props.layers;
    layers.forEach(l => l.setOpacity(0));
    layers[0].setOpacity(1);
  }

  /**
   * Formats the tip for the slider.
   * @param  {Number} value the slider value
   * @return {String}      the formatted tip value
   */
  formatTip(value) {
    const layerIdx = this.getLayerIndexForSliderValue(value);
    const layers = this.props.layers;
    let tip;
    if (layers[layerIdx]) {
      const opacity = Math.round(layers[layerIdx].get('opacity') * 100);
      const layer = layers[layerIdx];
      const layername = layer.get('name') || layer.get('title');
      tip = `${layername} ${opacity}%`;
    }
    return tip;
  }

  /**
   * Called when the value of the slider changed.
   * @param  {Number} value the new value
   */
  valueUpdated(value) {
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
   * @param  {Number} value The current slider value
   * @return {Number} The opacity
   */
  getOpacityForValue(value) {
    const length = this.props.layers.length - 1;
    const ticksPerLayer = Math.round(100 / length);
    const idx = parseInt(value / ticksPerLayer, 10);
    const opacity = value / ticksPerLayer - (idx > length ? length : idx);
    return opacity > 1 ? 1 : opacity;
  }

  /**
   * Gets the matching index of the layer array for a given slider value
   * @param  {Number} value the current slider value
   * @return {Number} The layer array index
   */
  getLayerIndexForSliderValue(value) {
    const length = this.props.layers.length - 1;
    const ticksPerLayer = Math.round(100 / length);
    const idx = parseInt(value / ticksPerLayer, 10);
    return idx > length ? length : idx;
  }

  /**
   * Creates the marks used with the slider based on the layers names.
   * @return {Object} The marks object
   */
  getMarks() {
    const marks = {};
    const layers = this.props.layers;
    const length = layers.length - 1;
    layers.forEach(function(l, i) {
      const layername = l.get('name') || l.get('title') || 'Layer ' + i + 1;
      const idx = Math.round(100 / length * i);
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
        tipFormatter={this.formatTip.bind(this)}
        onChange={this.valueUpdated.bind(this)}
        {...passThroughProps}
      />
    );
  }
}

export default MultiLayerSlider;

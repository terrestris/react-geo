import React from 'react';
import PropTypes from 'prop-types';
import {
  Slider
} from 'antd';

/**
 * Slider that changes opacity on a set of layers.
 *
 * @class The MultiLayerSlider
 * @extends React.Component
 */
class MultiLayerSlider extends React.Component {

  static propTypes = {

    /**
     * The layers that should be handled.
     * @type {Array}
     */
    layers: PropTypes.array.isRequired,

    /**
     * The default value(s).
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
    this.props.layers.forEach(l => l.setOpacity(0));
    this.props.layers[0].setOpacity(1);
  }

  /**
   * Formats the tip for the slider.
   * @param  {Number} value the slider value
   * @return {String}      the formatted tip value
   */
  formatTip(value) {
    let layerIdx = this.getLayerIndexForSliderValue(value);
    let tip;
    if (this.props.layers[layerIdx]) {
      let opacity = Math.round(this.props.layers[layerIdx].get('opacity') * 100);
      let l = this.props.layers[layerIdx];
      let layername = l.get('name') || l.get('title');
      tip = layername + ' ' + opacity + '%';
      // if (this.props.layers[layerIdx + 1]) {
      //   let layerRight = this.props.layers[layerIdx + 1].get('name');
      //   tip += ' &#10; ';
      //   tip += layerRight + ' ' + Math.abs(opacity - 100) + '%';
      // }

      // tip = opacity + ' | ' + Math.abs(opacity - 100);
    }
    return tip;
  }

  /**
   * Called when the value of the slider changed.
   * @param  {Number} value the new value
   */
  valueUpdated(value) {
    let layerIdx = this.getLayerIndexForSliderValue(value);
    let opacity = this.getOpacityForValue(value);
    // set all opacities to 0 first
    this.props.layers.forEach(l => l.setOpacity(0));
    if (this.props.layers[layerIdx]) {
      this.props.layers[layerIdx].setOpacity(1 - opacity);
    }
    if (this.props.layers[layerIdx - 1] && opacity > 0.5) {
      this.props.layers[layerIdx - 1].setOpacity(opacity - 0.5);
    }
    if (this.props.layers[layerIdx + 1]) {
      this.props.layers[layerIdx + 1].setOpacity(opacity);
    }
  }

  /**
   * Gets the opacity for a given slider value
   * @param  {Number} value The current slider value
   * @return {Number} The opacity
   */
  getOpacityForValue(value) {
    let length = this.props.layers.length - 1;
    let ticksPerLayer = Math.round(100 / length);
    let idx = parseInt(value / ticksPerLayer, 10);
    let opacity = value / ticksPerLayer - (idx > length ? length : idx);
    return opacity > 1 ? 1 : opacity;
  }

  /**
   * Gets the matching index of the layer array for a given slider value
   * @param  {Number} value the current slider value
   * @return {Number} The layer array index
   */
  getLayerIndexForSliderValue(value) {
    let length = this.props.layers.length - 1;
    let ticksPerLayer = Math.round(100 / length);
    let idx = parseInt(value / ticksPerLayer, 10);
    return idx > length ? length : idx;
  }

  /**
   * Creates the marks used with the slider based on the layers names.
   * @return {Object} The marks object
   */
  getMarks() {
    let marks = {};
    let length = this.props.layers.length - 1;
    this.props.layers.forEach(function(l, i) {
      let layername = l.get('name') || l.get('title') || 'Layer ' + i + 1;
      let idx = Math.round(100 / length * i);
      marks[idx] = layername;
    });
    return marks;
  }

  /**
   * The render function.
   */
  render() {
    return (
      <div>
        <Slider
          marks={this.getMarks()}
          defaultValue={this.props.defaultValue}
          min={0}
          max={100}
          tipFormatter={this.formatTip.bind(this)}
          onChange={this.valueUpdated.bind(this)}
        />
      </div>
    );
  }
}

export default MultiLayerSlider;

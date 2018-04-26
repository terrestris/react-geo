import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'antd';
import OlLayerBase from 'ol/layer/Base';

/**
 * The LayerTransparencySlider.
 *
 * @class The LayerTransparencySlider
 * @extends React.Component
 */
class LayerTransparencySlider extends React.Component {

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * The layer to handle.
     * @type {ol.layer.Base}
     */
    layer: PropTypes.instanceOf(OlLayerBase).isRequired
  };

  /**
   * Create the LayerTransparencySlider.
   *
   * @constructs LayerTransparencySlider
   */
  constructor(props) {
    super(props);
  }

  /**
   * Sets the transparency to the provided layer.
   *
   * @param {Number} transparency The transparency to set, provide a value
   *                              between 0 (fully visible) and 100 (fully
   *                              transparent).
   */
  setLayerTransparency(transparency) {
    let opacity = 1 - (transparency / 100);
    // Round the opacity to two digits.
    opacity = Math.round((opacity) * 100) / 100;
    this.props.layer.setOpacity(opacity);
  }

  /**
   * Returns the transparency from the provided layer.
   *
   * @return {Number} The transparency of the layer.
   */
  getLayerTransparency() {
    // 1 = fully opaque/visible.
    let opacity = this.props.layer.getOpacity();
    let transparency = (1 - opacity) * 100;
    // Remove any digits.
    transparency = Math.round(transparency);
    return transparency;
  }

  /**
   * The render function.
   */
  render() {
    const {
      layer,
      ...passThroughProps
    } = this.props;

    return (
      <Slider
        tipFormatter={value => `${value}%`}
        defaultValue={this.getLayerTransparency()}
        onChange={(value) => {
          this.setLayerTransparency(value);
        }}
        {...passThroughProps}
      />
    );
  }
}

export default LayerTransparencySlider;

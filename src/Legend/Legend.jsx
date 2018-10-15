import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';

import Logger from '@terrestris/base-util/src/Logger';
import MapUtil from '@terrestris/ol-util/src/MapUtil/MapUtil';

import { CSS_PREFIX } from '../constants';

/**
 * Class representing the Legend.
 *
 * @class Legend
 * @extends React.Component
 */
export class Legend extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}legend`

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * An optional CSS class which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * The layer you want to display the legend of.
     * @type {ol.layer.Layer}
     */
    layer: PropTypes.object.isRequired,

    /**
     * An object containing additional request params like "{HEIGHT: 400}" will
     * be transformed to "&HEIGHT=400" an added to the GetLegendGraphic request.
     * @type {Object}
     */
    extraParams: PropTypes.object
  }

  /**
   * Create the Legend.
   *
   * @constructs Legend
   */
  constructor(props) {
    super(props);

    const layer = props.layer;
    const extraParams = props.extraParams;

    this.state = {
      legendUrl: this.getLegendUrl(layer, extraParams)
    };
  }

  /**
   * Invoked immediately after updating occurs. This method is not called for
   * the initial render.
   *
   * @param {Object} prevProps The previous props.
   */
  componentDidUpdate(prevProps) {
    const {
      extraParams,
      layer
    } = this.props;

    if (extraParams && !(isEqual(extraParams, prevProps.extraParams))) {
      this.setState({
        legendUrl: this.getLegendUrl(layer, extraParams)
      });
    }
  }

  /**
   * Get the corresponding legendGraphic of a layer. If layer is configured with
   * "legendUrl" this will be used. Otherwise a getLegendGraphic requestString
   * will be created by the MapUtil.
   *
   * @param {ol.Layer} layer The layer to get the legend graphic request for.
   * @param {Object} extraParams The extra params.
   */
  getLegendUrl(layer, extraParams) {
    let legendUrl;

    if (layer.get('legendUrl')) {
      legendUrl = layer.get('legendUrl');
    } else {
      legendUrl = MapUtil.getLegendGraphicUrl(layer, extraParams);
    }

    return legendUrl;
  }

  /**
   * onError handler for the rendered img.
   */
  onError() {
    Logger.warn(`Image error for legend of "${this.props.layer.get('name')}".`);
  }

  /**
   * The render function.
   */
  render() {
    let {
      className,
      layer,
      extraParams,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    const alt = layer.get('name')
      ? layer.get('name') + ' legend'
      : 'layer legend';

    return (
      <div
        className={finalClassName}
        {...passThroughProps}
      >
        <img
          src={this.state.legendUrl}
          alt={alt}
          onError={this.onError.bind(this)}
        />
      </div>
    );
  }
}

export default Legend;

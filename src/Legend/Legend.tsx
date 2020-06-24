import * as React from 'react';

const _isEqual = require('lodash/isEqual');

import Logger from '@terrestris/base-util/dist/Logger';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import OlLayer from 'ol/layer/Layer';

import { CSS_PREFIX } from '../constants';

export interface BaseProps {
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * The layer you want to display the legend of.
   */
  layer: OlLayer;
  /**
   * An object containing additional request params like "{HEIGHT: 400}" will
   * be transformed to "&HEIGHT=400" an added to the GetLegendGraphic request.
   */
  extraParams?: any;
}

interface LegendState {
  /**
   * The legend url.
   */
  legendUrl: string;
}

export type LegendProps = BaseProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * Class representing the Legend.
 *
 * @class Legend
 * @extends React.Component
 */
export class Legend extends React.Component<LegendProps, LegendState> {

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}legend`;

  /**
   * Create the Legend.
   *
   * @constructs Legend
   */
  constructor(props: LegendProps) {
    super(props);
    const {
      layer,
      extraParams
    } = props;

    this.state = {
      legendUrl: this.getLegendUrl(layer, extraParams)
    };
  }

  /**
   * Invoked immediately after updating occurs. This method is not called for
   * the initial render.
   *
   * @param prevProps The previous props.
   */
  componentDidUpdate(prevProps: LegendProps) {
    const {
      extraParams,
      layer
    } = this.props;

    if (extraParams && !(_isEqual(extraParams, prevProps.extraParams))) {
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
   * @param layer The layer to get the legend graphic request for.
   * @param extraParams The extra params.
   */
  getLegendUrl(layer: OlLayer, extraParams: any) {
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
    const {
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

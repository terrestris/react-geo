import * as React from 'react';

import { Spin } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';

import _isEqual from 'lodash/isEqual';

import OlLayerImage from 'ol/layer/Image';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceTileWMS from 'ol/source/TileWMS';

import Logger from '@terrestris/base-util/dist/Logger';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import { CSS_PREFIX } from '../constants';

export interface BaseProps {
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * The layer you want to display the legend of.
   */
  layer: OlLayerTile<OlSourceTileWMS> | OlLayerImage<OlSourceImageWMS>;
  /**
   * An object containing additional request params like "{HEIGHT: 400}" will
   * be transformed to "&HEIGHT=400" an added to the GetLegendGraphic request.
   */
  extraParams?: any;
  /**
   * Optional method that should be called when the image retrieval errors
   */
  onError?: (e: any) => void;
  /**
   * Optional error message that should be displayed when image retrieval
   * errors. Will remove the browsers default broken image
   */
  errorMsg?: string;
  /**
   * Additional headers to apply for the img request.
   */
  headers?: HeadersInit;
}

interface LegendState {
  /**
   * The current loading state of the legend image.
   */
  loading: boolean;
  /**
   * The base64 encoded image for the legend.
   */
  imgSrc: string;
  /**
   * The legend url.
   */
  legendUrl: string;
  /**
   * Flag indicating if loading of the image source lead to an error
   */
  legendError: boolean;
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
      // A transparent 1 x 1 px image
      // eslint-disable-next-line max-len
      imgSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      legendUrl: this.getLegendUrl(layer, extraParams),
      legendError: false,
      loading: false
    };
  }

  componentDidMount() {
    this.setLegendSrc();
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
      }, this.setLegendSrc);
    }
  }

  async setLegendSrc() {
    const {
      headers
    } = this.props;

    try {
      this.setState({
        loading: true
      });

      const response = await fetch(this.state.legendUrl, {
        headers
      });

      if (!response.ok) {
        throw new Error('No successful response returned while getting the legend graphic');
      }

      if (this.state.imgSrc) {
        URL.revokeObjectURL(this.state.imgSrc);
      }

      this.setState({
        imgSrc: URL.createObjectURL(await response.blob())
      });
    } catch (error) {
      Logger.error('Error while setting the img src: ', error);

      this.onError(error);
    } finally {
      this.setState({
        loading: false
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
  getLegendUrl(layer: OlLayerTile<OlSourceTileWMS> | OlLayerImage<OlSourceImageWMS>, extraParams: any) {
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
  onError(e: any) {
    Logger.warn(`Image error for legend of "${this.props.layer.get('name')}".`);
    this.setState({
      legendError: true
    });
    if (this.props.onError) {
      this.props.onError(e);
    }
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      layer,
      extraParams,
      errorMsg,
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
        <Spin
          spinning={this.state.loading}
          indicator={(
            <LoadingOutlined
              spin
            />
          )}
        >
          {this.state.legendError ?
            <div
              className='legend-load-error'
            >
              {errorMsg}
            </div>
            :
            <img
              src={this.state.imgSrc}
              alt={alt}
              onError={this.onError.bind(this)}
            />
          }
        </Spin>
      </div>
    );
  }
}

export default Legend;

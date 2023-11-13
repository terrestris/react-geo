import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logger from '@terrestris/base-util/dist/Logger';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import { Spin } from 'antd';
import _isEqual from 'lodash/isEqual';
import OlLayerImage from 'ol/layer/Image';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceTileWMS from 'ol/source/TileWMS';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { CSS_PREFIX } from '../constants';

/**
   * Get the corresponding legendGraphic of a layer. If layer is configured with
   * "legendUrl" this will be used. Otherwise a getLegendGraphic requestString
   * will be created by the MapUtil.
   *
   * @param legendLayer The layer to get the legend graphic request for.
   * @param params The extra params.
   */
const getLegendUrl = (
  legendLayer: OlLayerTile<OlSourceTileWMS> | OlLayerImage<OlSourceImageWMS>,
  params: any
) => {
  let url;

  if (legendLayer.get('legendUrl')) {
    url = legendLayer.get('legendUrl');
  } else {
    url = MapUtil.getLegendGraphicUrl(legendLayer, params);
  }

  return url;
};

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

export type LegendProps = BaseProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * Class representing the Legend.
 *
 * @class Legend
 * @extends React.Component
 */
export const Legend: React.FC<LegendProps> = ({
  className,
  layer,
  extraParams,
  onError,
  errorMsg,
  headers,
  ...passThroughProps
}) => {

  // eslint-disable-next-line
  const [imgSrc, setImgSrc] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const [legendUrl, setLegendUrl] = useState(getLegendUrl(layer, extraParams));
  const [legendError, setLegendError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLegendSrc();
  }, []);

  useEffect(() => {
    setLegendUrl(getLegendUrl(layer, extraParams));
    setLegendSrc();
  }, []);

  const setLegendSrc = async () => {
    try {
      setLoading(true);

      const response = await fetch(legendUrl, {
        headers
      });

      if (!response.ok) {
        throw new Error('No successful response returned while getting the legend graphic');
      }

      if (imgSrc) {
        URL.revokeObjectURL(imgSrc);
      }

      setImgSrc(URL.createObjectURL(await response.blob()));
    } catch (error) {
      Logger.error('Error while setting the img src: ', error);

      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * onError handler for the rendered img.
   */
  const handleError = (e: any) => {
    Logger.warn(`Image error for legend of "${layer.get('name')}".`);
    setLegendError(true);
    if (onError) {
      onError(e);
    }
  };

  const alt = layer.get('name')
    ? layer.get('name') + ' legend'
    : 'layer legend';

  return (
    <div
      className={`${CSS_PREFIX}legend ${className ? className : ''}`}
      {...passThroughProps}
    >
      <Spin
        spinning={loading}
        indicator={(
          <FontAwesomeIcon
            icon={faCircleNotch}
          />
        )}
      >
        {legendError ?
          <div
            className='legend-load-error'
          >
            {errorMsg}
          </div>
          :
          <img
            src={imgSrc}
            alt={alt}
            onError={handleError.bind(this)}
          />
        }
      </Spin>
    </div>
  );
};

export default Legend;

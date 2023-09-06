import _isArray from 'lodash/isArray';
import OlLayer from 'ol/layer/Layer';
import OlImageWMS from 'ol/source/ImageWMS';
import OlTileWMS from 'ol/source/TileWMS';
import * as React from 'react';

export type TimeLayerAwareConfig = {
  isWmsTime?: boolean;
  layer: OlLayer<OlImageWMS|OlTileWMS, any>;
  customHandler?: (values: any) => void;
};

/**
 * Finds the key time in the passed object regardless of upper- or lowercase
 * characters. Will return `TIME` (all uppercase) as a fallback.
 *
 * @param params The object to find the key in, basically the params of
 *   a WMS source that will end up as URL parameters.
 * @return The key for the time parameter, in the actual spelling.
 */
const findTimeParam = (params: any) => {
  const keys = Object.keys(params);
  let foundKey = 'TIME'; // fallback
  keys.some(key => {
    const lcKey = key && key.toLowerCase && key.toLowerCase();
    if (lcKey === 'time') {
      foundKey = key;
      return true;
    }
    return false;
  });
  return foundKey;
};

/**
 * HOC that updates layers based on the wrapped components time instant or
 * interval. Can for example be used with the TimeSlider component.
 * @param WrappedComponent A component with an onChange prop.
 * @param layers An array of layer configurations.
 * @return A time layer aware component.
 */
export function timeLayerAware<P>(WrappedComponent: React.ComponentType<P>, layers: TimeLayerAwareConfig[]) {

  return class TimeLayerAware extends React.Component<Omit<P, 'onChange'>> {

    timeChanged = (newValues: any) => {
      layers.forEach(config => {
        if (config.isWmsTime) {
          const parms = config.layer.getSource()?.getParams();
          const timeParam = findTimeParam(parms);
          if (_isArray(newValues)) {
            parms[timeParam] = `${newValues[0]}/${newValues[1]}`;
          } else {
            parms[timeParam] = `${newValues}`;
          }
          config.layer.getSource()?.updateParams(parms);
        }
        if (config.customHandler) {
          config.customHandler(newValues);
        }
      });
    };

    /**
     * Injects the onChange property.
     * @return The wrapped component
     */
    render = () => {
      return <WrappedComponent
        onChange={this.timeChanged}
        {...this.props as P}
      />;
    };

  };

}

export default timeLayerAware;

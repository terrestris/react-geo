import React from 'react';

import isArray from 'lodash/isArray';

/**
 * Finds the key time in the passed object regardless of upper- or lowercase
 * characters. Will return `TIME` (all uppercase) as a fallback.
 *
 * @param {Object} params The object to find the key in, basically the params of
 *   a WMS source that will end up as URL parameters.
 * @return {String} The key for the time parameter, in the actual spelling.
 */
const findTimeParam = (params) => {
  const keys = Object.keys(params);
  let foundKey = 'TIME'; // fallback
  keys.some(key => {
    let lcKey = key && key.toLowerCase && key.toLowerCase();
    if (lcKey === 'time') {
      foundKey = key;
      return true;
    }
  });
  return foundKey;
};

/**
 * HOC that updates layers based on the wrapped components time instant or
 * interval. Can for example be used with the TimeSlider component.
 * @param  {React.Component} WrappedComponent a component with an onChange prop
 * @param  {Array} layers array of layer configurations
 * @return {React.Component} a time layer aware component
 */
export function timeLayerAware(WrappedComponent, layers) {

  return class TimeLayerAware extends React.Component {

    timeChanged = newValues => {
      layers.forEach(config => {
        if (config.isWmsTime) {
          const parms = config.layer.getSource().getParams();
          const timeParam = findTimeParam(parms);
          if (isArray(newValues)) {
            parms[timeParam] = `${newValues[0]}/${newValues[1]}`;
          } else {
            parms[timeParam] = `${newValues}`;
          }
          config.layer.getSource().updateParams(parms);
        }
        if (config.customHandler) {
          config.customHandler(newValues);
        }
      });
    }

    /**
     * Injects the onChange property.
     * @return {React.Component} the wrapped component
     */
    render = () => {
      return <WrappedComponent
        onChange={this.timeChanged}
        {...this.props}
      />;
    }

  };

}

export default timeLayerAware;

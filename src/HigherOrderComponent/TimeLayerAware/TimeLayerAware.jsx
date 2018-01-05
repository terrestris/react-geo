import React from 'react';
import { isArray } from 'lodash';

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
          if (isArray(newValues)) {
            parms.time = `${newValues[0]}/${newValues[1]}`;
          } else {
            parms.time = `${newValues}`;
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

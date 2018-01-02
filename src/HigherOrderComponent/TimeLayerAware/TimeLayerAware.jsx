import React from 'react';

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
          // TODO update the TIME-parameter of config.layer
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
        {...this.props} />;
    }

  };

}

export default timeLayerAware;

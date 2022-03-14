import * as React from 'react';
import * as PropTypes from 'prop-types';
import OlMap from 'ol/Map';

import Logger from '@terrestris/base-util/dist/Logger';

/**
 * The HOC factory function.
 *
 * Wrapped components will receive the map from the context as a prop.
 *
 * @param WrappedComponent The component to wrap and enhance.
 * @return The wrapped component.
 */
export function mappify<P>(WrappedComponent: React.ComponentType<P>) {

  /**
   * The wrapper class for the given component.
   *
   * @class The MappifiedComponent
   * @extends React.Component
   */
  return class MappifiedComponent extends React.Component<Omit<P, 'map'>> {

    /**
     * The context types.
     */
    static contextTypes = {
      map: PropTypes.instanceOf(OlMap).isRequired
    };

    /**
     * Create the MappifiedComponent.
     *
     * @constructs MappifiedComponent
     */
    constructor(props: P) {
      super(props);
    }

    /**
     * The render function.
     */
    render() {
      const {
        map
      } = this.context;

      if (!map) {
        Logger.warn('You\'re trying to mappify a component without any map ' +
          'in the context. Did you implement the MapProvider?');
      }

      return (
        <WrappedComponent
          map={map}
          {...this.props as P}
        />
      );

    }
  };
}

export default mappify;

import * as React from 'react';
import * as PropTypes from 'prop-types';
import OlMap from 'ol/Map';

import Logger from '@terrestris/base-util/dist/Logger';

interface MappifiedComponentProps {
  withRef?: boolean;
}

/**
 * The HOC factory function.
 *
 * Wrapped components will receive the map from the context as a prop.
 *
 * @param {Component} WrappedComponent The component to wrap and enhance.
 * @return {Component} The wrapped component.
 */
export function mappify<P extends Omit<P, 'map'>>(WrappedComponent: React.ComponentType<P>,  {
  withRef = false
}: MappifiedComponentProps = {}) {

  /**
   * The wrapper class for the given component.
   *
   * @class The MappifiedComponent
   * @extends React.Component
   */
  return class MappifiedComponent extends React.Component<P & MappifiedComponentProps> {

    _wrappedInstance?: React.ReactElement;

    /**
     * The context types.
     * @type {Object}
     */
    static contextTypes = {
      map: PropTypes.instanceOf(OlMap).isRequired
    };

    /**
     * Create the MappifiedComponent.
     *
     * @constructs MappifiedComponent
     */
    constructor(props: P & MappifiedComponentProps) {
      super(props);

      /**
       * The wrapped instance.
       * @type {Element}
       */
      this._wrappedInstance = null;
    }

    /**
     * Returns the wrapped instance. Only applicable if withRef is set to true.
     *
     * @return {Element} The wrapped instance.
     */
    getWrappedInstance = (): React.ReactElement | void => {
      if (withRef) {
        return this._wrappedInstance;
      } else {
        Logger.warn('No wrapped instance referenced, please call the '
          + 'mappify with option withRef = true.');
      }
    }

    /**
     * Sets the wrapped instance.
     *
     * @param {Element} instance The instance to set.
     */
    setWrappedInstance = (instance) => {
      if (withRef) {
        this._wrappedInstance = instance;
      }
    }

    /**
     * The render function.
     */
    render() {
      const {
        map
      } = this.context;

      if (!map) {
        Logger.warn('You trying to mappify a component without any map in the ' +
        'context. Did you implement the MapProvider?');
      }

      return (
        <WrappedComponent
          ref={this.setWrappedInstance}
          map={map}
          {...this.props}
        />
      );

    }
  };
}

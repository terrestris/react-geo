import React from 'react';

import Logger from '@terrestris/base-util/dist/Logger';

interface IsVisibleComponentProps {
  withRef: boolean;
}

export interface VisibleComponentProps {
  activeModules: any[];
  name: string;
}

/**
 * The HOC factory function.
 *
 * Wrapped components will be checked against the activeModules array of
 * the state: If the wrapped component (identified by it's name) is included
 * in the state, it will be rendered, if not, it wont.
 *
 * @param {Component} WrappedComponent The component to wrap and enhance.
 * @param {Object} options The options to apply.
 * @return {Component} The wrapped component.
 */
export function isVisibleComponent<P extends VisibleComponentProps>(WrappedComponent: React.ComponentType<any>, {
  withRef = false
}: IsVisibleComponentProps): React.ComponentType {

  /**
   * The wrapper class for the given component.
   *
   * @class The VisibleComponent
   * @extends React.Component
   */
  return class VisibleComponent extends React.Component<P> {

    _wrappedInstance?: React.ReactElement;

    /**
     * Create the VisibleComponent.
     *
     * @constructs VisibleComponent
     */
    constructor(props: P & IsVisibleComponentProps) {
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
     * @return {Element} The wrappend instance.
     */
    getWrappedInstance = (): React.ReactElement | void => {
      if (withRef) {
        return this._wrappedInstance;
      } else {
        Logger.debug('No wrapped instance referenced, please call the '
          + 'isVisibleComponent with option withRef = true.');
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
     * Checks if the current component (identified by it's name) should be
     * visible or not.
     *
     * @param {String} componentName The name of the component.
     * @return {Boolean} Whether the component should be visible or not.
     */
    isVisibleComponent = (componentName) => {
      let activeModules = this.props.activeModules || [];

      return activeModules.some(activeModule => {
        if (!activeModule.name) {
          return false;
        } else {
          return activeModule.name === componentName;
        }
      });
    }

    /**
     * The render function.
     */
    render() {
      // Filter out extra props that are specific to this HOC and shouldn't be
      // passed through.
      const {
        activeModules,
        ...passThroughProps
      } = this.props;

      // Check if the current component should be visible or not.
      let isVisible = this.isVisibleComponent(this.props.name);

      // Inject props into the wrapped component. These are usually state
      // values or instance methods.
      return (
        isVisible ?
          <WrappedComponent
            ref={this.setWrappedInstance}
            {...passThroughProps as P}
          /> :
          null
      );
    }
  };
}

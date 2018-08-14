import React from 'react';
import PropTypes from 'prop-types';

import Logger from '@terrestris/base-util/src/Logger';

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
export function isVisibleComponent(WrappedComponent, {
  withRef = false
} = {}) {

  /**
   * The wrapper class for the given component.
   *
   * @class The VisibleComponent
   * @extends React.Component
   */
  class VisibleComponent extends React.Component {

    /**
     * The props.
     * @type {Object}
     */
    static propTypes = {
      activeModules: PropTypes.arrayOf(PropTypes.object)
    }

    /**
     * Create the VisibleComponent.
     *
     * @constructs VisibleComponent
     */
    constructor(props) {
      super(props);

      /**
       * The wrapped instance.
       * @type {Element}
       */
      this.wrappedInstance = null;
    }

    /**
     * Returns the wrapped instance. Only applicable if withRef is set to true.
     *
     * @return {Element} The wrappend instance.
     */
    getWrappedInstance = () => {
      if (withRef) {
        return this.wrappedInstance;
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
        this.wrappedInstance = instance;
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
      let isVisibleComponent = this.isVisibleComponent(passThroughProps.name);

      // Inject props into the wrapped component. These are usually state
      // values or instance methods.
      return (
        isVisibleComponent ?
          <WrappedComponent
            ref={this.setWrappedInstance}
            {...passThroughProps}
          /> :
          null
      );
    }
  }

  return VisibleComponent;
}

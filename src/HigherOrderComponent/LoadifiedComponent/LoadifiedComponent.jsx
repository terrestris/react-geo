import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import Logger from '@terrestris/base-util/src/Logger';

/**
 * The HOC factory function.
 *
 * Wrapped components will be used as the content of the Loader component.
 * If the wrapped component is set to be loading the loader element
 * will be shown and if not it wont.
 *
 * @param {Component} WrappedComponent The component to wrap and enhance.
 * @param {Component} options The options to apply.
 * @return {Component} The wrapped component.
 */
export function loadify(WrappedComponent, {
  withRef = false
} = {}) {

  /**
   * The wrapper class for the given component.
   *
   * @class The loadify
   * @extends React.Component
   */
  class LoadifiedComponent extends React.Component {

    /**
     * The props.
     * @type {Object}
     */
    static propTypes = {
      /**
       * Whether the component should be loading or not.
       * @type {Boolean}
       */
      spinning: PropTypes.bool,
      /**
       * Size of the loading element.
       * @type {string}
       */
      size: PropTypes.oneOf(['small', 'default', 'large']),
      /**
       * The indicator element to use for the loader.
       * @type {String}
       */
      indicator: PropTypes.any,
      /**
       * The tip text of loader element
       * @type {String}
       */
      tip: PropTypes.string,
      /**
       * The delay time for the loader to show.
       * @type {Number}
       */
      delay: PropTypes.number,

    }

  /**
   * The default properties.
   *
   * @type {Object}
   */
  static defaultProps = {
    spinning: false
  }

  /**
   * Create the Loadify.
   *
   * @constructs Loadify
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
          + 'Loadify with option withRef = true.');
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
     * The render function.
     */
    render() {
      const {
        size,
        indicator,
        tip,
        delay,
        spinning,
        ...passThroughProps
      } = this.props;

      // Propoerties passed to the Spin component. For the List of all the Spin component
      // properties see:
      // https://ant.design/components/spin/
      const passToLoader = {
        size,
        indicator,
        tip,
        delay,
        spinning
      };
      return (
        <Spin {...passToLoader} >
          { <WrappedComponent
            ref={this.setWrappedInstance}
            {...passThroughProps} />}
        </Spin>
      );
    }
  }

  return LoadifiedComponent;
}

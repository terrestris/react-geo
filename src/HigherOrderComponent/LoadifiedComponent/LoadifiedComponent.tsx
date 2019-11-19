import * as React from 'react';
import { Spin } from 'antd';
import Logger from '@terrestris/base-util/dist/Logger';
import { SpinProps } from 'antd/lib/spin';

export interface LoadifiedComponentProps {
  withRef?: boolean;
}

/**
 * The HOC factory function.
 *
 * Wrapped components will be used as the content of the Loader component.
 * If the wrapped component is set to be loading the loader element
 * will be shown and if not it wont.
 *
 * @param WrappedComponent The component to wrap and enhance.
 * @param options The options to apply.
 * @return The wrapped component.
 */
export function loadify<P>(WrappedComponent: React.ComponentType<any>, {
  withRef = false
}: LoadifiedComponentProps = {}) {

  /**
   * The wrapper class for the given component.
   *
   * @class The loadify
   * @extends React.Component
   */
  return class LoadifiedComponent extends React.Component<P & Partial<SpinProps>> {

    _wrappedInstance?: React.ReactElement;

    /**
     * The default properties.
     */
    static defaultProps = {
      spinning: false
    };

    /**
     * Create the Loadify.
     *
     * @constructs Loadify
     */
    constructor(props: P) {
      super(props);

      /**
       * The wrapped instance.
       */
      this._wrappedInstance = null;
    }

    /**
     * Returns the wrapped instance. Only applicable if withRef is set to true.
     *
     * @return The wrappend instance.
     */
    getWrappedInstance = (): React.ReactElement | void => {
      if (withRef) {
        return this._wrappedInstance;
      } else {
        Logger.debug('No wrapped instance referenced, please call the '
          + 'Loadify with option withRef = true.');
      }
    }

    /**
     * Sets the wrapped instance.
     *
     * @param instance The instance to set.
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
      const passToLoader: Partial<SpinProps> = {
        size,
        indicator,
        tip,
        delay,
        spinning
      };

      return (
        <Spin {...passToLoader} >
          <WrappedComponent
            ref={this.setWrappedInstance}
            {...passThroughProps}
          />
        </Spin>
      );
    }
  };
}

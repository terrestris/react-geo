import * as React from 'react';
import { Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';

/**
 * The HOC factory function.
 *
 * Wrapped components will be used as the content of the Loader component.
 * If the wrapped component is set to be loading the loader element
 * will be shown and if not it wont.
 *
 * @param WrappedComponent The component to wrap and enhance.
 * @return The wrapped component.
 */
export function loadify<P>(WrappedComponent: React.ComponentType<any>) {

  /**
   * The wrapper class for the given component.
   *
   * @class The loadify
   * @extends React.Component
   */
  return class LoadifiedComponent extends React.Component<P & Partial<SpinProps>> {

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
    constructor(props: P & Partial<SpinProps>) {
      super(props);
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
            {...passThroughProps}
          />
        </Spin>
      );
    }
  };
}

export default loadify;

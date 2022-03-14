import * as React from 'react';

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
 * @param WrappedComponent The component to wrap and enhance.
 * @return The wrapped component.
 */
export function isVisibleComponent<P>(
  WrappedComponent: React.ComponentType<P>): React.ComponentType<P & VisibleComponentProps> {

  /**
   * The wrapper class for the given component.
   *
   * @class The VisibleComponent
   * @extends React.Component
   */
  return class VisibleComponent extends React.Component<P & VisibleComponentProps> {

    /**
     * Checks if the current component (identified by it's name) should be
     * visible or not.
     *
     * @param componentName The name of the component.
     * @return Whether the component should be visible or not.
     */
    isVisibleComponent = (componentName: string) => {
      const activeModules = this.props.activeModules || [];

      return activeModules.some((activeModule: any) => {
        if (!activeModule.name) {
          return false;
        } else {
          return activeModule.name === componentName;
        }
      });
    };

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
      const isVisible = this.isVisibleComponent(this.props.name);

      // Inject props into the wrapped component. These are usually state
      // values or instance methods.
      return (
        isVisible ?
          <WrappedComponent
            {...passThroughProps as P & VisibleComponentProps}
          /> :
          null
      );
    }
  };
}

export default isVisibleComponent;

import * as React from 'react';
import * as PropTypes from 'prop-types';

const _isFunction = require('lodash/isFunction');

import { CSS_PREFIX } from '../../constants';

import './ToggleGroup.less';

interface DefaultProps {
  /**
   * The orientation of the children.
   */
  orientation: 'vertical' | 'horizontal';
  /**
   * Whether it's allowed to deselect a children or not.
   */
  allowDeselect: boolean;
}

interface BaseProps {
  /**
   * The className which should be added.
   */
  className?: string;
  /**
   * The name of this group.
   */
  name?: string;
  /**
   * The value fo the `name` attribute of the children to select/press
   * initially.
   * Note: This prop will have full control over the pressed prop on its children. Setting select/pressed on the
   * children props directly will have no effect.
   */
  selectedName?: string;
  /**
   * Callback function for onChange.
   */
  onChange?: (childProps: any) => void;
  /**
   * The children of this group. Typically a set of `ToggleButton`s.
   */
  children?: React.ReactElement[];
}

interface ToggleGroupState {
  selectedName: string;
}

export type ToggleGroupProps = BaseProps & Partial<DefaultProps>;

/**
 * A group for toggle components (e.g. buttons)
 *
 * @class The ToggleGroup
 * @extends React.Component
 */
class ToggleGroup extends React.Component<ToggleGroupProps, ToggleGroupState> {

  /**
   * The className added to this component.
   * @private
   */
  _className = `${CSS_PREFIX}togglegroup`;

  /**
   * The default properties.
   */
  static defaultProps: DefaultProps = {
    orientation: 'vertical',
    allowDeselect: true
  };

  /**
   * The child context types.
   */
  static childContextTypes = {
    toggleGroup: PropTypes.object
  };

  /**
   * The constructor.
   *
   * @param props The properties.
   */
  constructor(props: ToggleGroupProps) {
    super(props);

    /**
     * The initial state.
     */
    this.state = {
      selectedName: props.selectedName
    };
  }

  /**
   * Returns the context for the children.
   *
   * @return The child context.
   */
  getChildContext() {
    return {
      toggleGroup: {
        name: this.props.name,
        selectedName: this.state.selectedName,
        onChange: this.onChange
      }
    };
  }

  /**
   * The onChange handler.
   *
   * @param childProps The properties of the children.
   */
  onChange = (childProps) => {
    if (_isFunction(this.props.onChange)) {
      this.props.onChange(childProps);
    }
    // Allow deselect.
    if (this.props.allowDeselect && (childProps.name === this.state.selectedName)) {
      this.setState({ selectedName: null });
    } else {
      this.setState({ selectedName: childProps.name });
    }
  };

  /**
   * The render function.
   */
  render() {
    const { orientation, children } = this.props;
    const className = this.props.className
      ? `${this.props.className} ${this._className}`
      : this._className;
    const orientationClass = (orientation === 'vertical')
      ? 'vertical-toggle-group'
      : 'horizontal-toggle-group';

    const childrenWithProps = React.Children.map(children, (child) => {
      // pass the press state through to child components
      return child ? React.cloneElement(child, {
        pressed: this.state.selectedName === child.props.name
      }) : child;
    });

    return (
      <div
        className={`${className} ${orientationClass}`}
      >
        {childrenWithProps}
      </div>
    );
  }
}

export default ToggleGroup;

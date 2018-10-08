import React from 'react';
import PropTypes from 'prop-types';

import isFunction from 'lodash/isFunction';

import { CSS_PREFIX } from '../../constants';

import './ToggleGroup.less';

/**
 * A group for toggle components (e.g. buttons)
 *
 * @class The ToggleGroup
 * @extends React.Component
 */
class ToggleGroup extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}togglegroup`

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * The className which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * The name of this group.
     * @type {String}
     */
    name: PropTypes.string,

    /**
     * The orientation of the children. Either `vertical` (default)
     * or `horizontal`.
     * @type {String}
     */
    orientation: PropTypes.string,

    /**
     * Whether it's allowed to deselect a children or not.
     * @type {Boolean}
     */
    allowDeselect: PropTypes.bool,

    /**
     * The value fo the `name` attribute of the children to select/press
     * initially.
     * @type {String}
     */
    selectedName: PropTypes.string,

    /**
     * Callback function for onChange.
     * @type {Function}
     */
    onChange: PropTypes.func,

    /**
     * The children of this group. Typically a set of `ToggleButton`s.
     * @type {Object}
     */
    children: PropTypes.node
  }

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    orientation: 'vertical',
    allowDeselect: true
  }

  /**
   * The child context types.
   * @type {Object}
   */
  static childContextTypes = {
    toggleGroup: PropTypes.object
  }

  /**
   * The child context types.
   * @type {Object}
   */
  static childContextTypes = {
    toggleGroup: PropTypes.object
  }

  /**
   * The constructor.
   *
   * @param {Object} props The properties.
   */
  constructor(props) {
    super(props);

    /**
     * The initial state.
     * @type {Object}
     */
    this.state = {
      selectedName: props.selectedName
    };
  }

  /**
   * Returns the context for the children.
   *
   * @return {Object} The child context.
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
   * @param {Object} childProps The properties if the children.
   */
  onChange = (childProps) => {
    if (isFunction(this.props.onChange)) {
      this.props.onChange(childProps);
    }
    // Allow deselect.
    if (this.props.allowDeselect && (childProps.name === this.state.selectedName)) {
      this.setState({selectedName: null});
    } else {
      this.setState({selectedName: childProps.name});
    }
  }

  /**
   * The render function.
   */
  render() {
    const {orientation, children} = this.props;
    const className = this.props.className
      ? `${this.props.className} ${this.className}`
      : this.className;
    const orientationClass = (orientation === 'vertical')
      ? 'vertical-toggle-group'
      : 'horizontal-toggle-group';

    const childrenWithProps = React.Children.map(children, (child) => {
      // pass the press state through to child components
      return React.cloneElement(child, {
        pressed: this.state.selectedName === child.props.name
      });
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

import React from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';

import './ToggleGroup.less';
import {
  ToggleButton
} from '../../index';

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
  className = 'react-geo-togglegroup'


  /**
   * The previously selected button.
   * @type {String}
   * @private
   */
  _previousProps = null;

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
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
     * The ToggleButtons of this group.
     * @type {Object}
     */
    children: PropTypes.arrayOf(
      PropTypes.instanceOf(ToggleButton)
    )
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
   * The onChange handler.
   *
   * @param {Object} childProps The properties if the children.
   */
  onToggle = (childProps, pressed, evt) => {

    if (pressed) {
      if (this._previousProps && childProps.name !== this._previousProps.name) {
        this._previousProps.onToggle(false);
      }
      this.setState({selectedName: childProps.name});
      this._previousProps = childProps;
    } else if (this.props.allowDeselect && (childProps.name === this.state.selectedName)) {
      this.setState({selectedName: null});
    } else {
      // TODO Button should not be unpressable
    }

    if (isFunction(this.props.onChange) && evt) {
      this.props.onChange(pressed, evt);
    }

    childProps.onToggle(pressed, evt);
  }

  /**
   * The render function.
   */
  render() {
    const {
      orientation,
      children
    } = this.props;
    const className = this.props.className
      ? `${this.props.className} ${this.className}`
      : this.className;
    const orientationClass = (orientation === 'vertical')
      ? 'vertical-toggle-group'
      : 'horizontal-toggle-group';

    const childrenWithProps = React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        pressed: this.state.selectedName === child.props.name,
        onToggle: this.onToggle.bind(this, child.props)
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

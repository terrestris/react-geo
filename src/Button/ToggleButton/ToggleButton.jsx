import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Tooltip
} from 'antd';
import { Icon } from 'react-fa';
import isFunction from 'lodash/isFunction.js';

import './ToggleButton.less';

import { CSS_PREFIX } from '../../constants';

/**
 * The ToggleButton.
 *
 * @class The ToggleButton
 * @extends React.Component
 */
class ToggleButton extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}togglebutton`

  /**
   * The class to apply for a toggled/pressed button.
   * @type {String}
   */
  pressedClass = 'btn-pressed';

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    name: PropTypes.string,
    icon: PropTypes.string,
    pressedIcon: PropTypes.string,
    fontIcon: PropTypes.string,
    pressed: PropTypes.bool,
    onToggle: PropTypes.func,
    tooltip: PropTypes.string,
    tooltipPlacement: PropTypes.string,
    className: PropTypes.string
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    type: 'primary',
    icon: '',
    pressed: false
  }

   /**
   * The context types.
   * @type {Object}
   */
  static contextTypes = {
    toggleGroup: PropTypes.object
  };

  /**
   * Invoked right before calling the render method, both on the initial mount
   * and on subsequent updates. It should return an object to update the state,
   * or null to update nothing.
   * @param {Object} nextProps The next properties.
   * @param {Object} prevState The previous state.
   */
  static getDerivedStateFromProps(nextProps, prevState) {

    // Checks to see if the pressed property has changed or if the internal state has changed
    if (prevState.pressed != nextProps.pressed || prevState.propPressed !== nextProps.pressed) {

      return {
        propPressed: nextProps.pressed,
        pressed: nextProps.pressed
      };
    }
    return null;
  }

  /**
   * Creates the ToggleButton.
   *
   * @constructs ToggleButton
   */
  constructor(props) {
    super(props);

    // Instantiate the state.
    // The propPressed represents the pressed property while pressed represents the internal 
    // components state
    this.state = {
      pressed: props.pressed,
      lastClickEvt: null,
      propPressed: props.pressed
    };
  }

  /**
   * Invoked immediately after updating occurs. This method is not called 
   * for the initial render.
   * @method
   */
  componentDidUpdate(prevProps, prevState) {
    const {
      onToggle
    } = this.props;

    const {
      pressed,
      lastClickEvt
    } = this.state;
   
    // Note: the lastClickEvt is only available if the button
    // has been clicked, if the prop is changed, no click evt will
    // be available.
    if (onToggle && prevState.pressed !== pressed ) {
      onToggle(pressed, lastClickEvt);
    }
  }

  /**
   * Called on click.
   *
   * @param {ClickEvent} evt The ClickEvent.
   * @method
   */
  onClick(evt) {
    this.setState({
      pressed: !this.state.pressed,
      lastClickEvt: evt
    }, () => {
      if (this.context.toggleGroup && isFunction(this.context.toggleGroup.onChange)) {
        this.context.toggleGroup.onChange(this.props);
      }
    });
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      name,
      icon,
      pressedIcon,
      fontIcon,
      pressed,
      onToggle,
      tooltip,
      tooltipPlacement,
      ...antBtnProps
    } = this.props;

    const {
      onClick,
      ...filteredAntBtnProps
    } = antBtnProps;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    let iconName = icon;
    let pressedClass = '';
    if (this.state.pressed) {

      iconName = pressedIcon || icon;
      pressedClass = ` ${this.pressedClass} `;
    }
    return (
      <Tooltip
        title={tooltip}
        placement={tooltipPlacement}
      >
        <Button
          className={`${finalClassName}${pressedClass}`}
          onClick={this.onClick.bind(this)}
          {...filteredAntBtnProps}
        >
          <Icon
            name={iconName}
            className={fontIcon}
          />
          {antBtnProps.children}
        </Button>
      </Tooltip>
    );
  }
}

export default ToggleButton;
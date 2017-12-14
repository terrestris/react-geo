import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Tooltip
} from 'antd';
import { Icon } from 'react-fa';
import { isFunction } from 'lodash';

import './ToggleButton.less';

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
  className = 'react-geo-togglebutton'

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
    onToggle: PropTypes.func.isRequired,
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
   * Create the ToggleButton.
   *
   * @constructs ToggleButton
   */
  constructor(props) {
    super(props);

    // Instantiate the state.
    this.state = {
      pressed: props.pressed
    };

    if (props.pressed) {
      this.props.onToggle(this.state.pressed);
    }

    this.onClick = this.onClick.bind(this);
  }

  /**
   * Called if this component receives properties.
   *
   * @param {Object} nextProps The received properties.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.pressed != nextProps.pressed) {
      this.setState({
        pressed: nextProps.pressed
      }, () => {
        this.props.onToggle(this.state.pressed);
      });
    }
  }

  /**
   * Called on click
   *
   * @param {ClickEvent} evt the clickeEvent
   */
  onClick(evt) {
    if (this.context.toggleGroup && isFunction(this.context.toggleGroup.onChange)) {
      this.context.toggleGroup.onChange(this.props);
    } else if (this.props.onToggle) {
      this.props.onToggle(!this.state.pressed, evt);
    }

    this.setState({
      pressed: !this.state.pressed
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
          onClick={this.onClick}
          {...antBtnProps}
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

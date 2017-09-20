import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Tooltip
} from 'antd';
import { Icon } from 'react-fa';
import { isFunction } from 'lodash';

import Logger from '../../Util/Logger';

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
   * Create the ToggleButton.
   *
   * @constructs ToggleButton
   */
  constructor(props) {
    super(props);

    if (!props.onToggle) {
      Logger.debug('No onToggle method given. Please provide it as ' +
      'prop to this instance.');
    }

    // Instantiate the state.
    this.state = {
      pressed: props.pressed
    };

    this.onClick = this.onClick.bind(this);
  }

  // TODO I think we should not call the onToggle Handler here. This needs to be
  // refactored.
  /**
   * Called if this component receives properties.
   *
   * @param {Object} nextProps The received properties.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.onToggle || this.state.onToggle) {
      if (this.props.pressed != nextProps.pressed) {
        this.setState({
          pressed: nextProps.pressed
        }, () => {
          this.props.onToggle(this.state.pressed);
        });
      }
    } else {
      Logger.debug('No onToggle method given. Please provide it as ' +
      'prop to this instance.');
    }
  }

  /**
   * Called on click
   */
  onClick() {
    if (this.context.toggleGroup && isFunction(this.context.toggleGroup.onChange)) {
      this.context.toggleGroup.onChange(this.props);
    } else if (this.props.onToggle) {
      this.props.onToggle(!this.state.pressed);
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

    const iconName = this.state.pressed
      ? this.props.pressedIcon || this.props.icon
      : this.props.icon;
    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;
    const pressedClass = this.state.pressed ? ' ' + this.pressedClass : '';

    return (
      <Tooltip
        title={this.props.tooltip}
        placement={this.props.tooltipPlacement}
      >
        <Button
          className={`${finalClassName}${pressedClass}`}
          onClick={this.onClick}
          {...antBtnProps}
        >
          <Icon
            name={iconName}
            className={this.props.fontIcon}
          />
        </Button>
      </Tooltip>
    );
  }
}

export default ToggleButton;

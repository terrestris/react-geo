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
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    icon: PropTypes.string,
    pressedIcon: PropTypes.string,
    fontIcon: PropTypes.string,
    shape: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool,
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
    shape: 'circle',
    size: 'default',
    disabled: false,
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

    /**
     * The class to apply for a toggled/pressed button.
     * @type {String}
     */
    this.toggleClass = 'btn-pressed';

    if (!props.onToggle) {
      Logger.debug('No onToggle method given. Please provide it as ' +
      'prop to this instance.');
    }

    // Instantiate the state.
    this.state = {
      pressed: props.pressed
    };
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
  onClick = () => {
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
    const pressedClass = this.state.pressed ? ' ' + this.toggleClass : '';
    const className = this.props.className ? ' ' + this.props.className : '';
    const iconName = this.state.pressed
      ? this.props.pressedIcon || this.props.icon
      : this.props.icon;

    return (
      <Tooltip
        title={this.props.tooltip}
        placement={this.props.tooltipPlacement}
      >
        <Button
          type={this.props.type}
          shape={this.props.shape}
          size={this.props.size}
          disabled={this.props.disabled}
          onClick={this.onClick}
          className={`btn-toggle${pressedClass}${className}`}
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

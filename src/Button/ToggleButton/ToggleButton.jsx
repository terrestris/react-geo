import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Tooltip
} from 'antd';
import { Icon } from 'react-fa';

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
    className: PropTypes.string,
    /**
     * A name to be identified by the togglegroup.
     * @type {String}
     */
    name: PropTypes.string,
    /**
     * The font awesome icon name.
     * @type {String}
     */
    icon: PropTypes.string,
    /**
     * The font awesome icon name on pressed state. Use either this or icon.
     * @type {String}
     */
    pressedIcon: PropTypes.string,
    /**
     * The classname of an icon of an iconFont. Use either this or icon.
     * @type {String}
     */
    fontIcon: PropTypes.string,
    /**
     * Whether the button should be initially pressed.
     * @type {bool}
     */
    pressed: PropTypes.bool,
    /**
     * The onToggle callback.
     * Be aware that evt can be null if the
     * Params are: (pressedState {bool}, evt {ClickEvent|null})
     *
     * @type {Function}
     */
    onToggle: PropTypes.func.isRequired,
    /**
     * The tooltip to be shown on hover.
     * @type {String}
     */
    tooltip: PropTypes.string,
    /**
     * The position of the tooltip.
     * @type {String}
     */
    tooltipPlacement: PropTypes.oneOf([
      'top',
      'left',
      'right',
      'bottom',
      'topLeft',
      'topRight',
      'bottomLeft',
      'bottomRight',
      'leftTop',
      'leftBottom',
      'rightTop',
      'rightBottom'
    ])
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    type: 'primary',
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

    this.state = {
      pressed: props.pressed
    };

    if (this.state.pressed) {
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
    if (this.props.pressed !== nextProps.pressed) {
      this.setState({
        pressed: nextProps.pressed,
      });
    }
  }

  /**
   * Called on click
   */
  onClick(evt) {
    this.setState({
      pressed: !this.state.pressed
    }, () => {
      this.props.onToggle(this.state.pressed, evt);
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
      ? (pressedIcon || icon)
      : icon;
    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;
    const pressedClass = this.state.pressed ? ' ' + this.pressedClass : '';

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
          {
            icon || fontIcon ?
              <Icon
                name={iconName}
                className={fontIcon}
              /> :null
          }
          {antBtnProps.children}
        </Button>
      </Tooltip>
    );
  }
}

export default ToggleButton;

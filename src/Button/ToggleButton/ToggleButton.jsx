import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Tooltip
} from 'antd';
import { Icon } from 'react-fa';

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
   * Invoked right before calling the render method, both on the initial mount
   * and on subsequent updates. It should return an object to update the state,
   * or null to update nothing.
   * @param {Object} nextProps The next properties.
   * @param {Object} prevState The previous state.
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    
    if (prevState.pressed !== nextProps.pressed) {
      return {
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
    this.state = {
      pressed: props.pressed,
      lastClickEvt: null
    };
  }

  /**
   * Invoked invoked right before the most recently rendered output is committed 
   * to e.g. the DOM. Any value returned by this lifecycle will be passed as a 
   * parameter to componentDidUpdate().
   * 
   * @param {Object} prevProps The previous properties.
   * @param {Object} prevState The previous state.
   */
  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevState.pressed !== this.props.pressed && prevProps.pressed !== this.props.pressed) {
      return (
        this.props.pressed
      );
    }
    return this.state.pressed;
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextState.pressed , this.state.pressed , nextProps.pressed ,this.props.pressed)
    //  if (this.state.pressed == nextProps.pressed && nextProps.pressed ,this.props.pressed) return false
    return true;
  }

 componentWillMount(){
   
 }
  
  /**
   * Invoked immediately after updating occurs. This method is not called 
   * for the initial render.
   * @method
   */
  componentDidUpdate(prevProps, prevState, outerPressed) {
    const {
      onToggle
    } = this.props;

    const {
      pressed,
      lastClickEvt
    } = this.state;
debugger;
   
    if (outerPressed !== pressed ) {
      this.setState({
        pressed: outerPressed
      });
    }

    //   // Note: the lastClickEvt is only available if the button
    //   // has been clicked, if the prop is changed, no click evt will
    //   // be available.
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
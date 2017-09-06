import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Tooltip
} from 'antd';
import { Icon } from 'react-fa';

import Logger from '../../Util/Logger';

import './SimpleButton.less';

/**
 * The SimpleButton.
 *
 * @class The SimpleButton
 * @extends React.Component
 */
class SimpleButton extends React.Component {

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    icon: PropTypes.string,
    fontIcon: PropTypes.string,
    shape: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    tooltip: PropTypes.string,
    tooltipPlacement: PropTypes.string
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
    disabled: false
  }

  /**
   * Create the SimpleButton.
   *
   * @constructs SimpleButton
   */
  constructor(props) {
    super(props);
  }

  /**
   * Handles the given click callback.
   */
  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick();
    } else {
      Logger.debug('No onClick method given. Please provide it as ' +
          'prop to this instance.');
    }
  }

  /**
   * The render function.
   */
  render() {
    const {
      tooltip,
      tooltipPlacement,
      icon,
      fontIcon,
      ...antBtnProps
    } = this.props;

    return (
      <Tooltip
        title={tooltip}
        placement={tooltipPlacement}
      >
        <Button
          className="btn-simple"
          onClick={this.onClick}
          {...antBtnProps}
        >
          <Icon
            name={icon}
            className={fontIcon}
          />
        </Button>
      </Tooltip>
    );
  }
}

export default SimpleButton;

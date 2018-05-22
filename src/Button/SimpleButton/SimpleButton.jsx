import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/es/button';
import Tooltip from 'antd/es/tooltip';
import Icon from 'react-fa/lib/Icon';

import './SimpleButton.less';

import { CSS_PREFIX } from '../../constants';

/**
 * The SimpleButton.
 *
 * @class The SimpleButton
 * @extends React.Component
 */
class SimpleButton extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}simplebutton`

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    className: PropTypes.string,
    /**
     * The font awesome icon name.
     * @type {String}
     */
    icon: PropTypes.string,
    /**
     * The classname of an icon of an iconFont. Use either this or icon.
     * @type {String}
     */
    fontIcon: PropTypes.string,
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
    type: 'primary'
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
   * The render function.
   */
  render() {
    const {
      className,
      icon,
      fontIcon,
      tooltip,
      tooltipPlacement,
      ...antBtnProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <Tooltip
        title={tooltip}
        placement={tooltipPlacement}
      >
        <Button
          className={finalClassName}
          {...antBtnProps}
        >
          {
            icon || fontIcon ?
              <Icon
                name={icon ? icon : ''}
                className={fontIcon}
              /> : null
          }
          {antBtnProps.children}
        </Button>
      </Tooltip>
    );
  }
}

export default SimpleButton;

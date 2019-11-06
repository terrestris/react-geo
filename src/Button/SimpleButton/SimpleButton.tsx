import React from 'react';
import { Button, Tooltip } from 'antd';
import Icon from 'react-fa/lib/Icon';

import './SimpleButton.less';

import { CSS_PREFIX } from '../../constants';
import { TooltipPlacement, AbstractTooltipProps } from 'antd/lib/tooltip';

interface SimpleButtonDefaultProps {
  type: 'default' | 'primary' | 'ghost' | 'dashed' | 'danger' | 'link';
  /**
   * Additional [antd tooltip](https://ant.design/components/tooltip/)
   * properties to pass to the tooltip component. Note: The props `title`
   * and `placement` will override the props `tooltip` and `tooltipPlacement`
   * of this component!
   */
  tooltipProps: AbstractTooltipProps;
}

export interface SimpleButtonProps extends Partial<SimpleButtonDefaultProps> {
  className?: string;
  /**
   * The font awesome icon name.
   */
  icon?: string;
  /**
   * The classname of an icon of an iconFont. Use either this or icon.
   */
  fontIcon?: string;
  /**
   * The tooltip to be shown on hover.
   */
  tooltip?: string;
  /**
   * The position of the tooltip.
   */
  tooltipPlacement?: TooltipPlacement;
}

/**
 * The SimpleButton.
 *
 * @class The SimpleButton
 * @extends React.Component
 */
class SimpleButton extends React.Component<SimpleButtonProps> {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}simplebutton`;

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps: SimpleButtonDefaultProps = {
    type: 'primary',
    tooltipProps: {
      mouseEnterDelay: 1.5
    }
  };

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
      tooltipProps,
      ...antBtnProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <Tooltip
        title={tooltip}
        placement={tooltipPlacement}
        {...tooltipProps}
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

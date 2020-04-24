import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { TooltipPlacement, AbstractTooltipProps } from 'antd/lib/tooltip';

import Icon from 'react-fa/lib/Icon';

import { CSS_PREFIX } from '../../constants';

import './SimpleButton.less';

interface DefaultProps {
  type: 'default' | 'primary' | 'ghost' | 'dashed' | 'danger' | 'link';
  /**
   * Additional [antd tooltip](https://ant.design/components/tooltip/)
   * properties to pass to the tooltip component. Note: The props `title`
   * and `placement` will override the props `tooltip` and `tooltipPlacement`
   * of this component!
   */
  tooltipProps: AbstractTooltipProps;
}

interface BaseProps {
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

export type SimpleButtonProps = BaseProps & Partial<DefaultProps> & ButtonProps;

/**
 * The SimpleButton.
 *
 * @class The SimpleButton
 * @extends React.Component
 */
class SimpleButton extends React.Component<SimpleButtonProps> {

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}simplebutton`;

  /**
   * The default properties.
   */
  static defaultProps: DefaultProps = {
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

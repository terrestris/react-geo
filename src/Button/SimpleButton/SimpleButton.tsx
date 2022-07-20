import * as React from 'react';

import { Button, Tooltip } from 'antd';

import { TooltipPlacement, AbstractTooltipProps } from 'antd/lib/tooltip';
import { ButtonProps } from 'antd/lib/button';

import { CSS_PREFIX } from '../../constants';

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
   * The default properties.
   */
  static defaultProps: DefaultProps = {
    type: 'primary',
    tooltipProps: {
      mouseEnterDelay: 1.5
    }
  };

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}simplebutton`;

  /**
   * The render function.
   */
  render() {
    const {
      className,
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
          {antBtnProps.children}
        </Button>
      </Tooltip>
    );
  }
}

export default SimpleButton;

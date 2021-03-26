import * as React from 'react';

import { Button, Tooltip } from 'antd';

import { TooltipPlacement, AbstractTooltipProps } from 'antd/lib/tooltip';
import { ButtonProps } from 'antd/lib/button';

import Icon from 'react-fa/lib/Icon';

import { CSS_PREFIX } from '../../constants';

import logger from '@terrestris/base-util/dist/Logger';

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
   * The icon to render. See https://ant.design/components/icon/.
   */
  icon?: React.ReactNode;
  /**
   * The name of the fa icon. Set either the icon node or the name of the icon.
   */
  iconName?: string;
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
      icon,
      iconName,
      tooltip,
      tooltipPlacement,
      tooltipProps,
      ...antBtnProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    if (icon && iconName) {
      logger.warn('Provide either an icon node or the name of a fa icon. ' +
        'If both are provided the fa icon will be rendered.');
    }

    let iconToRender;
    if (icon) {
      iconToRender = icon;
    }
    if (iconName) {
      iconToRender = <Icon name={iconName}/>;
    }

    return (
      <Tooltip
        title={tooltip}
        placement={tooltipPlacement}
        {...tooltipProps}
      >
        <Button
          className={finalClassName}
          icon={iconToRender}
          {...antBtnProps}
        >
          {antBtnProps.children}
        </Button>
      </Tooltip>
    );
  }
}

export default SimpleButton;

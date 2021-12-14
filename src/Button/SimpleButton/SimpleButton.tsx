import * as React from 'react';

import { Button, Tooltip } from 'antd';

import { TooltipPlacement, AbstractTooltipProps } from 'antd/lib/tooltip';
import { ButtonProps } from 'antd/lib/button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { CSS_PREFIX } from '../../constants';

import logger from '@terrestris/base-util/dist/Logger';

import  '../../Util/fontawesome';

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
   * The name of the font awesome icon. It could be:
   * - an icon object, like `{ faCoffee }`.
   * - a string, like `'coffee'`.
   * - an array of strings, where the first element is a style prefix
   *   and the second element is the icon name: `{ ['fab', 'apple'] }`
   * For a list of possible icons, please see on https://fontawesome.com/v5.15/icons?d=gallery&p=2&m=free
  */
  iconName?: IconProp;
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
      iconToRender = <FontAwesomeIcon icon={iconName}/>;
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

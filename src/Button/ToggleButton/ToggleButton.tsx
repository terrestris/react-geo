import {
  Button,
  theme,
  Tooltip
} from 'antd';
import {
  AbstractTooltipProps,
  TooltipPlacement
} from 'antd/lib/tooltip';
import React, {
  MouseEvent
} from 'react';

const { useToken } = theme;

import _isFunction from 'lodash/isFunction';

import { CSS_PREFIX } from '../../constants';
import { SimpleButtonProps } from '../SimpleButton/SimpleButton';

interface OwnProps {
  /**
   * Additional [antd tooltip](https://ant.design/components/tooltip/)
   * properties to pass to the tooltip component. Note: The props `title`
   * and `placement` will override the props `tooltip` and `tooltipPlacement`
   * of this component!
   */
  tooltipProps?: AbstractTooltipProps;

  /**
   * The initial pressed state of the ToggleButton
   * Note: If a ToggleButton is inside a ToggleGroup, the pressed state will be controlled by the selectedName property
   * of the ToggleGroup and this property will be ignored.
   */
  pressed?: boolean;

  /**
   * The value associated with this button.
   */
  value?: string;

  /**
   * The icon to render for the pressed state.
   */
  pressedIcon?: React.ReactNode;

  /**
   * The tooltip to be shown on hover.
   */
  tooltip?: string;

  /**
   * The position of the tooltip.
   */
  tooltipPlacement?: TooltipPlacement;

  /**
   * The onChange callback.
   */
  onChange?: (evt: MouseEvent<HTMLButtonElement>, value?: string) => void;

  /**
   * Sets button background to transparent instead of primary color.
   */
  buttonTransparent?: boolean;
}

export type ToggleButtonProps = OwnProps & Omit<SimpleButtonProps, 'onChange' | 'value'>;

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  type = 'primary',
  pressed = false,
  tooltipProps = {
    mouseEnterDelay: 1.5
  },
  className,
  tooltip,
  tooltipPlacement,
  pressedIcon,
  icon,
  children,
  value,
  onClick,
  onChange = () => {},
  buttonTransparent = true,
  ...passThroughProps
}) => {

  const token = useToken();

  const handleChange = (evt: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(evt);

      if (evt.defaultPrevented) {
        return;
      }
    }

    onChange(evt, value);
  };

  const internalClassName = `${CSS_PREFIX}togglebutton`;

  const finalClassName = className
    ? `${className} ${internalClassName}`
    : internalClassName;

  let pressedClass = '';
  if (pressed) {
    pressedClass = ' btn-pressed';
  }

  return (
    <Tooltip
      title={tooltip}
      placement={tooltipPlacement}
      {...tooltipProps}
    >
      <Button
        style={{
          backgroundColor:
            buttonTransparent
              ? 'transparent'
              : pressed
                ? token.token.colorPrimaryActive
                : token.token.colorPrimary
        }}
        type={type}
        onClick={handleChange}
        onChange={onChange}
        className={`${finalClassName}${pressedClass}`}
        aria-pressed={pressed}
        icon={pressed ?
          pressedIcon :
          icon
        }
        {...passThroughProps}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export default ToggleButton;

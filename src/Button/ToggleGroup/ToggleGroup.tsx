import './ToggleGroup.less';

import _isFunction from 'lodash/isFunction';
import React, {
  isValidElement,
  MouseEvent,
  ReactElement
} from 'react';

import { CSS_PREFIX } from '../../constants';
import { ToggleButtonProps } from '../ToggleButton/ToggleButton';

export type ToggleGroupProps<T extends ToggleButtonProps = ToggleButtonProps> = {
  /**
   * The orientation of the children. Default is to 'vertical'.
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * The className which should be added.
   */
  className?: string;

  /**
   * The value fo the `value` attribute of the children to select/press
   * initially. If not given, no child is set as selected.
   * Note: This prop will have full control over the pressed prop on its children. Setting select/pressed on the
   * children props directly will have no effect.
   */
  selected?: string;

  /**
   * Callback function for onChange.
   */
  onChange?: (evt: MouseEvent<HTMLButtonElement>, value?: string) => void;

  /**
   * The children of this group. Typically a set of `ToggleButton`s.
   */
  children?: ReactElement<T>[];
} & React.ComponentProps<'div'>;

export const ToggleGroupContext = React.createContext<boolean>(false);

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  orientation = 'vertical',
  className,
  selected,
  onChange = () => {},
  children,
  ...passThroughProps
}) => {

  const internalClassName = `${CSS_PREFIX}togglegroup`;

  const finalClassName = className
    ? `${className} ${internalClassName}`
    : internalClassName;

  const orientationClass = (orientation === 'vertical')
    ? 'vertical-toggle-group'
    : 'horizontal-toggle-group';

  const handleChange = (evt: MouseEvent<HTMLButtonElement>, buttonValue?: string) => {
    onChange(evt, selected === buttonValue ? undefined : buttonValue);
  };

  return (
    <div
      className={`${finalClassName} ${orientationClass}`}
      {...passThroughProps}
    >
      {
        children
          ?.map(child => {
            if (!isValidElement(child)) {
              return null;
            }

            return React.cloneElement<ToggleButtonProps>(child, {
              key: child.props.value,
              onChange: handleChange,
              pressed: selected === child.props.value
            });
          })
          .filter(child => child !== null)
      }
    </div>
  );
};

export default ToggleGroup;

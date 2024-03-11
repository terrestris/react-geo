import {
  useSelectFeatures,
  UseSelectFeaturesProps
} from '@terrestris/react-util/dist/Hooks/useSelectFeatures/useSelectFeatures';
import * as React from 'react';

import { CSS_PREFIX } from '../../constants';
import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';

interface OwnProps {
  /**
   * The className which should be added.
   */
  className?: string;
}

export type SelectFeaturesButtonProps = OwnProps & Omit<UseSelectFeaturesProps, 'active'> & Partial<ToggleButtonProps>;

/**
 * The className added to this component.
 */
const defaultClassName = `${CSS_PREFIX}selectbutton`;

const SelectFeaturesButton: React.FC<SelectFeaturesButtonProps> = ({
  selectStyle,
  selectInteractionConfig,
  className,
  onFeatureSelect,
  hitTolerance = 5,
  layers,
  clearAfterSelect = false,
  featuresCollection,
  pressed,
  ...passThroughProps
}) => {

  useSelectFeatures({
    active: !!pressed,
    onFeatureSelect,
    clearAfterSelect,
    featuresCollection,
    hitTolerance,
    layers,
    selectStyle,
    selectInteractionConfig
  });

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <ToggleButton
      className={finalClassName}
      pressed={pressed}
      {...passThroughProps}
    />
  );
};

export default SelectFeaturesButton;

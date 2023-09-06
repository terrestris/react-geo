import {useSelectFeatures, UseSelectFeaturesProps} from '@terrestris/react-util/dist/hooks/useSelectFeatures';
import * as React from 'react';
import { useState } from 'react';

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
  onToggle,
  clearAfterSelect = false,
  featuresCollection,
  ...passThroughProps
}) => {
  const [active, setActive] = useState<boolean>(false);

  const onToggleInternal = (pressed: boolean, lastClickEvt: any) => {
    setActive(pressed);
    onToggle?.(pressed, lastClickEvt);
  };

  useSelectFeatures({
    active,
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

  return <ToggleButton
    onToggle={onToggleInternal}
    className={finalClassName}
    {...passThroughProps}
  />;
};

export default SelectFeaturesButton;

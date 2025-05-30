import * as React from 'react';

import {useCallback, useMemo} from 'react';

import { SelectEvent as OlSelectEvent } from 'ol/interaction/Select';

import OlVectorLayer from 'ol/layer/Vector';

import OlSourceVector from 'ol/source/Vector';

import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { usePropOrDefault } from '@terrestris/react-util/dist/Hooks/usePropOrDefault/usePropOrDefault';
import {
  useSelectFeatures,
  UseSelectFeaturesProps
} from '@terrestris/react-util/dist/Hooks/useSelectFeatures/useSelectFeatures';
import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';


import { CSS_PREFIX } from '../../constants';
import ToggleButton, {ToggleButtonProps} from '../ToggleButton/ToggleButton';

interface OwnProps {
  /**
   * The vector layer which will be used for digitize features.
   * The standard digitizeLayer can be retrieved via `DigitizeUtil.getDigitizeLayer(map)`.
   */
  digitizeLayer?: OlVectorLayer<OlSourceVector>;
  /**
   * Listener function for the 'select' event of the ol.interaction.Select
   * if in `Delete` mode.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-SelectEvent.html
   * for more information.
   */
  onFeatureRemove?: (event: OlSelectEvent) => void;
}

export type DeleteButtonProps = OwnProps & Omit<UseSelectFeaturesProps,
  'layers'|'onFeatureSelect'|'featuresCollection'|'clearAfterSelect'|'active'> & Partial<ToggleButtonProps>;

/**
 * The className added to this component.
 */
const defaultClassName = `${CSS_PREFIX}deletebutton`;

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  className,
  digitizeLayer,
  onFeatureRemove,
  selectStyle,
  selectInteractionConfig,
  hitTolerance,
  pressed,
  ...passThroughProps
}) => {

  const map = useMap();

  const layer = usePropOrDefault(
    digitizeLayer,
    () => map ? DigitizeUtil.getDigitizeLayer(map) : undefined,
    [map]
  );

  const layers = useMemo(() => layer ? [layer] : [], [layer]);

  const onFeatureSelect = useCallback((event: OlSelectEvent) => {
    if (!layer) {
      return;
    }
    const feat = event.selected[0];
    layer.getSource()?.removeFeature(feat);
    onFeatureRemove?.(event);
  }, [layer, onFeatureRemove]);

  useSelectFeatures({
    selectStyle,
    selectInteractionConfig,
    layers,
    active: !!pressed,
    hitTolerance,
    onFeatureSelect,
    clearAfterSelect: true
  });

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <ToggleButton
      pressed={pressed}
      className={finalClassName}
      {...passThroughProps}
    />
  );
};

export default DeleteButton;

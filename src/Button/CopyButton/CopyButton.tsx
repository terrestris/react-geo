import AnimateUtil from '@terrestris/ol-util/dist/AnimateUtil/AnimateUtil';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { usePropOrDefault } from '@terrestris/react-util/dist/Hooks/usePropOrDefault/usePropOrDefault';
import {
  useSelectFeatures,
  UseSelectFeaturesProps
} from '@terrestris/react-util/dist/Hooks/useSelectFeatures/useSelectFeatures';
import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import { SelectEvent as OlSelectEvent } from 'ol/interaction/Select';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import OlStyle from 'ol/style/Style';
import React, {
  useCallback,
  useMemo,
} from 'react';

import { CSS_PREFIX } from '../../constants';
import ToggleButton, {ToggleButtonProps} from '../ToggleButton/ToggleButton';

interface OwnProps {
  /**
   * The vector layer which will be used for digitize features.
   * The standard digitizeLayer can be retrieved via `DigitizeUtil.getDigitizeLayer(map)`.
   */
  digitizeLayer?: OlVectorLayer<OlVectorSource>;
  /**
   * Listener function for the 'select' event of the ol.interaction.Select
   * if in `Copy` mode.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-SelectEvent.html
   * for more information.
   */
  onFeatureCopy?: (event: OlSelectEvent) => void;
}

export type CopyButtonProps = OwnProps & Omit<UseSelectFeaturesProps,
  'layers'|'onFeatureSelect'|'featuresCollection'|'clearAfterSelect'|'active'> & Partial<ToggleButtonProps>;

// The class name for the component.
const defaultClassName = `${CSS_PREFIX}copybutton`;

const CopyButton: React.FC<CopyButtonProps> = ({
  className,
  digitizeLayer,
  onFeatureCopy,
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
    onFeatureCopy?.(event);

    const feat = event.selected[0];

    if (!feat || !layer || !map) {
      return;
    }

    const copy = feat.clone();

    layer.getSource()?.addFeature(copy);

    AnimateUtil.moveFeature(
      map,
      layer,
      copy,
      500,
      50,
      layer.getStyle() as OlStyle
    );
  }, [layer, onFeatureCopy, map]);

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

export default CopyButton;

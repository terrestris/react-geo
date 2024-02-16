import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import { SelectEvent as OlSelectEvent } from 'ol/interaction/Select';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { CSS_PREFIX } from '../../constants';
import SelectFeaturesButton, { SelectFeaturesButtonProps } from '../SelectFeaturesButton/SelectFeaturesButton';

interface OwnProps {
  /**
   * The vector layer which will be used for digitize features.
   * The standard digitizeLayer can be retrieved via `DigitizeUtil.getDigitizeLayer(map)`.
   */
  digitizeLayer?: OlVectorLayer<OlVectorSource>;
  /**
   * Listener function for the 'select' event of the ol.interaction.Select
   * if in `Delete` mode.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-SelectEvent.html
   * for more information.
   */
  onFeatureRemove?: (event: OlSelectEvent) => void;
}

export type DeleteButtonProps = OwnProps & Omit<SelectFeaturesButtonProps,
  'layers'|'onFeatureSelect'|'featuresCollection'>;

/**
 * The className added to this component.
 */
const defaultClassName = `${CSS_PREFIX}deletebutton`;

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  className,
  digitizeLayer,
  onFeatureRemove,
  ...passThroughProps
}) => {
  const [layers, setLayers] = useState<[OlVectorLayer<OlVectorSource>]|null>(null);

  const map = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }

    if (digitizeLayer) {
      setLayers([digitizeLayer]);
    } else {
      setLayers([DigitizeUtil.getDigitizeLayer(map)]);
    }
  }, [map, digitizeLayer]);

  if (!layers) {
    return null;
  }

  const onFeatureSelect = (event: OlSelectEvent) => {
    onFeatureRemove?.(event);
    const feat = event.selected[0];
    layers[0].getSource()?.removeFeature(feat);
  };

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return <SelectFeaturesButton
    layers={layers}
    onFeatureSelect={onFeatureSelect}
    className={finalClassName}
    clearAfterSelect={true}
    {...passThroughProps}
  />;
};

export default DeleteButton;

import SelectFeaturesButton, { SelectFeaturesButtonProps } from '../SelectFeaturesButton/SelectFeaturesButton';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import OlGeometry from 'ol/geom/Geometry';
import { CSS_PREFIX } from '../../constants';
import { useEffect, useState } from 'react';
import { useMap } from '../..';
import { DigitizeUtil } from '../../Util/DigitizeUtil';
import { SelectEvent } from 'ol/interaction/Select';
import * as React from 'react';

interface OwnProps {
  /**
   * The vector layer which will be used for digitize features.
   * The standard digitizeLayer can be retrieved via `DigitizeUtil.getDigitizeLayer(map)`.
   */
  digitizeLayer?: OlVectorLayer<OlVectorSource<OlGeometry>>;
}

export type DeleteButtonProps = OwnProps & Omit<SelectFeaturesButtonProps, 'layers'>;

/**
 * The className added to this component.
 */
const defaultClassName = `${CSS_PREFIX}deletebutton`;

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  className,
  onFeatureSelect,
  digitizeLayer,
  ...passThroughProps
}) => {
  const [layers, setLayers] = useState<[OlVectorLayer<OlVectorSource<OlGeometry>>]>(null);

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

  const onSelectInternal = (event: SelectEvent) => {
    onFeatureSelect?.(event);
    const feat = event.selected[0];
    layers[0].getSource().removeFeature(feat);
  };

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  if (!layers) {
    return null;
  }

  return <SelectFeaturesButton
    layers={layers}
    onFeatureSelect={onSelectInternal}
    className={finalClassName}
    clearAfterSelect={true}
    {...passThroughProps}
  />;
};

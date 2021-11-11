import React, {
  useEffect,
  useState
} from 'react';

import OlVectorSource from 'ol/source/Vector';
import OlGeometry from 'ol/geom/Geometry';
import OlVectorLayer from 'ol/layer/Vector';

import AnimateUtil from '@terrestris/ol-util/dist/AnimateUtil/AnimateUtil';

import { CSS_PREFIX } from '../../constants';
import { useMap } from '../../Hook/useMap';
import { DigitizeUtil } from '../../Util/DigitizeUtil';
import SelectFeaturesButton, { SelectFeaturesButtonProps } from '../SelectFeaturesButton/SelectFeaturesButton';
import { SelectEvent } from 'ol/interaction/Select';

interface OwnProps {
  /**
   * The vector layer which will be used for digitize features.
   * The standard digitizeLayer can be retrieved via `DigitizeUtil.getDigitizeLayer(map)`.
   */
  digitizeLayer?: OlVectorLayer<OlVectorSource<OlGeometry>>;
}

export type CopyButtonProps = OwnProps & Omit<SelectFeaturesButtonProps, 'layers'>;

/**
 * The className added to this component.
 */
const defaultClassName = `${CSS_PREFIX}copybutton`;

const CopyButton: React.FC<CopyButtonProps> = ({
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

    if (!feat) {
      return;
    }

    const copy = feat.clone();

    layers[0].getSource().addFeature(copy);

    AnimateUtil.moveFeature(
      map,
      layers[0],
      copy,
      500,
      50
    );
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

export default CopyButton;

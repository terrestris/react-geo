import React, {
  useEffect,
  useState
} from 'react';

import OlVectorSource from 'ol/source/Vector';
import OlGeometry from 'ol/geom/Geometry';
import OlVectorLayer from 'ol/layer/Vector';
import { SelectEvent as OlSelectEvent } from 'ol/interaction/Select';

import AnimateUtil from '@terrestris/ol-util/dist/AnimateUtil/AnimateUtil';

import { CSS_PREFIX } from '../../constants';
import { useMap } from '../../Hook/useMap';
import { DigitizeUtil } from '../../Util/DigitizeUtil';
import SelectFeaturesButton, { SelectFeaturesButtonProps } from '../SelectFeaturesButton/SelectFeaturesButton';

interface OwnProps {
  /**
   * The vector layer which will be used for digitize features.
   * The standard digitizeLayer can be retrieved via `DigitizeUtil.getDigitizeLayer(map)`.
   */
  digitizeLayer?: OlVectorLayer<OlVectorSource<OlGeometry>>;
  /**
   * Listener function for the 'select' event of the ol.interaction.Select
   * if in `Copy` mode.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-SelectEvent.html
   * for more information.
   */
  onFeatureCopy?: (event: OlSelectEvent) => void;
}

export type CopyButtonProps = OwnProps & Omit<SelectFeaturesButtonProps, 'layers'|'onFeatureSelect'|'featuresCollection'>;

// The class name for the component.
const defaultClassName = `${CSS_PREFIX}copybutton`;

const CopyButton: React.FC<CopyButtonProps> = ({
  className,
  onFeatureCopy,
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

  const onFeatureSelect = (event: OlSelectEvent) => {
    onFeatureCopy?.(event);

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
    onFeatureSelect={onFeatureSelect}
    className={finalClassName}
    clearAfterSelect={true}
    {...passThroughProps}
  />;

};

export default CopyButton;

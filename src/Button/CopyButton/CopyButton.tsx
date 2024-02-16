import AnimateUtil from '@terrestris/ol-util/dist/AnimateUtil/AnimateUtil';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import { SelectEvent as OlSelectEvent } from 'ol/interaction/Select';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import OlStyle from 'ol/style/Style';
import React, {
  useEffect,
  useState
} from 'react';

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
   * if in `Copy` mode.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-SelectEvent.html
   * for more information.
   */
  onFeatureCopy?: (event: OlSelectEvent) => void;
}

export type CopyButtonProps = OwnProps & Omit<SelectFeaturesButtonProps,
  'layers'|'onFeatureSelect'|'featuresCollection'>;

// The class name for the component.
const defaultClassName = `${CSS_PREFIX}copybutton`;

const CopyButton: React.FC<CopyButtonProps> = ({
  className,
  onFeatureCopy,
  digitizeLayer,
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

  const onFeatureSelect = (event: OlSelectEvent) => {
    onFeatureCopy?.(event);

    const feat = event.selected[0];

    if (!feat || !layers || !map) {
      return;
    }

    const copy = feat.clone();

    layers[0].getSource()?.addFeature(copy);

    AnimateUtil.moveFeature(
      map,
      layers[0],
      copy,
      500,
      50,
      layers[0].getStyle() as OlStyle
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

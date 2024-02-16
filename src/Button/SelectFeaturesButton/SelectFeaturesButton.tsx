import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import OlCollection from 'ol/Collection';
import * as OlEventConditions from 'ol/events/condition';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import OlInteractionSelect, { Options as OlSelectOptions, SelectEvent as OlSelectEvent } from 'ol/interaction/Select';
import OlVectorLayer from 'ol/layer/Vector';
import { unByKey } from 'ol/Observable';
import OlVectorSource from 'ol/source/Vector';
import { StyleLike as OlStyleLike } from 'ol/style/Style';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { CSS_PREFIX } from '../../constants';
import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';

interface OwnProps {
  /**
   * Select style of the selected features.
   */
  selectStyle?: OlStyleLike;
  /**
   * Additional configuration object to apply to the ol.interaction.Select.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-Select.html
   * for more information
   *
   * Note: The keys condition, hitTolerance and style are handled internally
   *       and shouldn't be overwritten without any specific cause.
   */
  selectInteractionConfig?: Omit<OlSelectOptions, 'condition'|'features'|'hitTolerance'|'style'|'layers'>;
  /**
   * The className which should be added.
   */
  className?: string;
  /**
   * Listener function for the 'select' event of the ol.interaction.Select
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select.html
   * for more information.
   */
  onFeatureSelect?: (event: OlSelectEvent) => void;
  /**
   * Array of layers the SelectFeaturesButton should operate on.
   */
  layers: OlVectorLayer<OlVectorSource>[];
  /**
   * Hit tolerance of the select action. Default: 5
   */
  hitTolerance?: number;
  /**
   * Clear the feature collection of the interaction after select. Default: false
   */
  clearAfterSelect?: boolean;
  /**
   * A feature collection to use.
   */
  featuresCollection?: OlCollection<OlFeature<OlGeometry>>;
}

export type SelectFeaturesButtonProps = OwnProps & Partial<ToggleButtonProps>;

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
  const [selectInteraction, setSelectInteraction] = useState<OlInteractionSelect>();
  const [features, setFeatures] = useState<OlCollection<OlFeature<OlGeometry>>|null>(null);

  const map = useMap();

  useEffect(() => {
    if (featuresCollection) {
      setFeatures(featuresCollection);
    } else {
      setFeatures(new OlCollection());
    }
  }, [featuresCollection]);

  useEffect(() => {
    if (!map || !features) {
      return undefined;
    }

    const newInteraction = new OlInteractionSelect({
      condition: OlEventConditions.singleClick,
      features,
      hitTolerance: hitTolerance,
      style: selectStyle ?? DigitizeUtil.DEFAULT_SELECT_STYLE,
      layers: layers,
      ...(selectInteractionConfig ?? {})
    });

    newInteraction.set('name', 'react-geo-select-interaction');
    newInteraction.setActive(false);
    map.addInteraction(newInteraction);

    setSelectInteraction(newInteraction);

    return () => {
      map.removeInteraction(newInteraction);
    };
  }, [features, layers, selectStyle, selectInteractionConfig, map, hitTolerance]);

  useEffect(() => {
    if (!selectInteraction || !features) {
      return undefined;
    }

    const key = selectInteraction.on('select', e => {
      if (clearAfterSelect) {
        features.clear();
      }
      onFeatureSelect?.(e);
    });

    return () => {
      unByKey(key);
    };
  }, [selectInteraction, features, onFeatureSelect, clearAfterSelect]);

  useEffect(() => {
    if (!selectInteraction) {
      return;
    }

    selectInteraction.setActive(!!pressed);

    if (!pressed) {
      selectInteraction.getFeatures().clear();
    }
  }, [selectInteraction, pressed]);

  if (!selectInteraction) {
    return null;
  }

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

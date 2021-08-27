import OlInteractionSelect, { Options as OlSelectOptions, SelectEvent as OlSelectEvent } from 'ol/interaction/Select';
import { StyleLike as OlStyleLike } from 'ol/style/Style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';
import { useEffect, useState } from 'react';
import { useMap } from '../..';
import * as OlEventConditions from 'ol/events/condition';
import { DigitizeUtil } from '../../Util/DigitizeUtil';
import { unByKey } from 'ol/Observable';
import { CSS_PREFIX } from '../../constants';
import * as React from 'react';

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
  selectInteractionConfig?: OlSelectOptions;
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
  layers: VectorLayer<VectorSource<Geometry>>[];
  /**
   * Hit tolerance of the select action. Default: 5
   */
  hitTolerance?: number;
}

export type SelectFeaturesButtonProps = OwnProps & ToggleButtonProps;

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
  ...passThroughProps
}) => {
  const [selectInteraction, setSelectInteraction] = useState<OlInteractionSelect>();

  const map = useMap();

  useEffect(() => {
    if (!map) {
      return undefined;
    }

    const selectInteractionName = 'react-geo-select-interaction';

    const newInteraction = new OlInteractionSelect({
      condition: OlEventConditions.singleClick,
      hitTolerance: hitTolerance,
      style: selectStyle ?? DigitizeUtil.DEFAULT_SELECT_STYLE,
      layers: layers,
      ...(selectInteractionConfig ?? {})
    });

    newInteraction.set('name', selectInteractionName);
    newInteraction.setActive(false);

    map.addInteraction(newInteraction);

    setSelectInteraction(newInteraction);

    return () => {
      map.removeInteraction(newInteraction);
    };
  }, [layers, selectStyle, selectInteractionConfig, map, hitTolerance]);

  useEffect(() => {
    if (!selectInteraction) {
      return undefined;
    }

    const key = selectInteraction.on('select', (e) => {
      onFeatureSelect?.(e);
    });

    return () => {
      unByKey(key);
    };
  }, [selectInteraction, onFeatureSelect]);

  const onToggleInternal = (pressed: boolean, lastClickEvt: any) => {
    selectInteraction.setActive(pressed);
    onToggle?.(pressed, lastClickEvt);
    selectInteraction.getFeatures().clear();
  };

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

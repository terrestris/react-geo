import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import OlCollection from 'ol/Collection';
import { singleClick } from 'ol/events/condition';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import Modify, { ModifyEvent, Options as ModifyOptions } from 'ol/interaction/Modify';
import { SelectEvent as OlSelectEvent } from 'ol/interaction/Select';
import Translate, { Options as TranslateOptions, TranslateEvent } from 'ol/interaction/Translate';
import OlVectorLayer from 'ol/layer/Vector';
import { unByKey } from 'ol/Observable';
import OlVectorSource from 'ol/source/Vector';
import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';

import { CSS_PREFIX } from '../../constants';
import { FeatureLabelModal } from '../../FeatureLabelModal/FeatureLabelModal';
import SelectFeaturesButton, { SelectFeaturesButtonProps } from '../SelectFeaturesButton/SelectFeaturesButton';

interface OwnProps {
  /**
   * Additional configuration object to apply to the ol.interaction.Modify.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Modify-Modify.html
   * for more information
   *
   * Note: The keys features, deleteCondition and style are handled internally
   *       and shouldn't be overwritten without any specific cause.
   */
  modifyInteractionConfig?: Omit<ModifyOptions, 'features'|'source'|'deleteCondition'|'style'>;
  /**
   * Additional configuration object to apply to the ol.interaction.Translate.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Translate-Translate.html
   * for more information
   *
   * Note: The key feature is handled internally and shouldn't be overwritten
   *       without any specific cause.
   */
  translateInteractionConfig?: Omit<TranslateOptions, 'features'|'layers'>;
  /**
   * The vector layer which will be used for digitize features.
   * The standard digitizeLayer can be retrieved via `DigitizeUtil.getDigitizeLayer(map)`.
   */
  digitizeLayer?: OlVectorLayer<OlVectorSource>;
  /**
   * Listener function for the 'modifystart' event of an ol.interaction.Modify.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Modify-ModifyEvent.html
   * for more information.
   */
  onModifyStart?: (event: ModifyEvent) => void;
  /**
   * Listener function for the 'modifyend' event of an ol.interaction.Modify.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Modify-ModifyEvent.html
   * for more information.
   */
  onModifyEnd?: (event: ModifyEvent) => void;
  /**
   * Listener function for the 'translatestart' event of an ol.interaction.Translate.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Translate-TranslateEvent.html
   * for more information.
   */
  onTranslateStart?: (event: TranslateEvent) => void;
  /**
   * Listener function for the 'qtranslateend' event of an ol.interaction.Translate.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Translate-TranslateEvent.html
   * for more information.
   */
  onTranslateEnd?: (event: TranslateEvent) => void;
  /**
   * Listener function for the 'translating' event of an ol.interaction.Translate.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Translate-TranslateEvent.html
   * for more information.
   */
  onTranslating?: (event: TranslateEvent) => void;
  /**
   * Callback function that will be called when the ok-button of the modal was clicked
   */
  onModalLabelOk?: (feature: OlFeature<OlGeometry>) => void;
  /**
   * Callback function that will be called
   * when the cancel-button of the modal was clicked
   */
  onModalLabelCancel?: () => void;
  /**
   * Maximal length of feature label.
   * If exceeded label will be divided into multiple lines. Optional.
   */
  maxLabelLineLength?: number;
  /**
   * Title for modal used for input of labels for digitize features.
   */
  modalPromptTitle?: string;
  /**
   * Text string for `OK` button of the modal.
   */
  modalPromptOkButtonText?: string;
  /**
   * Text string for `Cancel` button of the modal.
   */
  modalPromptCancelButtonText?: string;
  /**
   * Enable label editing via modal. Will open before being able to modify/translate feature. Default: `true`.
   */
  editLabel?: boolean;
}

export type ModifyButtonProps = OwnProps & Omit<SelectFeaturesButtonProps,
  'layers'|'onFeatureSelect'|'featuresCollection'>;

/**
 * The className added to this component.
 */
const defaultClassName = `${CSS_PREFIX}modifybutton`;

export const ModifyButton: React.FC<ModifyButtonProps> = ({
  className,
  onModifyStart,
  onModifyEnd,
  onTranslateStart,
  onTranslateEnd,
  onTranslating,
  digitizeLayer,
  selectStyle,
  modifyInteractionConfig,
  translateInteractionConfig,
  onModalLabelOk,
  onModalLabelCancel,
  onToggle,
  maxLabelLineLength,
  modalPromptTitle,
  modalPromptOkButtonText,
  modalPromptCancelButtonText,
  editLabel = true,
  ...passThroughProps
}) => {
  const [layers, setLayers] = useState<[OlVectorLayer<OlVectorSource>]|null>(null);
  const [modifyInteraction, setModifyInteraction] = useState<Modify|null>(null);
  const [translateInteraction, setTranslateInteraction] = useState<Translate|null>(null);
  const [features, setFeatures] = useState<OlCollection<OlFeature<OlGeometry>>|null>(null);

  const map = useMap();

  const [editLabelFeature, setEditLabelFeature] = useState<OlFeature<OlGeometry>|null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    setLayers([digitizeLayer ?? DigitizeUtil.getDigitizeLayer(map)]);
    setFeatures(new OlCollection());
  }, [map, digitizeLayer]);

  useEffect(() => {
    if (!map || !features) {
      return undefined;
    }

    const newTranslateInteraction = new Translate({
      features,
      ...translateInteractionConfig
    });
    newTranslateInteraction.set('name', 'react-geo-translate-interaction');
    newTranslateInteraction.setActive(false);

    map.addInteraction(newTranslateInteraction);
    setTranslateInteraction(newTranslateInteraction);

    const newModifyInteraction = new Modify({
      features,
      deleteCondition: singleClick,
      style: selectStyle ?? DigitizeUtil.DEFAULT_SELECT_STYLE,
      ...modifyInteractionConfig
    });
    newModifyInteraction.set('name', 'react-geo-modify-interaction');
    newModifyInteraction.setActive(false);

    map.addInteraction(newModifyInteraction);
    setModifyInteraction(newModifyInteraction);

    return () => {
      map.removeInteraction(newModifyInteraction);
      map.removeInteraction(newTranslateInteraction);
    };
  }, [selectStyle, modifyInteractionConfig, translateInteractionConfig, features, map]);

  useEffect(() => {
    if (!modifyInteraction) {
      return undefined;
    }

    const startKey = modifyInteraction.on('modifystart', e => {
      onModifyStart?.(e);
    });

    const endKey = modifyInteraction.on('modifyend', e => {
      onModifyEnd?.(e);
    });

    return () => {
      unByKey(startKey);
      unByKey(endKey);
    };
  }, [modifyInteraction, onModifyStart, onModifyEnd]);

  useEffect(() => {
    if (!translateInteraction) {
      return undefined;
    }

    const startKey = translateInteraction.on('translatestart', e => {
      onTranslateStart?.(e);
    });

    const endKey = translateInteraction.on('translateend', e => {
      onTranslateEnd?.(e);
    });

    const translatingKey = translateInteraction.on('translating', e => {
      onTranslating?.(e);
    });

    return () => {
      unByKey(startKey);
      unByKey(endKey);
      unByKey(translatingKey);
    };
  }, [translateInteraction, onTranslateStart, onTranslateEnd, onTranslating]);

  if (!layers || !features || !modifyInteraction || !translateInteraction) {
    return null;
  }

  const onToggleInternal = (pressed: boolean, lastClickEvent: any) => {
    modifyInteraction.setActive(pressed);
    translateInteraction.setActive(pressed);
    onToggle?.(pressed, lastClickEvent);
  };

  const onFeatureSelect = (event: OlSelectEvent) => {
    if (editLabel) {
      const labeled = event.selected.find(f => f.get('isLabel'));
      setEditLabelFeature(labeled || null);
    }
  };

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  const button = <SelectFeaturesButton
    layers={layers}
    selectStyle={selectStyle}
    className={finalClassName}
    onToggle={onToggleInternal}
    featuresCollection={features}
    clearAfterSelect={false}
    onFeatureSelect={onFeatureSelect}
    {...passThroughProps}
  />;

  let modal: ReactNode = null;
  if (editLabelFeature) {
    const onModalLabelOkInternal = () => {
      onModalLabelOk?.(editLabelFeature);
      setEditLabelFeature(null);
    };

    const onModalLabelCancelInternal = () => {
      onModalLabelCancel?.();
      setEditLabelFeature(null);
    };

    modal = <FeatureLabelModal
      onOk={onModalLabelOkInternal}
      onCancel={onModalLabelCancelInternal}
      title={modalPromptTitle}
      okText={modalPromptOkButtonText}
      cancelText={modalPromptCancelButtonText}
      maxLabelLineLength={maxLabelLineLength}
      feature={editLabelFeature}
    />;
  }

  if (!editLabel) {
    return button;
  } else {
    return <>
      {button}
      {modal}
    </>;
  }
};

export default ModifyButton;

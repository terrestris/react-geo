import { useModify, UseModifyProps } from '@terrestris/react-util/dist/hooks/useModify';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import { SelectEvent as OlSelectEvent } from 'ol/interaction/Select';
import * as React from 'react';
import {ReactNode, useCallback, useState} from 'react';

import { CSS_PREFIX } from '../../constants';
import { FeatureLabelModal } from '../../FeatureLabelModal/FeatureLabelModal';
import ToggleButton, {ToggleButtonProps} from "../ToggleButton/ToggleButton";

interface OwnProps {
  /**
   * The className which should be added.
   */
  className?: string;
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

export type ModifyButtonProps = OwnProps & Omit<UseModifyProps, ''> & Partial<ToggleButtonProps>;

/**
 * The className added to this component.
 */
const defaultClassName = `${CSS_PREFIX}modifybutton`;

export const ModifyButton: React.FC<ModifyButtonProps> = ({
  className,
  hitTolerance = 5,
  onModifyStart,
  onModifyEnd,
  onTranslateStart,
  onTranslateEnd,
  onTranslating,
  digitizeLayer,
  selectStyle,
  selectInteractionConfig,
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
  const [active, setActive] = useState<boolean>(false);
  const [editLabelFeature, setEditLabelFeature] = useState<OlFeature<OlGeometry>|null>(null);

  const onFeatureSelect = useCallback((event: OlSelectEvent) => {
    if (editLabel) {
      const labeled = event.selected.find(f => f.get('isLabel'));
      setEditLabelFeature(labeled || null);
    }
  }, [editLabel]);

  useModify({
    selectStyle,
    selectInteractionConfig,
    digitizeLayer,
    onModifyStart,
    onModifyEnd,
    onTranslateStart,
    onTranslateEnd,
    onTranslating,
    active,
    modifyInteractionConfig,
    translateInteractionConfig,
    onFeatureSelect,
    hitTolerance
  });

  const onToggleInternal = (pressed: boolean, lastClickEvent: any) => {
    setActive(pressed);
    onToggle?.(pressed, lastClickEvent);
  };

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  const btnWrapperClass = `${CSS_PREFIX}digitize-button-wrapper`;

  let modal: ReactNode = null;
  if (editLabelFeature) {
    const onModalLabelOkInternal = () => {
      onModalLabelOk?.(editLabelFeature);
      setEditLabelFeature(null);
    };

    const onModalLabelCancelInternal = () => {
      setActive(false);
      onModalLabelCancel?.();
    };

    modal = <FeatureLabelModal
      feature={editLabelFeature}
      onOk={onModalLabelOkInternal}
      onCancel={onModalLabelCancelInternal}
      title={modalPromptTitle}
      okText={modalPromptOkButtonText}
      cancelText={modalPromptCancelButtonText}
      maxLabelLineLength={maxLabelLineLength}
    />;
  }

  return (
    <span className={btnWrapperClass}>
      <ToggleButton
        onToggle={onToggleInternal}
        className={finalClassName}
        {...passThroughProps}
      />
      {
        modal
      }
    </span>
  );
};

export default ModifyButton;

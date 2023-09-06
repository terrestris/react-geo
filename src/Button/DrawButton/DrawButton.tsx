import { UseDrawProps, useDraw } from '@terrestris/react-util/dist/hooks/useDraw';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import {
  DrawEvent
} from 'ol/interaction/Draw';
import * as React from 'react';
import {ReactNode, useCallback, useState} from 'react';

import { CSS_PREFIX } from '../../constants';
import { FeatureLabelModal } from '../../FeatureLabelModal/FeatureLabelModal';
import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';

type ButtonDrawType = 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'Rectangle' | 'Text';

interface OwnProps {
  drawType: ButtonDrawType;
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
}

export type DrawButtonProps = OwnProps & Omit<UseDrawProps, 'drawType'|'active'> & Partial<ToggleButtonProps>;

/**
 * The className added to this component.
 */
const defaultClassName = `${CSS_PREFIX}drawbutton`;

/**
 * The DrawButton.
 */
const DrawButton: React.FC<DrawButtonProps> = ({
  className,
  digitizeLayer,
  drawInteractionConfig,
  drawStyle,
  drawType,
  maxLabelLineLength,
  modalPromptCancelButtonText = 'Cancel',
  modalPromptOkButtonText = 'Ok',
  modalPromptTitle = 'Label',
  onDrawEnd,
  onDrawStart,
  onModalLabelCancel,
  onModalLabelOk,
  onToggle,
  ...passThroughProps
}) => {
  const [active, setActive] = useState<boolean>(false);
  /**
   * Currently drawn feature which should be represent as label or postit.
   */
  const [digitizeTextFeature, setDigitizeTextFeature] = useState<OlFeature<OlGeometry> | null>(null);

  const onDrawEndInternal = useCallback((evt: DrawEvent) => {
    if (drawType === 'Text') {
        evt.feature.set('isLabel', true);
        setDigitizeTextFeature(evt.feature);
    }
    onDrawEnd?.(evt);
  }, [drawType, onDrawEnd]);

  useDraw({
    onDrawEnd: onDrawEndInternal,
    digitizeLayer,
    drawInteractionConfig,
    drawStyle,
    drawType: drawType == 'Text' ? 'Point' : drawType,
    onDrawStart,
    active
  });

  /**
   * Called when the draw button is toggled. If the button state is pressed,
   * the draw interaction will be activated.
   */
  const onToggleInternal = (pressed: boolean, lastClickEvent: any) => {
    setActive(pressed);
    onToggle?.(pressed, lastClickEvent);
  };

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  const btnWrapperClass = `${CSS_PREFIX}digitize-button-wrapper`;

  let modal: ReactNode = null;
  if (digitizeTextFeature) {
    const onModalLabelOkInternal = () => {
      onModalLabelOk?.(digitizeTextFeature);
      setDigitizeTextFeature(null);
    };

    const onModalLabelCancelInternal = () => {
      setActive(false);
      onModalLabelCancel?.();
    };

    modal = <FeatureLabelModal
      feature={digitizeTextFeature}
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

export default DrawButton;

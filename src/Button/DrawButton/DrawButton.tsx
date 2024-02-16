import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import { EventsKey } from 'ol/events';
import * as OlEventConditions from 'ol/events/condition';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import OlInteractionDraw, { createBox, DrawEvent as OlDrawEvent, Options as OlDrawOptions } from 'ol/interaction/Draw';
import OlVectorLayer from 'ol/layer/Vector';
import { unByKey } from 'ol/Observable';
import OlVectorSource from 'ol/source/Vector';
import { StyleLike as OlStyleLike } from 'ol/style/Style';
import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';

import { CSS_PREFIX } from '../../constants';
import { FeatureLabelModal } from '../../FeatureLabelModal/FeatureLabelModal';
import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';

type DrawType = 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'Rectangle' | 'Text';

interface OwnProps {
  /**
   * Whether the line, point, polygon, circle, rectangle or text shape should
   * be drawn.
   */
  drawType: DrawType;
  /**
   * Style object / style function for drawn feature.
   */
  drawStyle?: OlStyleLike;
  /**
   * Listener function for the 'drawend' event of an ol.interaction.Draw.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw-DrawEvent.html
   * for more information.
   */
  onDrawEnd?: (event: OlDrawEvent) => void;
  /**
   * Listener function for the 'drawstart' event of an ol.interaction.Draw.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw-DrawEvent.html
   * for more information.
   */
  onDrawStart?: (event: OlDrawEvent) => void;
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
   * The vector layer which will be used for digitize features.
   * The standard digitizeLayer can be retrieved via `DigitizeUtil.getDigitizeLayer(map)`.
   */
  digitizeLayer?: OlVectorLayer<OlVectorSource>;
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
   * Additional configuration object to apply to the ol.interaction.Draw.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw-Draw.html
   * for more information
   *
   * Note: The keys source, type, geometryFunction, style and freehandCondition
   *       are handled internally and shouldn't be overwritten without any
   *       specific cause.
   */
  drawInteractionConfig?: Omit<OlDrawOptions, 'source'|'type'|'geometryFunction'|'style'|'freehandCondition'>;
}

export type DrawButtonProps = OwnProps & Partial<ToggleButtonProps>;

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

  const [drawInteraction, setDrawInteraction] = useState<OlInteractionDraw>();
  const [layer, setLayer] = useState<OlVectorLayer<OlVectorSource> | null>(null);

  /**
   * Currently drawn feature which should be represented as label or post-it.
   */
  const [digitizeTextFeature, setDigitizeTextFeature] = useState<OlFeature<OlGeometry> | null>(null);

  const map = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }

    if (digitizeLayer) {
      setLayer(digitizeLayer);
    } else {
      setLayer(DigitizeUtil.getDigitizeLayer(map));
    }
  }, [map, digitizeLayer]);

  useEffect(() => {
    if (!map || !layer) {
      return undefined;
    }

    let geometryFunction;
    let type: 'Point' | 'Circle' | 'LineString' | 'Polygon';

    if (drawType === 'Rectangle') {
      geometryFunction = createBox();
      type = 'Circle';
    } else if (drawType === 'Text') {
      type = 'Point';
    } else {
      type = drawType;
    }

    const newInteraction = new OlInteractionDraw({
      source: layer.getSource() || undefined,
      type: type,
      geometryFunction: geometryFunction,
      style: drawStyle ?? DigitizeUtil.defaultDigitizeStyleFunction,
      freehandCondition: OlEventConditions.never,
      ...(drawInteractionConfig ?? {})
    });

    newInteraction.set('name', `react-geo-draw-interaction-${drawType}`);

    newInteraction.setActive(false);

    map.addInteraction(newInteraction);

    setDrawInteraction(newInteraction);

    let key: EventsKey;

    if (drawType === 'Text') {
      key = newInteraction.on('drawend', evt => {
        evt.feature.set('isLabel', true);
        setDigitizeTextFeature(evt.feature);
      });
    }

    return () => {
      unByKey(key);
      map.removeInteraction(newInteraction);
    };
  }, [drawType, layer, drawInteractionConfig, drawStyle, map]);

  useEffect(() => {
    if (!drawInteraction) {
      return undefined;
    }

    const endKey = drawInteraction.on('drawend', (evt) => {
      onDrawEnd?.(evt);
    });

    const startKey = drawInteraction.on('drawstart', (evt) => {
      onDrawStart?.(evt);
    });

    return () => {
      unByKey(startKey);
      unByKey(endKey);
    };
  }, [drawInteraction, onDrawStart, onDrawEnd]);

  if (!drawInteraction || !layer) {
    return null;
  }

  /**
   * Called when the draw button is toggled. If the button state is pressed,
   * the draw interaction will be activated.
   */
  const onToggleInternal = (pressed: boolean, lastClickEvent: any) => {
    drawInteraction.setActive(pressed);
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
      onModalLabelCancel?.();
      layer.getSource()?.removeFeature(digitizeTextFeature);
      setDigitizeTextFeature(null);
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
      {modal}
    </span>);
};

export default DrawButton;

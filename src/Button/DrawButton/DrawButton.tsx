import * as React from 'react';
import { useEffect, useState } from 'react';

import { Modal, Input } from 'antd';

const TextArea = Input.TextArea;

import { StyleLike as OlStyleLike } from 'ol/style/Style';
import OlInteractionDraw, { createBox, DrawEvent as OlDrawEvent, Options as OlDrawOptions } from 'ol/interaction/Draw';
import OlFeature from 'ol/Feature';
import * as OlEventConditions from 'ol/events/condition';
import { unByKey } from 'ol/Observable';
import OlVectorSource from 'ol/source/Vector';
import OlGeometry from 'ol/geom/Geometry';
import OlVectorLayer from 'ol/layer/Vector';

import StringUtil from '@terrestris/base-util/dist/StringUtil/StringUtil';

import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';
import { CSS_PREFIX } from '../../constants';
import { useMap } from '../../Hook/useMap';
import { DigitizeUtil } from '../../Util/DigitizeUtil';

interface DefaultProps {
  /**
   * Title for modal used for input of labels for digitize features.
   */
  modalPromptTitle: string;
  /**
   * Text string for `OK` button of the modal.
   */
  modalPromptOkButtonText: string;
  /**
   * Text string for `Cancel` button of the modal.
   */
  modalPromptCancelButtonText: string;
  /**
   * Additional configuration object to apply to the ol.interaction.Draw.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw-Draw.html
   * for more information
   *
   * Note: The keys source, type, geometryFunction, style and freehandCondition
   *       are handled internally and shouldn't be overwritten without any
   *       specific cause.
   */
  drawInteractionConfig: OlDrawOptions;
}

type DrawType = 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'Rectangle' | 'Text';

interface BaseProps {
  /**
   * The className which should be added.
   */
  className?: string;
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
  onModalLabelCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /**
   * Maximal length of feature label.
   * If exceeded label will be divided into multiple lines. Optional.
   */
  maxLabelLineLength?: number;
  /**
   * The vector layer which will be used for digitize features.
   * The standard digitizeLayer can be retrieved via `DigitizeUtil.getDigitizeLayer(map)`.
   */
  digitizeLayer?: OlVectorLayer<OlVectorSource<OlGeometry>>;
}

export type DrawButtonProps = BaseProps & Partial<DefaultProps> & ToggleButtonProps;

/**
 * The className added to this component.
 */
const defaultClassName = `${CSS_PREFIX}drawbutton`;

/**
 * The DrawButton.
 */
const DrawButton: React.FC<DrawButtonProps> = ({
  modalPromptTitle = 'Label',
  modalPromptOkButtonText = 'Ok',
  modalPromptCancelButtonText = 'Cancel',
  drawInteractionConfig,
  onToggle,
  className,
  drawType,
  onDrawEnd,
  onDrawStart,
  onModalLabelOk,
  onModalLabelCancel,
  maxLabelLineLength,
  digitizeLayer,
  drawStyle,
  ...passThroughProps
}) => {

  const [showLabelPrompt, setShowLabelPrompt] = useState<boolean>(false);
  const [textLabel, setTextLabel] = useState<string>('');
  const [drawInteraction, setDrawInteraction] = useState<OlInteractionDraw>();
  const [layer, setLayer] = useState<OlVectorLayer<OlVectorSource<OlGeometry>>>(null);

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
    let type = drawType;

    if (drawType === 'Rectangle') {
      geometryFunction = createBox();
      type = 'Circle';
    } else if (drawType === 'Text') {
      type = 'Point';
    }

    const newInteraction = new OlInteractionDraw({
      source: layer.getSource(),
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

    let key;

    if (drawType === 'Text') {
      key = newInteraction.on('drawend', evt => {
        setShowLabelPrompt(true);
        evt.feature.set('isLabel', true);
        setDigitizeTextFeature(evt.feature);
      });
    }

    return () => {
      unByKey(key);
      map.removeInteraction(newInteraction);
    }
  }, [drawType, layer, drawInteractionConfig, drawStyle, map]);

  useEffect(() => {
    if (!drawInteraction) {
      return undefined;
    }

    const keys = [];

    keys.push(drawInteraction.on('drawend', (evt) => {
      onDrawEnd?.(evt);
    }));

    keys.push(drawInteraction.on('drawstart', (evt) => {
      onDrawStart?.(evt);
    }));

    return () => {
      for (const key of keys) {
        unByKey(key);
      }
    };
  }, [drawInteraction, onDrawStart, onDrawEnd]);

  /**
   * Currently drawn feature which should be represent as label or postit.
   */
  const [digitizeTextFeature, setDigitizeTextFeature] = useState<OlFeature<OlGeometry>>(null);

  /**
   * Called when the digitize button is toggled. If the button state is pressed,
   * the appropriate draw, modify or select interaction will be created.
   * Otherwise, by untoggling, the same previously created interaction will be
   * removed from the map.
   *
   * @param pressed Whether the digitize button is pressed or not.
   * @param lastClickEvent
   */
  const onToggleInternal = (pressed: boolean, lastClickEvent: any) => {
    drawInteraction.setActive(pressed);
    onToggle?.(pressed, lastClickEvent);
  };

  /**
   * Callback function after `Ok` button of label input modal was clicked.
   * Turns visibility of modal off and call `setTextOnFeature` method.
   */
  const onModalLabelOkInternal = () => {
    setShowLabelPrompt(false);

    let label = textLabel;
    if (maxLabelLineLength) {
      label = StringUtil.stringDivider(
        textLabel, maxLabelLineLength, '\n'
      );
    }
    digitizeTextFeature.set('label', label);
    setTextLabel('');
    onModalLabelOk?.(digitizeTextFeature);
  };

  /**
   * Callback function after `Cancel` button of label input modal was clicked.
   * Turns visibility of modal off and removes last drawn feature from the
   * digitize layer.
   */
  const onModalLabelCancelInternal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowLabelPrompt(false);
    setTextLabel('');
    layer.getSource().removeFeature(digitizeTextFeature);
    onModalLabelCancel?.(event);
  };

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  const btnWrapperClass = `${CSS_PREFIX}digitize-button-wrapper`;

  return (
    <span className={btnWrapperClass}>
      <ToggleButton
        onToggle={onToggleInternal}
        className={finalClassName}
        {...passThroughProps}
      />
      {
        showLabelPrompt ?
          <Modal
            title={modalPromptTitle}
            okText={modalPromptOkButtonText}
            cancelText={modalPromptCancelButtonText}
            visible={showLabelPrompt}
            closable={false}
            onOk={onModalLabelOkInternal}
            onCancel={onModalLabelCancelInternal}
          >
            <TextArea
              value={textLabel}
              onChange={e => setTextLabel(e.target.value)}
              autoSize
            />
          </Modal>
          : null
      }
    </span>);
};

export default DrawButton;

import * as React from 'react';

import { Modal, Input } from 'antd';
const TextArea = Input.TextArea;

import OlMap from 'ol/Map';
import OlStyleStyle from 'ol/style/Style';
import OlInteractionDraw, { createBox } from 'ol/interaction/Draw';
import OlFeature from 'ol/Feature';
import * as OlEventConditions from 'ol/events/condition';
import OlGeometry from 'ol/geom/Geometry';

import _isFunction from 'lodash/isFunction';

import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import StringUtil from '@terrestris/base-util/dist/StringUtil/StringUtil';
import { CSS_PREFIX } from '../../constants';
import { DigitizeUtil } from '../../Util/DigitizeUtil';
import OlGeometryType from 'ol/geom/GeometryType';

interface DefaultProps {
  /**
   * Name of system vector layer which will be used for digitize features.
   */
  digitizeLayerName: string;
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
  drawInteractionConfig: any;
  /**
   * A custom onToogle function that will be called if button is toggled.
   */
  onToggle: (event: any) => void;
}

type DrawType = 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'Rectangle' | 'Text';

interface BaseProps {
  /**
   * The className which should be added.
   */
  className?: string;
  /**
   * Instance of OL map this component is bound to.
   */
  map: OlMap;
  /**
   * Whether the line, point, polygon, circle, rectangle or text shape should
   * be drawn.
   */
  drawType: DrawType;
  /**
   * Style object / style function for drawn feature.
   */
  drawStyle?: OlStyleStyle | ((feature: OlFeature<OlGeometry>) => OlStyleStyle);
  /**
   * Listener function for the 'drawend' event of an ol.interaction.Draw.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw-DrawEvent.html
   * for more information.
   */
  onDrawEnd?: (event: any) => void;
  /**
   * Listener function for the 'drawstart' event of an ol.interaction.Draw.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw-DrawEvent.html
   * for more information.
   */
  onDrawStart?: (event: any) => void;
  /**
   * Callback function that will be called when the ok-button of the modal was clicked
   */
  onModalLabelOk?: (event: any) => void;
  /**
   * Callback function that will be called
   * when the cancel-button of the modal was clicked
   */
  onModalLabelCancel?: (event: any) => void;
  /**
   * Maximal length of feature label.
   * If exceeded label will be divided into multiple lines. Optional.
   */
  maxLabelLineLength?: number;
}

interface DrawButtonState {
  showLabelPrompt: boolean;
  textLabel: string;
}

export type DrawButtonProps = BaseProps & Partial<DefaultProps> & ToggleButtonProps;

/**
 * The DrawButton.
 *
 * @class The DrawButton
 * @extends React.Component
 *
 */
class DrawButton extends React.Component<DrawButtonProps, DrawButtonState> {

  /**
   * The default properties.
   */
  static defaultProps: DefaultProps = {
    digitizeLayerName: 'react-geo_digitize',
    modalPromptTitle: 'Label',
    modalPromptOkButtonText: 'Ok',
    modalPromptCancelButtonText: 'Cancel',
    drawInteractionConfig: {},
    onToggle: () => undefined
  };

  /**
   * The className added to this component.
   *
   * @private
   */
  className = `${CSS_PREFIX}drawbutton`;

  /**
   * The layer used for the digitization.
   *
   * @private
   */
  _digitizeLayer = null;

  /**
   * Currently drawn feature which should be represent as label or postit.
   * @private
   */
  _digitizeTextFeature = null;

  /**
   * The draw interaction.
   * @private
   */
  _drawInteraction?: OlInteractionDraw;

  /**
   * Creates the DrawButton.
   *
   * @constructs DrawButton
   */
  constructor(props: DrawButtonProps) {
    super(props);

    this.state = {
      showLabelPrompt: false,
      textLabel: ''
    };
  }

  /**
   * `componentDidMount` method of the DrawButton.
   */
  componentDidMount() {
    const {
      digitizeLayerName,
      map,
      drawStyle
    } = this.props;

    this._digitizeLayer = DigitizeUtil.getDigitizeLayer(map, digitizeLayerName);

    if (drawStyle) {
      this._digitizeLayer.setStyle(drawStyle);
    }

    this.createDrawInteraction();
  }

  /**
   * Called on componentWillUnmount lifecycle.
   */
  componentWillUnmount() {
    const {
      map
    } = this.props;

    map.removeInteraction(this._drawInteraction);
  }

  /**
   * Called when the digitize button is toggled. If the button state is pressed,
   * the appropriate draw, modify or select interaction will be created.
   * Otherwise, by untoggling, the same previously created interaction will be
   * removed from the map.
   *
   * @param pressed Whether the digitize button is pressed or not.
   */
  onToggle = (pressed: boolean) => {
    this._drawInteraction.setActive(pressed);
    this.props.onToggle(pressed);
  };

  /**
   *
   * @return Function for drawEnd.
   */
  getOnDrawEnd() {
    return this.props.onDrawEnd;
  }

  /**
   *
   * @return Function for drawStart.
   */
  getOnDrawStart() {
    return this.props.onDrawStart;
  }

  /**
   * Creates a correctly configured OL draw interaction depending on given
   * drawType and adds this to the map.
   *
   * @param pressed Whether the digitize button is pressed or not.
   * Will be used to handle active state of the draw interaction.
   */
  createDrawInteraction = () => {
    const {
      drawType,
      drawStyle,
      map,
      drawInteractionConfig
    } = this.props;

    let geometryFunction;

    const drawInteractionName = `react-geo-draw-interaction-${drawType}`;
    let drawInteraction = MapUtil.getInteractionsByName(map, drawInteractionName)[0];

    if (!drawInteraction) {
      let type: OlGeometryType;

      if (drawType === 'Rectangle') {
        geometryFunction = createBox();
        type = OlGeometryType.CIRCLE;
      } else if (drawType === 'Text') {
        type = OlGeometryType.POINT;
      } else {
        type = drawType as OlGeometryType;
      }

      drawInteraction = new OlInteractionDraw({
        source: this._digitizeLayer.getSource(),
        type: type,
        geometryFunction: geometryFunction,
        style: drawStyle ?? DigitizeUtil.defaultDigitizeStyleFunction,
        freehandCondition: OlEventConditions.never,
        ...drawInteractionConfig
      });

      drawInteraction.set('name', drawInteractionName);

      if (drawType === 'Text') {
        drawInteraction.on('drawend', this.handleTextAdding);
      }

      drawInteraction.on('drawend', (evt) => {
        this.getOnDrawEnd()?.(evt);
      });

      drawInteraction.on('drawstart', (evt) => {
        this.getOnDrawStart()?.(evt);
      });

      drawInteraction.setActive(false);

      map.addInteraction(drawInteraction);
    }

    this._drawInteraction = drawInteraction;
  };

  /**
   * Changes state for showLabelPrompt to make modal for label input visible.
   *
   * @param evt Click event on adding feature to the digitize layer.
   *
   * @method
   */
  handleTextAdding = evt => {
    this.setState({
      showLabelPrompt: true
    });

    this._digitizeTextFeature = evt.feature;
    this._digitizeTextFeature.set('isLabel', true);
  };

  /**
   * Callback function after `Ok` button of label input modal was clicked.
   * Turns visibility of modal off and call `setTextOnFeature` method.
   */
  onModalLabelOk = () => {
    const {
      onModalLabelOk
    } = this.props;

    this.setState({
      showLabelPrompt: false
    }, () => {
      this.setTextOnFeature(this._digitizeTextFeature, onModalLabelOk);
    });
  };

  /**
   * Callback function after `Cancel` button of label input modal was clicked.
   * Turns visibility of modal off and removes last drawn feature from the
   * digitize layer.
   */
  onModalLabelCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const {
      onModalLabelCancel
    } = this.props;

    this.setState({
      showLabelPrompt: false,
      textLabel: ''
    }, () => {
      if (_isFunction(onModalLabelCancel)) {
        onModalLabelCancel(event);
      }
    });
  };

  /**
   * Sets formatted label on feature.
   * Calls `onModalLabelOk` callback function if provided.
   *
   * @param feature The point feature to be styled with label.
   * @param onModalOkCbk Optional callback function.
   */
  setTextOnFeature = (feature: OlFeature<OlGeometry>,
    onModalOkCbk: (feat: OlFeature<OlGeometry>, newLabel: string) => void) => {
    const {
      maxLabelLineLength
    } = this.props;

    const {
      textLabel
    } = this.state;

    let label = textLabel;
    if (maxLabelLineLength) {
      label = StringUtil.stringDivider(
        textLabel, maxLabelLineLength, '\n'
      );
    }
    feature.set('label', label);
    this.setState({
      textLabel: ''
    }, () => {
      if (_isFunction(onModalOkCbk)) {
        onModalOkCbk(feature, label);
      }
    });
  };

  /**
   * Called if label input field value was changed. Updates state value for
   * textLabel.
   *
   * @param evt Input event containing new text value to be set as
   * textLabel.
   */
  onLabelChange = evt => {
    this.setState({
      textLabel: evt.target.value
    });
  };

  /**
   * The render function.
   */
  render() {
    const {
      className,
      map,
      drawType,
      digitizeLayerName,
      drawStyle,
      modalPromptTitle,
      modalPromptOkButtonText,
      modalPromptCancelButtonText,
      onDrawStart,
      onDrawEnd,
      drawInteractionConfig,
      onToggle,
      onModalLabelOk,
      onModalLabelCancel,
      maxLabelLineLength,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    const btnWrapperClass = `${CSS_PREFIX}digitize-button-wrapper`;

    return (
      <span className={btnWrapperClass}>
        <ToggleButton
          onToggle={this.onToggle}
          className={finalClassName}
          {...passThroughProps}
        />
        {
          this.state.showLabelPrompt ?
            <Modal
              title={modalPromptTitle}
              okText={modalPromptOkButtonText}
              cancelText={modalPromptCancelButtonText}
              visible={this.state.showLabelPrompt}
              closable={false}
              onOk={this.onModalLabelOk}
              onCancel={this.onModalLabelCancel}
            >
              <TextArea
                value={this.state.textLabel}
                onChange={this.onLabelChange}
                autoSize
              />
            </Modal>
            : null
        }
      </span>
    );
  }
}

export default DrawButton;

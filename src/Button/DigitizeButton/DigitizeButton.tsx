import * as React from 'react';

import { Modal, Input } from 'antd';
const TextArea = Input.TextArea;

import OlMap from 'ol/Map';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlCollection from 'ol/Collection';
import OlStyleStyle from 'ol/style/Style';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleFill from 'ol/style/Fill';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleText from 'ol/style/Text';
import OlInteractionDraw, { createBox, DrawEvent as OlDrawEvent} from 'ol/interaction/Draw';
import OlInteractionSelect, { SelectEvent as OlSelectEvent } from 'ol/interaction/Select';
import OlInteractionModify, { ModifyEvent as OlModifyEvent } from 'ol/interaction/Modify';
import OlInteractionTranslate, { TranslateEvent as OlTranslateEvent } from 'ol/interaction/Translate';
import OlFeature from 'ol/Feature';
import * as OlEventConditions from 'ol/events/condition';
import OlGeometry from 'ol/geom/Geometry';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';

import _isFunction from 'lodash/isFunction';
import _isArray from 'lodash/isArray';

import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import StringUtil from '@terrestris/base-util/dist/StringUtil/StringUtil';
import AnimateUtil from '@terrestris/ol-util/dist/AnimateUtil/AnimateUtil';
import Logger from '@terrestris/base-util/dist/Logger';

import { CSS_PREFIX } from '../../constants';
import { ChangeEvent } from 'react';
import RenderFeature from 'ol/render/Feature';

interface DefaultProps {
  /**
   * Name of system vector layer which will be used for digitize features.
   */
  digitizeLayerName: string;
  /**
   * Fill color of selected digitize feature.
   */
  selectFillColor: string;
  /**
   * Stroke color of selected digitize feature.
   */
  selectStrokeColor: string;
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
   * Additional configuration object to apply to the ol.interaction.Select.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-Select.html
   * for more information
   *
   * Note: The keys condition, hitTolerance and style are handled internally
   *       and shouldn't be overwritten without any specific cause.
   */
  selectInteractionConfig: any;
  /**
   * Additional configuration object to apply to the ol.interaction.Modify.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Modify-Modify.html
   * for more information
   *
   * Note: The keys features, deleteCondition and style are handled internally
   *       and shouldn't be overwritten without any specific cause.
   */
  modifyInteractionConfig: any;
  /**
   * Additional configuration object to apply to the ol.interaction.Translate.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Translate-Translate.html
   * for more information
   *
   * Note: The key feature is handled internally and shouldn't be overwritten
   *       without any specific cause.
   */
  translateInteractionConfig: any;
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
  drawType?: DrawType;
  /**
   * Whether the digitize feature should be deleted, copied or modified.
   * be drawn.
   */
  editType?: 'Copy' | 'Edit' | 'Delete';
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
   * Listener function for the 'modifystart' event of an ol.interaction.Modify.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Modify-ModifyEvent.html
   * for more information.
   */
  onModifyStart?: (event: any) => void;
  /**
   * Listener function for the 'modifyend' event of an ol.interaction.Modify.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Modify-ModifyEvent.html
   * for more information.
   */
  onModifyEnd?: (event: any) => void;
  /**
   * Listener function for the 'translatestart' event of an ol.interaction.Translate.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Translate-TranslateEvent.html
   * for more information.
   */
  onTranslateStart?: (event: any) => void;
  /**
   * Listener function for the 'translateend' event of an ol.interaction.Translate.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Translate-TranslateEvent.html
   * for more information.
   */
  onTranslateEnd?: (event: any) => void;
  /**
   * Listener function for the 'translating' event of an ol.interaction.Translate.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Translate-TranslateEvent.html
   * for more information.
   */
  onTranslating?: (event: any) => void;
  /**
   * Listener function for the 'select' event of the ol.interaction.Select
   * if in `Delete` mode.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-SelectEvent.html
   * for more information.
   */
  onFeatureRemove?: (event: any) => void;
  /**
   * Listener function for the 'select' event of the ol.interaction.Select
   * if in `Copy` mode.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-SelectEvent.html
   * for more information.
   */
  onFeatureCopy?: (event: any) => void;
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
   * Listener function for the 'select' event of the ol.interaction.Select
   * if in `Edit` mode.
   * Can be also called inside of 'select' listener function of
   * the ol.interaction.Select in `Copy` and `Delete` mode if provided.
   * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select.html
   * for more information.
   */
  onFeatureSelect?: (event: any) => void;
  /**
   * Maximal length of feature label.
   * If exceeded label will be divided into multiple lines. Optional.
   */
  maxLabelLineLength?: number;
}

interface DigitizeButtonState {
  showLabelPrompt: boolean;
  textLabel: string;
}

export type DigitizeButtonProps = BaseProps & Partial<DefaultProps> & ToggleButtonProps;

/**
 * The DigitizeButton.
 *
 * **Note: The `DigitizeButton` is deprecated and might be removed in future versions.**
 *
 * Please make use of the [DrawButton](/#/Components/Buttons/DrawButton),
 * [ModifyButton](/#/Components/Buttons/ModifyButton), [DeleteButton](/#/Components/Buttons/DeleteButton),
 * [CopyButton](/#/Components/Buttons/CopyButton) components instead.
 *
 * @deprecated
 */
class DigitizeButton extends React.Component<DigitizeButtonProps, DigitizeButtonState> {
  /**
   * Name of point draw type.
   * @private
   */
  static POINT_DRAW_TYPE = 'Point';

  /**
   * Name of line string draw type.
   * @private
   */
  static LINESTRING_DRAW_TYPE = 'LineString';

  /**
   * Name of polygon draw type.
   * @private
   */
  static POLYGON_DRAW_TYPE = 'Polygon';

  /**
   * Name of circle draw type.
   * @private
   */
  static CIRCLE_DRAW_TYPE = 'Circle';

  /**
   * Name of rectangle draw type.
   * @private
   */
  static RECTANGLE_DRAW_TYPE = 'Rectangle';

  /**
   * Name of text draw type.
   * @private
   */
  static TEXT_DRAW_TYPE = 'Text';

  /**
   * Name of copy edit type.
   * @private
   */
  static COPY_EDIT_TYPE = 'Copy';

  /**
   * Name of edit edit type.
   * @private
   */
  static EDIT_EDIT_TYPE = 'Edit';

  /**
   * Name of delete edit type.
   * @private
   */
  static DELETE_EDIT_TYPE = 'Delete';

  /**
   * Default fill color used in style object of drawn features.
   */
  static DEFAULT_FILL_COLOR = 'rgba(154, 26, 56, 0.5)';

  /**
   * Default stroke color used in style object of drawn features.
   */
  static DEFAULT_STROKE_COLOR = 'rgba(154, 26, 56, 0.8)';

  /**
   * Hit detection in pixels used for select interaction.
   */
  static HIT_TOLERANCE = 5;

  /**
   * Default style for digitized points.
   */
  static DEFAULT_POINT_STYLE = new OlStyleStyle({
    image: new OlStyleCircle({
      radius: 7,
      fill: new OlStyleFill({
        color: DigitizeButton.DEFAULT_FILL_COLOR
      }),
      stroke: new OlStyleStroke({
        color: DigitizeButton.DEFAULT_STROKE_COLOR
      })
    })
  });

  /**
   * Default style for digitized lines.
   */
  static DEFAULT_LINESTRING_STYLE = new OlStyleStyle({
    stroke: new OlStyleStroke({
      color: DigitizeButton.DEFAULT_STROKE_COLOR,
      width: 2
    })
  });

  /**
   * Default style for digitized polygons or circles.
   */
  static DEFAULT_POLYGON_STYLE = new OlStyleStyle({
    fill: new OlStyleFill({
      color: DigitizeButton.DEFAULT_FILL_COLOR
    }),
    stroke: new OlStyleStroke({
      color: DigitizeButton.DEFAULT_STROKE_COLOR,
      width: 2
    })
  });

  /**
   * Default style for digitized labels.
   */
  static DEFAULT_TEXT_STYLE = new OlStyleStyle({
    text: new OlStyleText({
      text: '',
      offsetX: 5,
      offsetY: 5,
      font: '12px sans-serif',
      fill: new OlStyleFill({
        color: DigitizeButton.DEFAULT_FILL_COLOR
      }),
      stroke: new OlStyleStroke({
        color: DigitizeButton.DEFAULT_STROKE_COLOR
      })
    })
  });

  /**
   * The default properties.
   */
  static defaultProps: DefaultProps = {
    digitizeLayerName: 'react-geo_digitize',
    selectFillColor: 'rgba(240, 240, 90, 0.5)',
    selectStrokeColor: 'rgba(220, 120, 20, 0.8)',
    modalPromptTitle: 'Label',
    modalPromptOkButtonText: 'Ok',
    modalPromptCancelButtonText: 'Cancel',
    drawInteractionConfig: {},
    selectInteractionConfig: {},
    modifyInteractionConfig: {},
    translateInteractionConfig: {},
    onToggle: () => undefined
  };

  /**
   * The className added to this component.
   *
   * @private
   */
  className = `${CSS_PREFIX}digitizebutton`;

  /**
   * Currently existing digitize features as collection.
   *
   * @private
   */
  _digitizeFeatures: OlCollection<OlFeature<OlGeometry>> | null = null;

  /**
   * The layer used for the digitization.
   *
   * @private
   */
  _digitizeLayer: OlLayerVector<OlSourceVector<OlGeometry>> | null = null;

  /**
   * Currently drawn feature which should be represent as label or postit.
   * @private
   */
  _digitizeTextFeature: OlFeature<OlGeometry> | null = null;

  /**
   * The draw interaction.
   * @private
   */
  _drawInteraction?: OlInteractionDraw;

  /**
   * The select interaction.
   * @private
   */
  _selectInteraction?: OlInteractionSelect;

  /**
   * The modify interaction.
   * @private
   */
  _modifyInteraction?: OlInteractionModify;

  /**
   * The translate interaction.
   * @private
   */
  _translateInteraction?: OlInteractionTranslate;

  /**
   * Creates the DigitizeButton.
   *
   * @constructs DigitizeButton
   */
  constructor(props: DigitizeButtonProps) {
    super(props);

    if (!props.drawType && !props.editType) {
      Logger.warn('Neither "drawType" nor "editType" was provided. Digitize ' +
        'button won\'t work properly!');
    }

    this.state = {
      showLabelPrompt: false,
      textLabel: ''
    };
  }

  /**
   * `componentDidMount` method of the DigitizeButton.
   */
  componentDidMount() {
    this.createDigitizeLayer();

    this.createDrawInteraction();
    this.createSelectInteraction();
    this.createModifyInteraction();
    this.createTranslateInteraction();
  }

  /**
   * Called on componentWillUnmount lifecycle.
   */
  componentWillUnmount() {
    const {
      map
    } = this.props;

    if (this._drawInteraction) {
      map.removeInteraction(this._drawInteraction);
    }

    if (this._selectInteraction) {
      map.removeInteraction(this._selectInteraction);
    }

    if (this._modifyInteraction) {
      map.removeInteraction(this._modifyInteraction);
    }

    if (this._translateInteraction) {
      map.removeInteraction(this._translateInteraction);
    }

    map.un('pointermove', this.onPointerMove);
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
    const {
      map,
      drawType,
      editType,
    } = this.props;

    if (drawType) {
      if (this._drawInteraction) {
        this._drawInteraction.setActive(pressed);
      }
    } else if (editType) {
      if (this._selectInteraction) {
        this._selectInteraction.setActive(pressed);
      }
      if (this._modifyInteraction) {
        this._modifyInteraction.setActive(pressed);
      }
      if (this._translateInteraction) {
        this._translateInteraction.setActive(pressed);
      }

      if (pressed) {
        map.on('pointermove', this.onPointerMove);
      } else {
        map.un('pointermove', this.onPointerMove);
      }
    }

    this.props.onToggle?.(pressed);
  };

  /**
   * Creates digitize vector layer and adds this to the map.
   */
  createDigitizeLayer = () => {
    const {
      digitizeLayerName,
      map
    } = this.props;

    let digitizeLayer = digitizeLayerName ?
      MapUtil.getLayerByName(map, digitizeLayerName) as OlLayerVector<OlSourceVector<OlGeometry>> :
      null;

    if (digitizeLayer == null) {
      digitizeLayer = new OlLayerVector({
        source: new OlSourceVector({
          features: new OlCollection()
        })
      });

      digitizeLayer.set('name', digitizeLayerName);

      map.addLayer(digitizeLayer);
    }

    digitizeLayer.setStyle(this.digitizeStyleFunction);

    this._digitizeLayer = digitizeLayer;

    this._digitizeFeatures = digitizeLayer.getSource()?.getFeaturesCollection() ?? null;
  };

  /**
   * The styling function for the digitize vector layer, which considers
   * different geometry types of drawn features.
   *
   * @param feature The feature which is being styled.
   * @return The style to use.
   */
  digitizeStyleFunction = (feature: OlFeature<OlGeometry>|RenderFeature) => {
    const {
      drawStyle,
    } = this.props;

    if (feature instanceof RenderFeature) {
      return;
    }

    const geometry = feature.getGeometry();
    if (!geometry) {
      return;
    }

    if (drawStyle) {
      return _isFunction(drawStyle) ? drawStyle(feature) : drawStyle;
    }

    switch (geometry.getType()) {
      case DigitizeButton.POINT_DRAW_TYPE: {
        if (!feature.get('isLabel')) {
          return new OlStyleStyle({
            image: new OlStyleCircle({
              radius: 7,
              fill: new OlStyleFill({
                color: DigitizeButton.DEFAULT_FILL_COLOR
              }),
              stroke: new OlStyleStroke({
                color: DigitizeButton.DEFAULT_STROKE_COLOR
              })
            })
          });
        } else {
          return new OlStyleStyle({
            text: new OlStyleText({
              text: feature.get('label'),
              offsetX: 5,
              offsetY: 5,
              font: '12px sans-serif',
              fill: new OlStyleFill({
                color: DigitizeButton.DEFAULT_FILL_COLOR
              }),
              stroke: new OlStyleStroke({
                color: DigitizeButton.DEFAULT_STROKE_COLOR
              })
            })
          });
        }
      }
      case DigitizeButton.LINESTRING_DRAW_TYPE: {
        return new OlStyleStyle({
          stroke: new OlStyleStroke({
            color: DigitizeButton.DEFAULT_STROKE_COLOR,
            width: 2
          })
        });
      }
      case DigitizeButton.POLYGON_DRAW_TYPE:
      case DigitizeButton.CIRCLE_DRAW_TYPE: {
        return new OlStyleStyle({
          fill: new OlStyleFill({
            color: DigitizeButton.DEFAULT_FILL_COLOR
          }),
          stroke: new OlStyleStroke({
            color: DigitizeButton.DEFAULT_STROKE_COLOR,
            width: 2
          })
        });
      }
      default:
        return undefined;
    }
  };

  /**
   * The OL style for selected digitized features.
   *
   * @param feature The selected feature.
   * @param res resolution.
   * @param text Text for labeled feature (optional).
   * @return The style to use.
   */
  selectedStyleFunction = (feature: OlFeature<OlGeometry>, res: number, text: string) => {
    const {
      selectFillColor,
      selectStrokeColor
    } = this.props;

    if (feature.get('label')) {
      text = feature.get('label');
    }

    return new OlStyleStyle({
      image: new OlStyleCircle({
        radius: 7,
        fill: new OlStyleFill({
          color: selectFillColor
        }),
        stroke: new OlStyleStroke({
          color: selectStrokeColor
        })
      }),
      text: new OlStyleText({
        text: text ? text : '',
        offsetX: 5,
        offsetY: 5,
        font: '12px sans-serif',
        fill: new OlStyleFill({
          color: selectFillColor
        }),
        stroke: new OlStyleStroke({
          color: selectStrokeColor
        })
      }),
      stroke: new OlStyleStroke({
        color: selectStrokeColor,
        width: 2
      }),
      fill: new OlStyleFill({
        color: selectFillColor
      })
    });
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
   */
  createDrawInteraction = () => {
    const {
      drawType,
      map,
      drawInteractionConfig
    } = this.props;

    let geometryFunction;

    if (!drawType || !this._digitizeLayer) {
      return;
    }

    const drawInteractionName = `react-geo-draw-interaction-${drawType}`;
    let drawInteraction = MapUtil.getInteractionsByName(map, drawInteractionName)[0] as OlInteractionDraw;

    if (!drawInteraction) {
      let type = drawType;

      if (drawType === DigitizeButton.RECTANGLE_DRAW_TYPE) {
        geometryFunction = createBox();
        type = DigitizeButton.CIRCLE_DRAW_TYPE as DrawType;
      } else if (drawType === DigitizeButton.TEXT_DRAW_TYPE) {
        type = DigitizeButton.POINT_DRAW_TYPE as DrawType;
      }

      drawInteraction = new OlInteractionDraw({
        source: this._digitizeLayer.getSource(),
        type: type,
        geometryFunction: geometryFunction,
        style: this.digitizeStyleFunction,
        freehandCondition: OlEventConditions.never,
        ...drawInteractionConfig
      });

      drawInteraction.set('name', drawInteractionName);

      if (drawType === DigitizeButton.TEXT_DRAW_TYPE) {
        drawInteraction.on('drawend', this.handleTextAdding);
      }

      drawInteraction.on('drawend', (evt: OlDrawEvent) => {
        this.getOnDrawEnd()?.(evt);
      });

      drawInteraction.on('drawstart', (evt: OlDrawEvent) => {
        this.getOnDrawStart()?.(evt);
      });

      drawInteraction.setActive(false);

      map.addInteraction(drawInteraction);
    }

    this._drawInteraction = drawInteraction;
  };

  /**
   * Creates a correctly configured OL select and/or modify and/or translate
   * interaction(s) depending on given editType and adds this/these to the map.
   */
  createSelectInteraction = () => {
    const {
      editType,
      map,
      selectInteractionConfig,
      onFeatureSelect
    } = this.props;

    if (!editType) {
      return;
    }

    const selectInteractionName = `react-geo-select-interaction-${editType}`;
    let selectInteraction = MapUtil.getInteractionsByName(map, selectInteractionName)[0] as OlInteractionSelect;

    if (!selectInteraction) {
      selectInteraction = new OlInteractionSelect({
        condition: OlEventConditions.singleClick,
        hitTolerance: DigitizeButton.HIT_TOLERANCE,
        style: this.selectedStyleFunction,
        ...selectInteractionConfig
      });

      selectInteraction.set('name', selectInteractionName);

      selectInteraction.setActive(false);

      map.addInteraction(selectInteraction);
    }

    this._selectInteraction = selectInteraction;

    if (editType === DigitizeButton.DELETE_EDIT_TYPE) {
      this._selectInteraction.on('select', this.onFeatureRemove);
    } else if (editType === DigitizeButton.COPY_EDIT_TYPE) {
      this._selectInteraction.on('select', this.onFeatureCopy);
    }

    if (_isFunction(onFeatureSelect) && editType === DigitizeButton.EDIT_EDIT_TYPE) {
      this._selectInteraction.on('select', onFeatureSelect);
    }
  };

  /**
   *
   */
  createModifyInteraction = () => {
    const {
      editType,
      map,
      modifyInteractionConfig,
    } = this.props;

    if (!editType || editType !== DigitizeButton.EDIT_EDIT_TYPE || !this._selectInteraction) {
      return;
    }

    const modifyInteractionName = `react-geo-modify-interaction-${editType}`;
    let modifyInteraction = MapUtil.getInteractionsByName(map, modifyInteractionName)[0] as OlInteractionModify;

    if (!modifyInteraction) {
      modifyInteraction = new OlInteractionModify({
        features: this._selectInteraction.getFeatures(),
        deleteCondition: OlEventConditions.singleClick,
        style: this.selectedStyleFunction,
        ...modifyInteractionConfig
      });

      modifyInteraction.set('name', modifyInteractionName);

      modifyInteraction.on('modifystart', this.onModifyStart);
      modifyInteraction.on('modifyend', this.onModifyEnd);

      modifyInteraction.setActive(false);

      map.addInteraction(modifyInteraction);
    }

    this._modifyInteraction = modifyInteraction;
  };

  /**
   *
   */
  createTranslateInteraction = () => {
    const {
      editType,
      map,
      translateInteractionConfig
    } = this.props;

    if (!editType || editType !== DigitizeButton.EDIT_EDIT_TYPE || !this._selectInteraction) {
      return;
    }

    const translateInteractionName = `react-geo-translate-interaction-${editType}`;
    let translateInteraction =
      MapUtil.getInteractionsByName(map, translateInteractionName)[0] as OlInteractionTranslate;

    if (!translateInteraction) {
      translateInteraction = new OlInteractionTranslate({
        features: this._selectInteraction.getFeatures(),
        ...translateInteractionConfig
      });

      translateInteraction.set('name', translateInteractionName);

      translateInteraction.on('translatestart', this.onTranslateStart);
      translateInteraction.on('translateend', this.onTranslateEnd);
      translateInteraction.on('translating', this.onTranslating);

      translateInteraction.setActive(false);

      map.addInteraction(translateInteraction);
    }

    this._translateInteraction = translateInteraction;
  };

  /**
   * Listener for `select` event of OL select interaction in `Delete` mode.
   * Removes selected feature from the vector source and map.
   *
   * @param evt The interaction event.
   */
  onFeatureRemove = (evt: OlSelectEvent) => {
    const {
      onFeatureRemove,
      onFeatureSelect
    } = this.props;

    if (_isFunction(onFeatureSelect)) {
      onFeatureSelect(evt);
    }

    const feat = evt.selected[0];

    if (this._selectInteraction) {
      this._selectInteraction.getFeatures().remove(feat);
    }

    if (this._digitizeLayer) {
      this._digitizeLayer.getSource()?.removeFeature(feat);
    }

    if (_isFunction(onFeatureRemove)) {
      onFeatureRemove(evt);
    }

    this.props.map.renderSync();
  };

  /**
   * Listener for `select` event of OL select interaction in `Copy` mode.
   * Creates a clone of selected feature and calls utility method to move it
   * beside the original to avoid overlapping.
   *
   * @param evt The interaction event.
   */
  onFeatureCopy = (evt: OlSelectEvent) => {
    const {
      map,
      onFeatureCopy,
      onFeatureSelect
    } = this.props;

    const feat = evt.selected[0];

    if (!feat || !this._digitizeFeatures || !this._digitizeLayer) {
      return;
    }

    if (_isFunction(onFeatureCopy)) {
      onFeatureCopy(evt);
    }

    if (_isFunction(onFeatureSelect)) {
      onFeatureSelect(evt);
    }

    const copy = feat.clone();

    copy.setStyle(this.digitizeStyleFunction);

    this._digitizeFeatures.push(copy);

    AnimateUtil.moveFeature(
      map,
      this._digitizeLayer,
      copy,
      500,
      50,
      this.digitizeStyleFunction(feat)
    );
  };

  /**
   * Checks if a labeled feature is being modified. If yes, opens prompt to
   * input a new label.
   *
   * @param evt The interaction event.
   */
  onModifyStart = (evt: OlModifyEvent) => {
    const {
      onModifyStart
    } = this.props;

    if (_isFunction(onModifyStart)) {
      onModifyStart(evt);
    }

    const feature = evt.features.getArray()[0] as OlFeature<OlGeometry>;

    if (feature.get('isLabel')) {
      this._digitizeTextFeature = feature;
      let textLabel: string | string[] = '';

      const featureStyle = this.digitizeStyleFunction(feature);

      if (featureStyle && featureStyle.getText()) {
        textLabel = featureStyle.getText().getText() ?? '';
      } else if (feature.get('label')) {
        textLabel = feature.get('label');
      }

      this.setState({
        showLabelPrompt: true,
        textLabel: _isArray(textLabel) ? textLabel.join(' ') : textLabel
      });
    }
  };

  /**
   * Called on modifyend of the ol.interaction.Modify.
   *
   * @param evt The interaction event.
   */
  onModifyEnd = (evt: OlModifyEvent) => {
    const {
      onModifyEnd
    } = this.props;

    if (_isFunction(onModifyEnd)) {
      onModifyEnd(evt);
    }
  };

  /**
   * Called on translatestart of the ol.interaction.Translate.
   *
   * @param evt The interaction event.
   */
  onTranslateStart = (evt: OlTranslateEvent) => {
    const {
      onTranslateStart
    } = this.props;

    if (_isFunction(onTranslateStart)) {
      onTranslateStart(evt);
    }
  };

  /**
   * Called on translateend of the ol.interaction.Translate.
   *
   * @param evt The interaction event.
   */
  onTranslateEnd = (evt: OlTranslateEvent) => {
    const {
      onTranslateEnd
    } = this.props;

    if (_isFunction(onTranslateEnd)) {
      onTranslateEnd(evt);
    }
  };

  /**
   * Called on translating of the ol.interaction.Translate.
   *
   * @param evt The interaction event.
   */
  onTranslating = (evt: OlTranslateEvent) => {
    const {
      onTranslating
    } = this.props;

    if (_isFunction(onTranslating)) {
      onTranslating(evt);
    }
  };

  /**
   * Changes state for showLabelPrompt to make modal for label input visible.
   *
   * @param evt Click event on adding feature to the digitize layer.
   *
   * @method
   */
  handleTextAdding = (evt: OlDrawEvent) => {
    this.setState({
      showLabelPrompt: true
    });

    this._digitizeTextFeature = evt.feature as OlFeature<OlGeometry>;
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
      if (this._digitizeTextFeature && onModalLabelOk) {
        this.setTextOnFeature(this._digitizeTextFeature, onModalLabelOk);
      }
    });
  };

  /**
   * Callback function after `Cancel` button of label input modal was clicked.
   * Turns visibility of modal off and removes last drawn feature from the
   * digitize layer.
   */
  onModalLabelCancel = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
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
  onLabelChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      textLabel: evt.target.value
    });
  };

  /**
   * Sets the cursor to `pointer` if the pointer enters a non-oqaque pixel of
   * a hoverable layer.
   *
   * @param evt The `pointermove` event.
   */
  onPointerMove = (evt: OlMapBrowserEvent<PointerEvent>) => {
    if (evt.dragging) {
      return;
    }

    const {
      map,
      digitizeLayerName
    } = this.props;

    const pixel = map.getEventPixel(evt.originalEvent);

    const hit = map.hasFeatureAtPixel(pixel, {
      layerFilter: (l) => {
        return l.get('name') === digitizeLayerName;
      },
      hitTolerance: DigitizeButton.HIT_TOLERANCE
    });

    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  };

  /**
   * The render function.
   */
  render() {
    const {
      className,
      map,
      drawType,
      editType,
      digitizeLayerName,
      drawStyle,
      selectFillColor,
      selectStrokeColor,
      modalPromptTitle,
      modalPromptOkButtonText,
      modalPromptCancelButtonText,
      onDrawStart,
      onDrawEnd,
      onModifyStart,
      onModifyEnd,
      onTranslateStart,
      onTranslateEnd,
      onTranslating,
      onFeatureRemove,
      onFeatureCopy,
      onFeatureSelect,
      drawInteractionConfig,
      selectInteractionConfig,
      modifyInteractionConfig,
      translateInteractionConfig,
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

export default DigitizeButton;

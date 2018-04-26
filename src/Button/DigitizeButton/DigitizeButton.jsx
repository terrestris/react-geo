import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Input } from 'antd';

import isFunction from 'lodash/isFunction.js';

import OlMap from 'ol/Map';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlCollection from 'ol/Collection';
import OlStyleStyle from 'ol/style/Style';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleFill from 'ol/style/Fill';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleText from 'ol/style/Text';
import OlInteractionDraw, { createBox } from 'ol/interaction/Draw';
import OlInteractionSelect from 'ol/interaction/Select';
import OlInteractionModify from 'ol/interaction/Modify';
import OlInteractionTranslate from 'ol/interaction/Translate';
import OlEventsCondition from 'ol/events/condition';

import ToggleButton from '../ToggleButton/ToggleButton.jsx';
import MapUtil from '@terrestris/ol-util/src/MapUtil/MapUtil';
import StringUtil from '@terrestris/base-util/src/StringUtil/StringUtil';
import AnimateUtil from '@terrestris/ol-util/src/AnimateUtil/AnimateUtil';
import Logger from '@terrestris/base-util/src/Logger';
import { CSS_PREFIX } from '../../constants';

/**
 * The DigitizeButton.
 *
 * @class The DigitizeButton
 * @extends React.Component
 *
 */
class DigitizeButton extends React.Component {

  /**
   * The className added to this component.
   *
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}digitizebutton`;

  /**
   * Currently existing digitize features as collection.
   *
   * @type {OlCollection}
   * @private
   */
  _digitizeFeatures = null;

  /**
   * Currently drawn feature which should be represent as label or postit.
   * @type {OlFeature}
   * @private
   */
  _digitizeTextFeature = null;

  /**
   * Reference to OL select interaction which will be used in edit mode.
   * @type {OlInteractionSelect}
   * @private
   */
  _selectInteraction = null;

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
   *
   * @type {String}
   */
  static DEFAULT_FILL_COLOR = 'rgba(154, 26, 56, 0.5)';

  /**
   * Default stroke color used in style object of drawn features.
   *
   * @type {String}
   */
  static DEFAULT_STROKE_COLOR = 'rgba(154, 26, 56, 0.8)';

  /**
   * Hit detection in pixels used for select interaction.
   *
   * @type {Number}
   */
   static HIT_TOLERANCE = 5;

  /**
   * Default style for digitized points.
   *
   * @type {OlStyleStyle}
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
   *
   * @type {OlStyleStyle}
   */
  static DEFAULT_LINESTRING_STYLE = new OlStyleStyle({
    stroke: new OlStyleStroke({
      color: DigitizeButton.DEFAULT_STROKE_COLOR,
      width: 2
    })
  });

  /**
   * Default style for digitized polygons or circles.
   *
   * @type {OlStyleStyle}
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
   *
   * @type {OlStyleStyle}
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
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * The className which should be added.
     *
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * Instance of OL map this component is bound to.
     *
     * @type {OlMap}
     */
    map: PropTypes.instanceOf(OlMap).isRequired,

    /**
     * Whether the line, point, polygon, circle, rectangle or text shape should
     * be drawn.
     *
     * @type {String}
     */
    drawType: PropTypes.oneOf(['Point', 'LineString', 'Polygon', 'Circle', 'Rectangle', 'Text']),

    /**
     * Whether the digitize feature should be deleted, copied or modified.
     * be drawn.
     *
     * @type {String}
     */
    editType: PropTypes.oneOf(['Copy', 'Edit', 'Delete']),

    /**
     * Name of system vector layer which will be used for digitize features.
     *
     * @type {String}
     */
    digitizeLayerName: PropTypes.string,

    /**
     * Fill color of selected digitize feature.
     *
     * @type {String}
     */
    selectFillColor: PropTypes.string,

    /**
     * Stroke color of selected digitize feature.
     *
     * @type {String}
     */
    selectStrokeColor: PropTypes.string,

    /**
     * Title for modal used for input of labels for digitize features.
     *
     * @type {String}
     */
    modalPromptTitle: PropTypes.string,

    /**
     * Text string for `OK` button of the modal.
     *
     * @type {String}
     */
    modalPromptOkButtonText: PropTypes.string,

    /**
     * Text string for `Cancel` button of the modal.
     *
     * @type {String}
     */
    modalPromptCancelButtonText: PropTypes.string,

    /**
     * Style object for drawn feature.
     *
     * @type {OlStyleStyle}
     */
    drawStyle: PropTypes.instanceOf(OlStyleStyle),

    /**
     * Listener function for the 'drawend' event of an ol.interaction.Draw.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Draw.Event.html
     * for more information.
     */
    onDrawEnd: PropTypes.func,

    /**
     * Listener function for the 'drawstart' event of an ol.interaction.Draw.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Draw.Event.html
     * for more information.
     */
    onDrawStart: PropTypes.func,

    /**
     * Listener function for the 'modifystart' event of an ol.interaction.Modify.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Modify.Event.html
     * for more information.
     */
    onModifyStart: PropTypes.func,

    /**
     * Listener function for the 'modifyend' event of an ol.interaction.Modify.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Modify.Event.html
     * for more information.
     */
    onModifyEnd: PropTypes.func,

    /**
     * Listener function for the 'translatestart' event of an ol.interaction.Translate.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Translate.Event.html
     * for more information.
     */
    onTranslateStart: PropTypes.func,

    /**
     * Listener function for the 'translateend' event of an ol.interaction.Translate.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Translate.Event.html
     * for more information.
     */
    onTranslateEnd: PropTypes.func,

    /**
     * Listener function for the 'translating' event of an ol.interaction.Translate.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Translate.Event.html
     * for more information.
     */
    onTranslating: PropTypes.func,

    /**
     * Listener function for the 'select' event of the ol.interaction.Select
     * if in delete mode.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Select.Event.html
     * for more information.
     */
    onFeatureRemove: PropTypes.func,

    /**
     * Listener function for the 'select' event of the ol.interaction.Select
     * if in copy mode.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Select.Event.html
     * for more information.
     */
    onFeatureCopy: PropTypes.func,

    /**
     * Additional configuration object to apply to the ol.interaction.Draw.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Draw.html
     * for more information
     *
     * Note: The keys source, type, geometryFunction, style and freehandCondition
     *       are handled internally and shouldn't be overwritten without any
     *       specific cause.
     */
    drawInteractionConfig: PropTypes.object,

    /**
     * Additional configuration object to apply to the ol.interaction.Select.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Select.html
     * for more information
     *
     * Note: The keys condition, hitTolerance and style are handled internally
     *       and shouldn't be overwritten without any specific cause.
     */
    selectInteractionConfig: PropTypes.object,

    /**
     * Additional configuration object to apply to the ol.interaction.Modify.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Modify.html
     * for more information
     *
     * Note: The keys features, deleteCondition and style are handled internally
     *       and shouldn't be overwritten without any specific cause.
     */
    modifyInteractionConfig: PropTypes.object,

    /**
     * Additional configuration object to apply to the ol.interaction.Translate.
     * See https://openlayers.org/en/latest/apidoc/ol.interaction.Translate.html
     * for more information
     *
     * Note: The key feature is handled internally and shouldn't be overwritten
     *       without any specific cause.
     */
    translateInteractionConfig: PropTypes.object,

    /**
     * A custom onToogle function that will be called
     * if button is toggled
     *
     * @type {Function} onToggle
     */
    onToggle: PropTypes.func
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
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
    onToggle: () => {}
  }

  /**
   * Creates the DigitizeButton.
   *
   * @constructs DigitizeButton
   */
  constructor(props) {
    super(props);

    if (!this.props.drawType && !this.props.editType) {
      Logger.warn('Neither "drawType" nor "editType" was provided. Digitize ' +
      'button won\'t work properly!');
    }

    this.state = {
      digitizeLayer: null,
      interactions: [],
      showLabelPrompt: false,
      textLabel: ''
    };
  }

  /**
   * `componentDidMount` method of the DigitizeButton. Just calls
   * `createDigitizeLayer` method.
   */
  componentDidMount() {
    this.createDigitizeLayer();
  }

  /**
   * Called on componentWillUnmount lifecycle.
   */
  componentWillUnmount() {
    const {
      map
    } = this.props;

    const {
      interactions
    } = this.state;

    interactions.forEach(i => map.removeInteraction(i));
  }

  /**
   * Called when the digitize button is toggled. If the button state is pressed,
   * the appropriate draw, modify or select interaction will be created.
   * Otherwise, by untoggling, the same previously created interaction will be
   * removed from the map.
   *
   * @param {Boolean} pressed Whether the digitize button is pressed or not.
   */
  onToggle = pressed => {
    const {
      map,
      drawType,
      editType,
      drawStyle
    } = this.props;

    const {
      digitizeLayer,
      interactions
    } = this.state;

    this.props.onToggle(pressed);

    this._digitizeFeatures = digitizeLayer.getSource().getFeaturesCollection();

    if (pressed) {
      if (drawStyle) {
        digitizeLayer.setStyle(this.getDigitizeStyleFunction);
      }
      if (drawType) {
        this.createDrawInteraction(pressed);
      } else if (editType) {
        this.createSelectOrModifyInteraction();
      }
    } else {
      interactions.forEach(i => map.removeInteraction(i));
      if (drawType === DigitizeButton.TEXT_DRAW_TYPE) {
        this._digitizeFeatures.un('add', this.handleTextAdding);
      } else {
        if (this._selectInteraction) {
          this._selectInteraction.getFeatures().clear();
        }
        if (editType === DigitizeButton.DELETE_EDIT_TYPE) {
          this._selectInteraction.un('select', this.onFeatureRemove);
        }
        if (editType === DigitizeButton.COPY_EDIT_TYPE) {
          this._selectInteraction.un('select', this.onFeatureCopy);
        }
        map.un('pointermove', this.onPointerMove);
      }
    }
  }

  /**
   * Creates digitize vector layer and adds this to the map.
   */
  createDigitizeLayer = () => {
    const {
      digitizeLayerName,
      map
    } = this.props;
    let digitizeLayer = MapUtil.getLayerByName(map, digitizeLayerName);
    if (!digitizeLayer) {
      digitizeLayer = new OlLayerVector({
        name: digitizeLayerName,
        source: new OlSourceVector({
          features: new OlCollection(),
        })
      });
      map.addLayer(digitizeLayer);
    }
    digitizeLayer.setStyle(this.getDigitizeStyleFunction);
    this.setState({digitizeLayer});
  }

  /**
   * The styling function for the digitize vector layer, which considers
   * different geometry types of drawn features.
   *
   * @param {OlFeature} feature The feature which is being styled.
   * @return {OlStyleStyle} The style to use.
   */
  getDigitizeStyleFunction = feature => {
    const {
      drawStyle,
    } = this.props;

    let styleObj;

    switch (feature.getGeometry().getType()) {
      case DigitizeButton.POINT_DRAW_TYPE: {
        if (!feature.get('isLabel')) {
          styleObj = drawStyle || new OlStyleStyle({
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
          styleObj = drawStyle || new OlStyleStyle({
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
        return styleObj;
      }
      case DigitizeButton.LINESTRING_DRAW_TYPE: {
        styleObj = drawStyle || new OlStyleStyle({
          stroke: new OlStyleStroke({
            color: DigitizeButton.DEFAULT_STROKE_COLOR,
            width: 2
          })
        });
        return styleObj;
      }
      case DigitizeButton.POLYGON_DRAW_TYPE:
      case DigitizeButton.CIRCLE_DRAW_TYPE: {
        styleObj = drawStyle || new OlStyleStyle({
          fill: new OlStyleFill({
            color: DigitizeButton.DEFAULT_FILL_COLOR
          }),
          stroke: new OlStyleStroke({
            color: DigitizeButton.DEFAULT_STROKE_COLOR,
            width: 2
          })
        });
        return styleObj;
      }
      default: {
        break;
      }
    }
  }

  /**
   * The OL style for selected digitized features.
   *
   * @param {OlFeature} feature The selected feature.
   * @param {Number} View resolution.
   * @param {String} text Text for labeled feature (optional).
   * @return {OlStyleStyle} The style to use.
   */
  getSelectedStyleFunction = (feature, res, text) => {
    const {
      selectFillColor,
      selectStrokeColor
    } = this.props;

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
  }

  /**
   * Creates a correctly configured OL draw interaction depending on given
   * drawType and adds this to the map.
   *
   * @param {Boolean} pressed Whether the digitize button is pressed or not.
   * Will be used to handle active state of the draw interaction.
   */
  createDrawInteraction = pressed => {
    const {
      drawType,
      map,
      onDrawEnd,
      onDrawStart,
      digitizeLayerName,
      drawInteractionConfig
    } = this.props;

    let geometryFunction;
    let type = drawType;

    // check whether the digitizeLayer is in map and set it from state if not
    let digitizeLayer = MapUtil.getLayerByName(map, digitizeLayerName);
    if (!digitizeLayer) {
      map.addLayer(this.state.digitizeLayer);
    }

    if (drawType === DigitizeButton.RECTANGLE_DRAW_TYPE) {
      geometryFunction = createBox();
      type = DigitizeButton.CIRCLE_DRAW_TYPE;
    } else if (drawType === DigitizeButton.TEXT_DRAW_TYPE) {
      type = DigitizeButton.POINT_DRAW_TYPE;
      this._digitizeFeatures.on('add', this.handleTextAdding);
    }

    const drawInteraction = new OlInteractionDraw({
      source: this.state.digitizeLayer.getSource(),
      type: type,
      geometryFunction: geometryFunction,
      style: this.getDigitizeStyleFunction,
      freehandCondition: OlEventsCondition.never,
      ...drawInteractionConfig
    });

    if (onDrawEnd) {
      drawInteraction.on('drawend', onDrawEnd);
    }

    if (onDrawStart) {
      drawInteraction.on('drawstart', onDrawStart);
    }

    map.addInteraction(drawInteraction);

    this.setState({
      interactions: [drawInteraction]
    }, () => {
      drawInteraction.setActive(pressed);
    });
  }

  /**
   * Creates a correctly configured OL select and/or modify and/or translate
   * interaction(s) depending on given editType and adds this/these to the map.
   */
  createSelectOrModifyInteraction = () => {
    const {
      editType,
      map,
      selectInteractionConfig,
      modifyInteractionConfig,
      translateInteractionConfig
    } = this.props;

    this._selectInteraction = new OlInteractionSelect({
      condition: OlEventsCondition.singleClick,
      hitTolerance: DigitizeButton.HIT_TOLERANCE,
      style: this.getSelectedStyleFunction,
      ...selectInteractionConfig
    });

    if (editType === DigitizeButton.DELETE_EDIT_TYPE) {
      this._selectInteraction.on('select', this.onFeatureRemove);
    } else if (editType === DigitizeButton.COPY_EDIT_TYPE) {
      this._selectInteraction.on('select', this.onFeatureCopy);
    }

    let interactions = [this._selectInteraction];

    if (editType === DigitizeButton.EDIT_EDIT_TYPE) {
      const edit = new OlInteractionModify({
        features: this._selectInteraction.getFeatures(),
        deleteCondition: OlEventsCondition.singleClick,
        style: this.getSelectedStyleFunction,
        ...modifyInteractionConfig
      });

      edit.on('modifystart', this.onModifyStart);
      edit.on('modifyend', this.onModifyEnd);

      const translate = new OlInteractionTranslate({
        features: this._selectInteraction.getFeatures(),
        ...translateInteractionConfig
      });

      translate.on('translatestart', this.onTranslateStart);
      translate.on('translateend', this.onTranslateEnd);
      translate.on('translating', this.onTranslating);

      interactions.push(edit, translate);
    }

    interactions.forEach(i => map.addInteraction(i));

    map.on('pointermove', this.onPointerMove);

    this.setState({interactions});
  }

  /**
   * Listener for `select` event of OL select interaction in `Delete` mode.
   * Removes selected feature from the vector source and map.
   *
   * @param {ol.interaction.Select.Event} evt The interaction event.
   */
  onFeatureRemove = evt => {
    const {
      onFeatureRemove
    } = this.props;

    if (isFunction(onFeatureRemove)) {
      onFeatureRemove(evt);
    }

    const feat = evt.selected[0];
    this._selectInteraction.getFeatures().remove(feat);
    this.state.digitizeLayer.getSource().removeFeature(feat);
    this.props.map.renderSync();
  }

  /**
   * Listener for `select` event of OL select interaction in `Copy` mode.
   * Creates a clone of selected feature and calls utility method to move it
   * beside the original to avoid overlapping.
   *
   * @param {ol.interaction.Select.Event} evt The interaction event.
   */
  onFeatureCopy = evt => {
    const {
      onFeatureCopy
    } = this.props;

    if (isFunction(onFeatureCopy)) {
      onFeatureCopy(evt);
    }

    const feat = evt.selected[0];
    const copy = feat.clone();
    copy.setStyle(feat.getStyle());
    this._digitizeFeatures.push(copy);

    AnimateUtil.moveFeature(
      this.props.map,
      copy,
      500,
      50,
      feat.getStyle()
    );
  }

  /**
   * Checks if a labeled feature is being modified. If yes, opens prompt to
   * input a new label.
   *
   * @param {ol.interaction.Modify.Event} evt The interaction event.
   */
  onModifyStart = evt => {
    const {
      onModifyStart
    } = this.props;

    if (isFunction(onModifyStart)) {
      onModifyStart(evt);
    }

    const feature = evt.features.getArray()[0];
    if (feature.get('isLabel')) {
      this._digitizeTextFeature = feature;
      this.setState({
        showLabelPrompt: true
      });
    }
  }

  /**
   * Called on modifyend of the ol.interaction.Modify.
   *
   * @param {ol.interaction.Modify.Event} evt The interaction event.
   */
  onModifyEnd = evt => {
    const {
      onModifyEnd
    } = this.props;

    if (isFunction(onModifyEnd)) {
      onModifyEnd(evt);
    }
  }

  /**
   * Called on translatestart of the ol.interaction.Translate.
   *
   * @param {ol.interaction.Translate.Event} evt The interaction event.
   */
  onTranslateStart = evt => {
    const {
      onTranslateStart
    } = this.props;

    if (isFunction(onTranslateStart)) {
      onTranslateStart(evt);
    }
  }

  /**
   * Called on translateend of the ol.interaction.Translate.
   *
   * @param {ol.interaction.Translate.Event} evt The interaction event.
   */
  onTranslateEnd = evt => {
    const {
      onTranslateEnd
    } = this.props;

    if (isFunction(onTranslateEnd)) {
      onTranslateEnd(evt);
    }
  }

  /**
   * Called on translating of the ol.interaction.Translate.
   *
   * @param {ol.interaction.Translate.Event} evt The interaction event.
   */
  onTranslating = evt => {
    const {
      onTranslating
    } = this.props;

    if (isFunction(onTranslating)) {
      onTranslating(evt);
    }
  }

  /**
   * Changes state for showLabelPrompt to make modal for label input visible.
   *
   * @param {Event} evt Click event on adding feature to the digitize layer.
   *
   * @method
   */
  handleTextAdding = evt => {
    this.setState({
      showLabelPrompt: true
    });
    this._digitizeTextFeature = evt.element;
    this._digitizeTextFeature.set('isLabel', true);
  }

  /**
   * Callback function after `Ok` button of label input modal was clicked.
   * Turns visibility of modal off and call `setTextOnFeature` method.
   */
  onModalLabelOk = () => {
    this.setState({
      showLabelPrompt: false
    }, () => {
      this.setTextOnFeature(this._digitizeTextFeature);
    });
  }

  /**
   * Callback function after `Cancel` button of label input modal was clicked.
   * Turns visibility of modal off and removes last drawn feature from the
   * digitize layer.
   */
  onModalLabelCancel = () => {
    this.setState({
      showLabelPrompt: false,
      textLabel: ''
    }, () => {
      if (!(this.state.interactions.length > 1)) {
        this._digitizeFeatures.remove(this._digitizeTextFeature);
        this._digitizeTextFeature = null;
      }
    });
  }

  /**
   * Sets formatted label on feature.
   *
   * @param {OlFeature} feat The point feature to be styled with label.
   */
  setTextOnFeature = feat => {
    const label = StringUtil.stringDivider(this.state.textLabel, 16, '\n');
    feat.set('label', label);
    this.setState({
      textLabel: ''
    });
  }

  /**
   * Called if label input field value was changed. Updates state value for
   * textLabel.
   *
   * @param {Event} evt Input event containing new text value to be set as
   * textLabel.
   */
  onLabelChange = evt => {
    this.setState({
      textLabel: evt.target.value
    });
  }

  /**
   * Sets the cursor to `pointer` if the pointer enters a non-oqaque pixel of
   * a hoverable layer.
   *
   * @param {ol.MapEvent} evt The `pointermove` event.
   */
  onPointerMove = evt => {
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
  }

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
      drawInteractionConfig,
      selectInteractionConfig,
      modifyInteractionConfig,
      translateInteractionConfig,
      onToggle,
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
              <Input
                value={this.state.textLabel}
                onChange={this.onLabelChange}
              />
            </Modal>
            : null
        }
      </span>
    );
  }
}

export default DigitizeButton;

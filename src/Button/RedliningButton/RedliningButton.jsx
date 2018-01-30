import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Input } from 'antd';

import OlMap from 'ol/map';
import OlLayerVector from 'ol/layer/vector';
import OlSourceVector from 'ol/source/vector';
import OlCollection from 'ol/collection';
import OlStyleStyle from 'ol/style/style';
import OlStyleStroke from 'ol/style/stroke';
import OlStyleFill from 'ol/style/fill';
import OlStyleCircle from 'ol/style/circle';
import OlStyleText from 'ol/style/text';
import OlInteractionDraw from 'ol/interaction/draw';
import OlInteractionSelect from 'ol/interaction/select';
import OlInteractionModify from 'ol/interaction/modify';
import OlInteractionTranslate from 'ol/interaction/translate';
import OlEventsCondition from 'ol/events/condition';

import ToggleButton from '../ToggleButton/ToggleButton.jsx';
import MapUtil from '../../Util/MapUtil/MapUtil';
import StringUtil from '../../Util/StringUtil/StringUtil';
import DigitizeUtil from '../../Util/DigitizeUtil/DigitizeUtil';
import Logger from '../../Util/Logger';

import './RedliningButton.less';

/**
 * The RedliningButton.
 *
 * @class The RedliningButton
 * @extends React.Component
 *
 */
class RedliningButton extends React.Component {

  /**
   * The className added to this component.
   *
   * @type {String}
   * @private
   */
  className = 'react-geo-redliningbutton';

  /**
   * Currently existing redlining features as collection.
   *
   * @type {OlCollection}
   * @private
   */
  _redliningFeatures = null;

  /**
   * Currently drawn feature which should be represent as label or postit.
   * @type {OlFeature}
   * @private
   */
   _redliningTextFeature = null;

   /**
    * Reference to OL select interaction which will be used in edit mode.
    * @type {OlInteractionSelect}
    * @private
    */
    _selectInteraction = null;

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
     * Whether the redlining feature should be deleted, copied or modified.
     * be drawn.
     *
     * @type {String}
     */
    editType: PropTypes.oneOf(['Copy', 'Edit', 'Delete']),

    /**
     * Name of system vector layer which will be used for redlining features.
     *
     * @type {String}
     */
    redliningLayerName: PropTypes.string,

    /**
     * Fill color of the redlining feature.
     *
     * @type {String}
     */
    fillColor: PropTypes.string,

    /**
     * Stroke color of the redlining feature.
     *
     * @type {String}
     */
    strokeColor: PropTypes.string,

    /**
     * Fill color of selected redlining feature.
     *
     * @type {String}
     */
    selectFillColor: PropTypes.string,

    /**
     * Stroke color of selected redlining feature.
     *
     * @type {String}
     */
    selectStrokeColor: PropTypes.string,

    /**
     * Title for modal used for input of labels for redlining features.
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
    modalPromptCancelButtonText: PropTypes.string
  };


  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    redliningLayerName: 'react-geo_redlining',
    fillColor: 'rgba(154, 26, 56, 0.5)',
    strokeColor: 'rgba(154, 26, 56, 0.8)',
    selectFillColor: 'rgba(240, 240, 90, 0.5)',
    selectStrokeColor: 'rgba(220, 120, 20, 0.8)',
    modalPromptTitle: 'Label',
    modalPromptOkButtonText: 'Ok',
    modalPromptCancelButtonText: 'Cancel'
  }

  /**
   * Creates the RedliningButton.
   *
   * @constructs RedliningButton
   */
  constructor(props) {

    super(props);

    if (!this.props.drawType && !this.props.editType) {
      Logger.warn('Neither "drawType" nor "editType" was provided. Redlining ' +
      'button won\'t work properly!');
    }

    this.state = {
      redliningLayer: null,
      interaction: null,
      showLabelPrompt: false,
      textLabel: ''
    };
  }

  /**
   * `componentWillMount` method of the RedliningButton. Just calls
   * `createRedliningLayer` method.
   *
   * @method
   */
  componentDidMount() {
    this.createRedliningLayer();
  }

  /**
   * Called when the redlining button is toggled. If the button state is pressed,
   * the appropriate draw, modify or select interaction will be created.
   * Otherwise, by untoggling, the same previously created interaction will be
   * removed from the map.
   *
   * @param {Boolean} pressed Whether the redlining button is pressed or not.
   *
   * @method
   */
  onToggle = pressed => {

    const {
      map,
      drawType,
      editType
    } = this.props;

    const {
      redliningLayer,
      interaction
    } = this.state;

    this._redliningFeatures = redliningLayer.getSource().getFeaturesCollection();

    if (pressed) {
      if (drawType) {
        this.createDrawInteraction(pressed);
      } else if (editType) {
        this.createSelectOrModifyInteraction(pressed);

      }
    } else {
      interaction.forEach(i => map.removeInteraction(i));
      if (drawType === 'Text') {
        this._redliningFeatures.un('add', this.handleTextAdding);
      } else {
        if (editType === 'Delete') {
          this._selectInteraction.un('select', this.onFeatureRemove);
        }
        if (editType === 'Copy') {
          this._selectInteraction.un('select', this.onFeatureCopy);
        }
        map.un('pointermove', this.onPointerMove);
      }
    }
  }

  /**
   * Creates redlining vector layer and adds this to the map.
   *
   * @method
   */
  createRedliningLayer = () => {
    const {
      redliningLayerName,
      map
    } = this.props;

    let redliningLayer = MapUtil.getLayerByName(map, redliningLayerName);

    if (!redliningLayer) {
      redliningLayer = new OlLayerVector({
        name: redliningLayerName,
        source: new OlSourceVector({
          features: new OlCollection(),
        }),
        style: this.getRedliningStyleFunction
      });
      map.addLayer(redliningLayer);
    }
    this.setState({redliningLayer});
  }

  /**
   * The styling function for the redlining vector layer, which considers
   * different geometry types of drawn features.
   *
   * @param {OlFeature} feature The feature which is being styled.
   * @return {OlStyleStyle} The style to use.
   *
   * @method
   */
  getRedliningStyleFunction = feature => {

    const {
      fillColor,
      selectFillColor,
      strokeColor,
      selectStrokeColor
    } = this.props;

    const {
      interaction,
    } = this.state;

    let useSelectStyle = false;
    if (interaction && interaction.length > 1 && !feature.get('isLabel')) {
      useSelectStyle = true;
    }

    switch (feature.getGeometry().getType()) {
      case 'Point': {
        if (!feature.get('isLabel')) {
          return new OlStyleStyle({
            image: new OlStyleCircle({
              radius: 7,
              fill: new OlStyleFill({
                color: !useSelectStyle ? fillColor : selectFillColor
              }),
              stroke: new OlStyleStroke({
                color: !useSelectStyle ? strokeColor : selectStrokeColor
              })
            })
          });
        } else {
          return new OlStyleStyle({
            text: new OlStyleText({
              text: '',
              offsetX: 5,
              offsetY: 5,
              font: '12px sans-serif',
              fill: new OlStyleFill({
                color: !useSelectStyle ? fillColor : selectFillColor
              }),
              stroke: new OlStyleStroke({
                color: !useSelectStyle ? strokeColor : selectStrokeColor
              })
            })
          });
        }
      }
      case 'LineString': {
        return new OlStyleStyle({
          stroke: new OlStyleStroke({
            color: !useSelectStyle ? strokeColor : selectStrokeColor,
            width: 2
          })
        });
      }
      case 'Polygon':
      case 'Circle': {
        return new OlStyleStyle({
          fill: new OlStyleFill({
            color: !useSelectStyle ? fillColor : selectFillColor
          }),
          stroke: new OlStyleStroke({
            color: !useSelectStyle ? strokeColor : selectStrokeColor,
            width: 2
          })
        });
      }
      default: {
        break;
      }
    }
  }

  /**
   * Creates a correctly configured OL draw interaction depending on given
   * drawType and adds this to the map.
   *
   * @param {Boolean} pressed Whether the redlining button is pressed or not.
   * Will be used to handle active state of the draw interaction.
   *
   * @method
   */
  createDrawInteraction = pressed => {
    const {
      drawType,
      map
    } = this.props;

    let geometryFunction;
    let type = drawType;

    if (drawType === 'Rectangle') {
      geometryFunction = OlInteractionDraw.createBox();
      type = 'Circle';
    } else if (drawType === 'Text') {
      type = 'Point';
      this._redliningFeatures.on('add', this.handleTextAdding);
    }

    const drawInteraction = new OlInteractionDraw({
      source: this.state.redliningLayer.getSource(),
      type: type,
      geometryFunction: geometryFunction,
      style: this.getRedliningStyleFunction,
      freehandCondition: OlEventsCondition.never
    });

    map.addInteraction(drawInteraction);

    this.setState({
      interaction: [drawInteraction]
    }, () => {
      drawInteraction.setActive(pressed);
    });
  }

  /**
   * Creates a correctly configured OL select and/or modify and/or translate
   * interaction(s) depending on given editType and adds this/these to the map.
   *
   * @method
   */
  createSelectOrModifyInteraction = () => {
    const {
      editType,
      map
    } = this.props;

    this._selectInteraction = new OlInteractionSelect({
      condition: OlEventsCondition.singleClick,
      style: this.getRedliningStyleFunction,
      hitTolerance: 5
    });

    if (editType === 'Delete') {
      this._selectInteraction.on('select', this.onFeatureRemove);
    } else if (editType === 'Copy') {
      this._selectInteraction.on('select', this.onFeatureCopy);
    }

    let interactions = [this._selectInteraction];

    if (editType === 'Edit') {
      const edit = new OlInteractionModify({
        features: this._selectInteraction.getFeatures(),
        deleteCondition: OlEventsCondition.singleClick,
        style: this.getRedliningStyleFunction,
        pixelTolerance: 10
      });

      edit.on('modifystart', this.onModifyStart);

      const translate = new OlInteractionTranslate({
        features: this._selectInteraction.getFeatures()
      });
      interactions.push(edit, translate);
    }

    interactions.forEach(i => map.addInteraction(i));

    map.on('pointermove', this.onPointerMove);

    this.setState({
      interaction: interactions
    });
  }

  /**
   * Listener for `select` event of OL select interaction in `Delete` mode.
   * Removes selected feature from the vector source and map.
   *
   * @param {Event} evt Event containing selected feature to be removed.
   *
   * @method
   */
  onFeatureRemove = evt => {
    const feat = evt.selected[0];
    this._selectInteraction.getFeatures().remove(feat);
    this.state.redliningLayer.getSource().removeFeature(feat);
    this.props.map.renderSync();
  }

  /**
   * Listener for `select` event of OL select interaction in `Copy` mode.
   * Creates a clone of selected feature and calls utility method to move it
   * beside the original to avoid overlapping.
   *
   * @param {Event} evt Event containing selected feature to be copied.
   *
   * @method
   */
  onFeatureCopy = evt => {
    const feat = evt.selected[0];
    const copy = feat.clone();
    //eslint-disable-next-line
    const doneFn = finalFeature => {this._redliningFeatures.push(finalFeature)};
    const style = this.getRedliningStyleFunction(copy);

    DigitizeUtil.moveFeature(
      this.props.map,
      copy,
      500,
      50,
      style,
      doneFn
    );
  }

  /**
   * Checks if a labeled feature is being modified. If yes, opens prompt to
   * input a new label.
   *
   * @param {Event} evt 'modifystart' event of OlInteractionModify.
   *
   * @method
   */
  onModifyStart = evt => {
    const feature = evt.features.getArray()[0];
    if (feature.get('isLabel')) {
      this._redliningTextFeature = feature;
      this.setState({
        showLabelPrompt: true
      });
    }
  }

  /**
   * Changes state for showLabelPrompt to make modal for label input visible.
   *
   * @param {Event} evt Click event on adding feature to the redlining layer.
   *
   * @method
   */
  handleTextAdding = evt => {
    this.setState({
      showLabelPrompt: true
    });
    this._redliningTextFeature = evt.element;
    this._redliningTextFeature.set('isLabel', true);
  }

  /**
   * Callback function after `Ok` button of label input modal was clicked.
   * Turns visibility of modal off and call `setTextOnFeature` method.
   *
   * @method
   */
  onModalLabelOk = () => {
    this.setState({
      showLabelPrompt: false
    }, () => {
      this.setTextOnFeature(this._redliningTextFeature);
    });
  }

  /**
   * Callback function after `Cancel` button of label input modal was clicked.
   * Turns visibility of modal off and removes last drawn feature from the
   * redlining layer.
   *
   * @method
   */
  onModalLabelCancel = () => {
    this.setState({
      showLabelPrompt: false,
      textLabel: ''
    }, () => {
      if (!(this.state.interaction && this.state.interaction.length > 1)) {
        this._redliningFeatures.remove(this._redliningTextFeature);
        this._redliningTextFeature = null;
      }
    });
  }

  /**
   * Sets formatted label on feature.
   *
   * @param {OlFeature} feat The point feature to be styled with label.
   *
   * @method
   */
  setTextOnFeature = (feat) => {
    const label = StringUtil.stringDivider(this.state.textLabel, 16, '\n');
    const style = this.getRedliningStyleFunction(feat).clone();
    style.getText().setText(label);
    feat.setStyle(style);

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
   *
   * @method
   */
  onLabelChange = (evt) => {
    this.setState({
      textLabel: evt.target.value
    });
  }

  /**
   * Sets the cursor to `pointer` if the pointer enters a non-oqaque pixel of
   * a hoverable layer.
   *
   * @param {ol.MapEvent} evt The `pointermove` event.
   *
   * @method
   */
  onPointerMove = evt => {
    if (evt.dragging) {
      return;
    }

    const { map } = this.props;
    const pixel = map.getEventPixel(evt.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);

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
      redliningLayerName,
      fillColor,
      strokeColor,
      selectFillColor,
      selectStrokeColor,
      modalPromptTitle,
      modalPromptOkButtonText,
      modalPromptCancelButtonText,
      ...passThroughProps
    } = this.props;


    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <div className="wrapper">
        <ToggleButton
          onToggle={this.onToggle}
          className={finalClassName}
          {...passThroughProps}
        />
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
      </div>
    );
  }
}

export default RedliningButton;

import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Input } from 'antd';

import { isEmpty } from 'lodash';

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

import ToggleButton from '../ToggleButton/ToggleButton.jsx';
import MapUtil from '../../Util/MapUtil/MapUtil';
import StringUtil from '../../Util/StringUtil/StringUtil';

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
    drawType: PropTypes.oneOf(['Point', 'LineString', 'Polygon', 'Circle', 'Rectangle', 'Text']).isRequired,

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
    modalPromptCancelButtonText: PropTypes.string,
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    redliningLayerName: 'react-geo_redlining',
    fillColor: 'rgba(154, 26, 56, 0.5)',
    strokeColor: 'rgba(154, 26, 56, 0.8)',
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

    this.state = {
      redliningLayer: null,
      drawInteraction: null,
      showTextPrompt: false,
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
   * the appropriate draw interaction will be created. Otherwise, by untoggling,
   * the same previously created interaction will be removed from the map.
   *
   * @param {Boolean} pressed Whether the redlining button is pressed or not.
   *
   * @method
   */
  onToggle = (pressed) => {

    const {
      map,
      drawType
    } = this.props;

    const {
      redliningLayer,
      drawInteraction
    } = this.state;

    this._redliningFeatures = redliningLayer.getSource().getFeaturesCollection();

    if (pressed) {
      this.createDrawInteraction(pressed);
    } else {
      map.removeInteraction(drawInteraction);
      if (drawType === 'Text') {
        this._redliningFeatures.un('add', this.handleTextAdding);
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
  getRedliningStyleFunction = (feature) => {

    const {
      fillColor,
      strokeColor
    } = this.props;

    switch (feature.getGeometry().getType()) {
      case 'Point': {
        if (isEmpty(this.state.textLabel)) {
          return new OlStyleStyle({
            image: new OlStyleCircle({
              radius: 7,
              fill: new OlStyleFill({
                color: fillColor
              }),
              stroke: new OlStyleStroke({
                color: strokeColor
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
                color: fillColor
              }),
              stroke: new OlStyleStroke({
                color: strokeColor
              })
            })
          });
        }
      }
      case 'LineString': {
        return new OlStyleStyle({
          stroke: new OlStyleStroke({
            color: strokeColor,
            width: 2
          })
        });
      }
      case 'Polygon':
      case 'Circle': {
        return new OlStyleStyle({
          fill: new OlStyleFill({
            color: fillColor
          }),
          stroke: new OlStyleStroke({
            color: strokeColor,
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
   * drawType.
   *
   * @param {Boolean} pressed Whether the redlining button is pressed or not.
   * Will be used to handle active state of the draw interaction.
   *
   * @return {OlInteractionDraw} The created OL draw interaction.
   *
   * @method
   */
  createDrawInteraction = (pressed) => {
    const {
      fillColor,
      strokeColor,
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
      style: new OlStyleStyle({
        fill: new OlStyleFill({
          color: fillColor
        }),
        stroke: new OlStyleStroke({
          color: strokeColor,
          lineDash: [10, 10],
          width: 2
        }),
        image: new OlStyleCircle({
          radius: 5,
          stroke: new OlStyleStroke({
            color: strokeColor
          }),
          fill: new OlStyleFill({
            color: fillColor
          })
        })
      }),
      freehandCondition: function() {
        return false;
      }
    });

    map.addInteraction(drawInteraction);

    this.setState({drawInteraction}, () => {
      drawInteraction.setActive(pressed);
    });
  }

  /**
   * Changes state for showTextPrompt to make modal for label input visible.
   *
   * @param {Event} evt Click event on adding feature to the redlining layer.
   *
   * @method
   */
  handleTextAdding = (evt) => {
    this.setState({
      showTextPrompt: true
    });
    this._redliningTextFeature = evt.element;
  }

  /**
   * Callback function after `Ok` button of label input modal was clicked.
   * Turns visibility of modal off and call `setTextOnFeature` method.
   *
   * @method
   */
  onModalLabelOk = () => {
    this.setState({
      showTextPrompt: false
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
      showTextPrompt: false,
      textLabel: ''
    }, () => {
      this._redliningFeatures.remove(this._redliningTextFeature);
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
   * The render function.
   */
  render() {
    const {
      className,
      map,
      drawType,
      redliningLayerName,
      fillColor,
      strokeColor,
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
          tooltip={''}
          {...passThroughProps}
        />
        <Modal
          title={modalPromptTitle}
          okText={modalPromptOkButtonText}
          cancelText={modalPromptCancelButtonText}
          visible={this.state.showTextPrompt}
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

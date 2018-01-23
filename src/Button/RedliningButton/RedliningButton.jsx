import React from 'react';
import PropTypes from 'prop-types';

import OlMap from 'ol/map';
import OlLayerVector from 'ol/layer/vector';
import OlSourceVector from 'ol/source/vector';
import OlCollection from 'ol/collection';
import OlStyleStyle from 'ol/style/style';
import OlStyleStroke from 'ol/style/stroke';
import OlStyleFill from 'ol/style/fill';
import OlStyleCircle from 'ol/style/circle';
import OlInteractionDraw from 'ol/interaction/draw';

import ToggleButton from '../ToggleButton/ToggleButton.jsx';
import MapUtil from '../../Util/MapUtil/MapUtil';

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
     * Whether the (multi)line, multi(point), (multi)polygon or circle should be
     * drawn.
     *
     * @type {String}
     */
    drawType: PropTypes.oneOf(['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'Circle']).isRequired,

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
    strokeColor: PropTypes.string
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    redliningLayerName: 'react-geo_redlining',
    fillColor: 'rgba(154, 26, 56, 0.5)',
    strokeColor: 'rgba(154, 26, 56, 0.8)'
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
      drawInteraction: null
    };
  }

  /**
   * `componentWillMount` method of the RedliningButton. Just calls a
   * `createRedliningLayer` method.
   *
   * @method
   */
  componentDidMount() {
    this.createRedliningLayer();
  }

  /**
   * Called when the button is toggled. If the button state is pressed, the
   * appropriate draw interaction will be created. Otherwise, by untoggling,
   * the same previously created interaction will be removed from the map.
   *
   * @param {Boolean} pressed Whether the redlining button is pressed or not.
   *
   * @method
   */
  onToggle = (pressed) => {
    if (pressed) {
      this.createDrawInteraction(pressed);
    } else {
      this.props.map.removeInteraction(this.state.drawInteraction);
    }

  }

  /**
   * Creates redlining vector layer and add this to the map.
   *
   * @method
   */
  createRedliningLayer = () => {
    const {
      redliningLayerName,
      fillColor,
      strokeColor,
      map
    } = this.props;

    let redliningLayer = MapUtil.getLayerByName(map, redliningLayerName);

    if (!redliningLayer) {
      redliningLayer = new OlLayerVector({
        name: redliningLayerName,
        source: new OlSourceVector({
          features: new OlCollection()
        }),
        style: new OlStyleStyle({
          fill: new OlStyleFill({
            color: fillColor
          }),
          stroke: new OlStyleStroke({
            color: strokeColor,
            width: 2
          }),
          image: new OlStyleCircle({
            radius: 7,
            fill: new OlStyleFill({
              color: fillColor
            })
          })
        })
      });
      map.addLayer(redliningLayer);
    }
    this.setState({redliningLayer});
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

    const drawInteraction = new OlInteractionDraw({
      source: this.state.redliningLayer.getSource(),
      type: drawType,
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
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <ToggleButton
        onToggle={this.onToggle}
        className={finalClassName}
        {...passThroughProps}
      />
    );
  }
}

export default RedliningButton;

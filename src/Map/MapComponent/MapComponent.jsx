import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import OlMap from 'ol/Map';

/**
 * Class representing a map.
 *
 * @class The MapComponent.
 * @extends React.PureComponent
 */
export class MapComponent extends PureComponent {

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    children: PropTypes.node,
    map: PropTypes.instanceOf(OlMap).isRequired,
    mapDivId: PropTypes.string
  }

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    mapDivId: 'map'
  }

  /**
   * Create a MapComponent.
   */
  constructor(props) {
    super(props);
  }

  /**
   * The componentDidMount function.
   */
  componentDidMount() {
    const {
      map,
      mapDivId
    } = this.props;

    map.setTarget(mapDivId);
  }

  /**
   * The componentWillUnmount function.
   */
  componentWillUnmount() {
    const {
      map
    } = this.props;

    map.setTarget(null);
  }

  /**
   * Invoked immediately after updating occured and also called for the initial
   * render.
   */
  componentDidUpdate() {
    this.props.map.updateSize();
  }

  /**
   * The render function.
   */
  render() {
    let mapDiv;

    const {
      map,
      mapDivId,
      children,
      ...passThroughProps
    } = this.props;

    if (map) {
      mapDiv = <div
        className="map"
        id={mapDivId}
        {...passThroughProps}
      >
        {children}
      </div>;
    }

    return (
      mapDiv
    );
  }
}

export default MapComponent;

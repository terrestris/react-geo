import React from 'react';
import PropTypes from 'prop-types';
import OlMap from 'ol/map';

/**
 * Class representating a map.
 *
 * @class The Map.
 * @extends React.Component
 */
export class MapComponent extends React.Component {

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    map: PropTypes.instanceOf(OlMap)
  }

  /**
   * Create a MapComponent.
   *
   * @constructs Map
   */
  constructor(props) {
    super(props);
  }

  /**
   * The componentDidMount function
   *
   * @method componentDidMount
   */
  componentDidMount() {
    this.props.map.setTarget('map');
  }

  /**
   * The render function.
   */
  render() {
    let mapDiv;

    const {
      map,
      ...passThroughProps
    } = this.props;

    if (map) {
      mapDiv = <div className="map" id="map" {...passThroughProps} />;
    }

    return (
      mapDiv
    );
  }
}

export default MapComponent;

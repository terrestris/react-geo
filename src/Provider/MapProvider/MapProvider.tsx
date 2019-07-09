import React from 'react';
import OlMap from 'ol/Map';

/**
 *
 * @export
 * @interface TimeSliderProps
 */
export interface MapProviderProps {
  /**
   * The map can be either an OlMap or a Promise that resolves with an OlMap
   * if your map is created asynchronously.
   *
   * @type {ol.Map|Promise}
   */
  map: OlMap | Promise<OlMap>;
}

interface MapProviderState {
  map?: OlMap;
  ready: boolean;
}

/**
 * The MapProvider.
 *
 * @type {Object}
 */
class MapProvider extends React.Component<MapProviderProps, MapProviderState> {

  /**
   * The constructor of the MapProvider sets the
   *
   * @constructs MapProvider
   * @param {Object} props The initial props.
   */
  constructor(props: MapProviderProps) {
    super(props);

    this.state = {
      map: null,
      ready: false
    };

    Promise.resolve(props.map)
      .then((map) => {
        this.setState({
          map: map,
          ready: true
        });
      });
  }

  /**
   * Returns the context for the children.
   *
   * @return {Object} The child context.
   */
  getChildContext() {
    const {
      map
    } = this.state;

    return { map };
  }

  /**
   * The render function.
   */
  render() {
    if (!this.state.ready) {
      return null;
    } else {
      return this.props.children;
    }
  }
}

export default MapProvider;

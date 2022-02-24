import * as React from 'react';
import OlMap from 'ol/Map';
import * as PropTypes from 'prop-types';
import Logger from '@terrestris/base-util/dist/Logger';

/**
 *
 * @export
 * @interface TimeSliderProps
 */
export interface MapProviderProps {
  /**
   * The map can be either an OlMap or a Promise that resolves with an OlMap
   * if your map is created asynchronously.
   */
  map: OlMap | Promise<OlMap>;
}

interface MapProviderState {
  map: OlMap | null;
  ready: boolean;
}

/**
 * The MapProvider.
 */
class MapProvider extends React.Component<MapProviderProps, MapProviderState> {

  /**
   * The child context types.
   */
  static childContextTypes = {
    map: PropTypes.instanceOf(OlMap)
  };

  /**
   * The constructor of the MapProvider sets the
   *
   * @constructs MapProvider
   * @param props The initial props.
   */
  constructor(props: MapProviderProps) {

    Logger.warn('MapProvider is deprecated and might be removed in an upcoming major release. ' +
      'Please consider to use the MapContext.');

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
      })
      .catch(error => {
        Logger.error(error);
      })
  }

  /**
   * Returns the context for the children.
   *
   * @return The child context.
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

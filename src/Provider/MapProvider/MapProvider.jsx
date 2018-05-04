import React from 'react';
import PropTypes from 'prop-types';
import OlMap from 'ol/Map';

/**
 * The MapProvider.
 *
 * @type {Object}
 */
class MapProvider extends React.Component {

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * The children of the MapProvider.
     * @type {Object}
     */
    children: PropTypes.node,

    /**
     * The map can be either an OlMap or a Promise that resolves with an OlMap
     * if your map is created asynchronously.
     *
     * @type {ol.Map|Promise}
     */
    map: PropTypes.oneOfType([
      PropTypes.instanceOf(OlMap),
      PropTypes.instanceOf(Promise)
    ]).isRequired
  }

  /**
   * The child context types.
   * @type {Object}
   */
  static childContextTypes = {
    map: PropTypes.instanceOf(OlMap)
  }

  /**
   * The constructor of the MapProvider sets the
   *
   * @constructs MapProvider
   * @param {Object} props The initial props.
   */
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      ready: false
    };

    Promise.resolve(props.map).then((map) => {
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

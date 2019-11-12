import * as React from 'react';
import { PureComponent } from 'react';
import OlMap from 'ol/Map';

// i18n
export interface WindowLocale {
}

interface MapComponentDefaultProps extends React.HTMLAttributes<HTMLDivElement> {
  mapDivId: string;
}

export interface MapComponentProps extends Partial<MapComponentDefaultProps> {
  children?: React.ReactChildren;
  map: OlMap;
}

/**
 * Class representing a map.
 *
 * @class The MapComponent.
 * @extends React.PureComponent
 */
export class MapComponent extends PureComponent<MapComponentProps> {

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    mapDivId: 'map'
  };

  /**
   * Create a MapComponent.
   */
  constructor(props: MapComponentProps) {
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
    const {
      map
    } = this.props;
    map.updateSize();
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

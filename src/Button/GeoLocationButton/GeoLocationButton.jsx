import React from 'react';
import PropTypes from 'prop-types';

import OlMap from 'ol/map';
import OlGeolocation from 'ol/geolocation';
import OlGeomLineString from 'ol/geom/linestring';
import OlOverlay from 'ol/overlay';

import {
  MathUtil,
  ToggleButton
} from '../../index';

import './GeoLocationButton.less';
import mapMarker from '../../../assets/geolocation-marker.png';
import mapMarkerHeading from '../../../assets/geolocation-marker-heading.png';

/**
 * The GeoLocationButton.
 *
 * @class The GeoLocationButton
 * @extends React.Component
 */
class GeoLocationButton extends React.Component {

  /**
   * The className added to this component.
   *
   * @type {String}
   * @private
   */
  className = 'react-geo-geolocationbutton';

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
     * Will be called if geolocation fails.
     *
     * @type {Function}
     */
    onError: PropTypes.func,

    /**
     * Will be called when position changes. Receives an object with the properties
     * position, accuracy, heading and speed
     *
     * @type {Function}
     */
    onGeolocationChange: PropTypes.func,

    /**
     * Whether to show a map marker at the current position.
     *
     * @type {Boolean}
     */
    showMarker: PropTypes.bool,

    /**
     * Whether to follow the current position.
     *
     * @type {Boolean}
     */
    follow: PropTypes.bool,

    /**
     * The openlayers tracking options.
     * @type {Object}
     */
    trackingoptions: PropTypes.object
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    onGeolocationChange: () => undefined,
    onError: () => undefined,
    showMarker: true,
    follow: true,
    trackingoptions: {
      maximumAge: 10000,
      enableHighAccuracy: true,
      timeout: 600000
    }
  }

  /**
   * Creates the MeasureButton.
   *
   * @constructs MeasureButton
   */
  constructor(props) {
    super(props);

    this.positions = new OlGeomLineString([], 'XYZM');

    this.state = {
    };
  }

  onGeolocationChange = () => {
    const position = this.geolocationInteraction.getPosition();
    const accuracy = this.geolocationInteraction.getAccuracy();
    let heading = this.geolocationInteraction.getHeading() || 0;
    const speed = this.geolocationInteraction.getSpeed() || 0;

    const x = position[0];
    const y = position[1];
    const fCoords = this.positions.getCoordinates();
    const previous = fCoords[fCoords.length - 1];
    const prevHeading = previous && previous[2];
    if (prevHeading) {
      let headingDiff = heading - MathUtil.mod(prevHeading);

      // force the rotation change to be less than 180°
      if (Math.abs(headingDiff) > Math.PI) {
        var sign = (headingDiff >= 0) ? 1 : -1;
        headingDiff = -sign * (2 * Math.PI - Math.abs(headingDiff));
      }
      heading = prevHeading + headingDiff;
    }
    this.positions.appendCoordinate([x, y, heading, Date.now()]);

    // only keep the 20 last coordinates
    this.positions.setCoordinates(this.positions.getCoordinates().slice(-20));

    if (this.markerEl) {
      if (heading && speed) {
        this.markerEl.src = mapMarkerHeading;
      } else {
        this.markerEl.src = mapMarker;
      }
    }

    this.updateView();

    this.props.onGeolocationChange({
      position,
      accuracy,
      heading,
      speed
    });
  }

  onGeolocationError = () => {
    this.props.onError();
  }

  /**
   * Called when the button is toggled, this method ensures that everything
   * is cleaned up when unpressed, and that geolocating can start when pressed.
   *
   * @method
   */
  onToggle = (pressed) => {
    if (!pressed && this.geolocationInteraction) {
      this.geolocationInteraction.un('change', this.onGeolocationChange);
      this.geolocationInteraction = null;
      if (this.marker) {
        this.props.map.removeOverlay(this.marker);
        this.markerEl.parentNode.removeChild(this.markerEl);
      }
    }
    if (!pressed) {
      return;
    }
    const map = this.props.map;
    const view = map.getView();

    // Geolocation Control
    this.geolocationInteraction = new OlGeolocation({
      projection: view.getProjection(),
      trackingOptions: this.props.trackingoptions
    });
    this.geolocationInteraction.setTracking(true);
    if (this.props.showMarker) {
      this.markerEl = document.getElementById('react-geolocation-overlay').cloneNode();
      this.markerEl.id = null;
      this.marker = new OlOverlay({
        positioning: 'center-center',
        element: this.markerEl,
        stopEvent: false
      });
      this.props.map.addOverlay(this.marker);
    }

    // add listeners
    this.geolocationInteraction.on('change', this.onGeolocationChange);
    this.geolocationInteraction.on('error', this.onGeolocationError);
  }

  // recenters the view by putting the given coordinates at 3/4 from the top or
  // the screen
  getCenterWithHeading = (position, rotation, resolution) => {
    var size = this.props.map.getSize();
    var height = size[1];

    return [
      position[0] - Math.sin(rotation) * height * resolution * 1 / 4,
      position[1] + Math.cos(rotation) * height * resolution * 1 / 4
    ];
  }

  updateView = () => {
    const view = this.props.map.getView();
    const deltaMean = 500; // the geolocation sampling period mean in ms
    let previousM = 0;
    // use sampling period to get a smooth transition
    let m = Date.now() - deltaMean * 1.5;
    m = Math.max(m, previousM);
    previousM = m;
    // interpolate position along positions LineString
    const c = this.positions.getCoordinateAtM(m, true);
    if (c) {
      if (this.props.follow) {
        view.setCenter(this.getCenterWithHeading(c, -c[2], view.getResolution()));
        view.setRotation(-c[2]);
      }
      if (this.props.showMarker) {
        this.marker.setPosition(c);
      }
    }
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      map,
      showMarker,
      follow,
      onGeolocationChange,
      onError,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <div>
        <img id='react-geolocation-overlay' />
        <ToggleButton
          onToggle={this.onToggle}
          className={finalClassName}
          {...passThroughProps}
        />
      </div>
    );
  }
}

export default GeoLocationButton;

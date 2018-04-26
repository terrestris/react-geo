import React from 'react';
import PropTypes from 'prop-types';

import OlMap from 'ol/Map';
import OlGeolocation from 'ol/Geolocation';
import OlGeomLineString from 'ol/geom/LineString';
import OlFeature from 'ol/feature';
import OlGeomPoint from 'ol/geom/point';
import OlLayerVector from 'ol/layer/vector';
import OlSourceVector from 'ol/source/vector';
import OlStyleStyle from 'ol/style/style';
import OlStyleIcon from 'ol/style/icon';

import { ToggleButton } from '../../index';

import MapUtil from '@terrestris/ol-util/src/MapUtil/MapUtil';
import MathUtil from '@terrestris/base-util/src/MathUtil/MathUtil';

import { CSS_PREFIX } from '../../constants';

import mapMarker from './geolocation-marker.png';
import mapMarkerHeading from './geolocation-marker-heading.png';

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
  className = `${CSS_PREFIX}geolocationbutton`;

  /**
   * The feature marking the current location.
   */
  _markerFeature = undefined;

  /**
   * The OpenLayers geolocation interaction.
   */
  _geoLocationInteraction = undefined;

  /**
   * The layer containing the markerFeature.
   */
  _geoLocationLayer = new OlLayerVector({
    name: 'react-geo_geolocationlayer',
    source: new OlSourceVector()
  });

  /**
   * The styleFunction for the geoLocationLayer. Shows a marker with arrow when
   * heading is not 0.
   */
  _styleFunction = (feature) => {
    const heading = feature.get('heading');
    const src = heading !== 0 ? mapMarkerHeading : mapMarker;
    const rotation = heading !== 0 ? heading * Math.PI / 180 : 0;

    return [new OlStyleStyle({
      image: new OlStyleIcon({
        rotation,
        src
      })
    })];
  };

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
     * The openlayers tracking options. See also
     * https://www.w3.org/TR/geolocation-API/#position_options_interface
     * @type {Object}
     */
    trackingoptions: PropTypes.shape({
      maximumAge: PropTypes.number,
      enableHighAccuracy: PropTypes.bool,
      timeout: PropTypes.number
    })
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    onGeolocationChange: () => undefined,
    onError: () => undefined,
    showMarker: true,
    follow: false,
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
    const {
      map,
      showMarker
    } = this.props;
    const allLayers = MapUtil.getAllLayers(map);

    this.positions = new OlGeomLineString([], 'XYZM');
    this._geoLocationLayer.setStyle(this._styleFunction);
    if (!allLayers.includes(this._geoLocationLayer)) {
      map.addLayer(this._geoLocationLayer);
    }
    this.state = {};

    if (showMarker) {
      this._markerFeature = new OlFeature();
      this._geoLocationLayer.getSource().addFeature(this._markerFeature);
    }
  }

  /**
   * Adds the markerFeature if not already done and adds it to the geoLocation
   * layer.
   */
  componentDidUpdate() {
    const {
      showMarker
    } = this.props;

    if (showMarker && !this._markerFeature) {
      this._markerFeature = new OlFeature();
      this._geoLocationLayer.getSource().addFeature(this._markerFeature);
    }
  }

  /**
   * Callback of the interactions on change event.
   */
  onGeolocationChange = () => {
    const position = this._geoLocationInteraction.getPosition();
    const accuracy = this._geoLocationInteraction.getAccuracy();
    let heading = this._geoLocationInteraction.getHeading() || 0;
    const speed = this._geoLocationInteraction.getSpeed() || 0;

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
    const {
      showMarker,
      trackingoptions,
      map
    } = this.props;

    const view = map.getView();

    if (!pressed) {
      if (this._geoLocationInteraction) {
        this._geoLocationInteraction.un('change', this.onGeolocationChange);
        this._geoLocationInteraction = null;
      }
      if (this._markerFeature) {
        this._markerFeature = undefined;
        this._geoLocationLayer.getSource().clear();
      }
      return;
    }

    // Geolocation Control
    this._geoLocationInteraction = new OlGeolocation({
      projection: view.getProjection(),
      trackingOptions: trackingoptions
    });
    this._geoLocationInteraction.setTracking(true);

    if (showMarker) {
      if (!this._markerFeature) {
        this._markerFeature = new OlFeature();
      }
      if (!this._geoLocationLayer.getSource().getFeatures().includes(this._markerFeature)) {
        this._geoLocationLayer.getSource().addFeature(this._markerFeature);
      }
      const heading = this._geoLocationInteraction.getHeading() || 0;
      const speed = this._geoLocationInteraction.getSpeed() || 0;
      this._markerFeature.set('speed', speed);
      this._markerFeature.set('heading', heading);
    }

    // add listeners
    this._geoLocationInteraction.on('change', this.onGeolocationChange);
    this._geoLocationInteraction.on('error', this.onGeolocationError);
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
        const pointGeometry = new OlGeomPoint([c[0], c[1]]);
        this._markerFeature.setGeometry(pointGeometry);
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
      <ToggleButton
        onToggle={this.onToggle}
        className={finalClassName}
        {...passThroughProps}
      />
    );
  }
}

export default GeoLocationButton;

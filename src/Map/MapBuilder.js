import Map from 'ol/map';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';

/**
 * @module Sol
 */

/**
 * This is the MapBuilder class.
 *
 * @class
 */
export class MapBuilder {

  /**
   * Constructs a mapbuilder instance.
   *
   * @param {String|Element} [target] The optional target where the map will be
   *     rendered in.
   * @param {Array<Number>} [center] The optional center of the map.
   * @param {Number} [zoom] The optional initial zoom of the map.
   * @constructs
   */
  constructor(target, center, zoom) {
    this.target = target || 'map';
    this.center = center || [0, 0];
    this.zoom = zoom || 0;
  }

  /**
   * Creates a map.
   *
   * @return {Map} The generated map.
   */
  createMap() {
    let map = new Map({
      target: this.target,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: this.center,
        zoom: this.zoom
      })
    });

    return map;
  }
}

export default MapBuilder;

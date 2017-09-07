import OlMap from 'ol/map';
import OlProjection from 'ol/proj';

import Logger from './Logger.js';

/**
 * Helper Class for the ol3 map.
 *
 * @class
 */
export class MapUtil {

  /**
   * Returns all interactions by the given name of a map.
   *
   * @param {ol.Map} map The map to use for lookup.
   * @param {String} name The name of the interaction to look for.
   * @return {ol.interaction[]} The list of result interactions.
   */
  static getInteractionsByName(map, name) {
    let interactionCandidates = [];

    if (!(map instanceof OlMap)) {
      Logger.debug('Input parameter map must be from type `ol.Map`.');
      return interactionCandidates;
    }

    let interactions = map.getInteractions();

    interactions.forEach(function(interaction) {
      if (interaction.get('name') === name) {
        interactionCandidates.push(interaction);
      }
    });

    return interactionCandidates;
  }

  /**
   * Returns all interactions by the given name of a map.
   *
   * @param {ol.Map} map The map to use for lookup.
   * @param {ol.interaction} clazz The class of the interaction to look for.
   * @return {ol.interaction[]} The list of result interactions.
   */
  static getInteractionsByClass(map, clazz) {
    let interactionCandidates = [];

    if (!(map instanceof OlMap)) {
      Logger.debug('Input parameter map must be from type `ol.Map`.');
      return interactionCandidates;
    }

    let interactions = map.getInteractions();

    interactions.forEach(function(interaction) {
      if (interaction instanceof clazz) {
        interactionCandidates.push(interaction);
      }
    });

    return interactionCandidates;
  }

  /**
   * Calculates the appropriate map resolution for a given scale in the given
   * units.
   *
   * See: https://gis.stackexchange.com/questions/158435/
   * how-to-get-current-scale-in-openlayers-3
   *
   * @method
   * @param {Number} scale The input scale to calculate the appropriate
   *                       resolution for.
   * @param {String} units The units to use for calculation (m or degrees).
   * @return {Number} The calculated resolution.
   */
  static getResolutionForScale (scale, units) {
    let dpi = 25.4 / 0.28;
    let mpu = OlProjection.METERS_PER_UNIT[units];
    let inchesPerMeter = 39.37;

    return parseFloat(scale) / (mpu * inchesPerMeter * dpi);
  }

  /**
   * Returns the appropriate scale for the given resolution and units.
   *
   * @method
   * @param {Number} resolution The resolutions to calculate the scale for.
   * @param {String} units The units the resolution is based on, typically
   *                       either 'm' or 'degrees'.
   * @return {Number} The appropriate scale.
   */
  static getScaleForResolution (resolution, units) {
    var dpi = 25.4 / 0.28;
    var mpu = OlProjection.METERS_PER_UNIT[units];
    var inchesPerMeter = 39.37;

    return parseFloat(resolution) * mpu * inchesPerMeter * dpi;
  }

}

export default MapUtil;

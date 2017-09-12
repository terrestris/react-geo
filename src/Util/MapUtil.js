import OlMap from 'ol/map';
import OlProjection from 'ol/proj';
import OlLayerGroup from 'ol/layer/group';

import FeatureUtil from './FeatureUtil';

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

  /**
   * Returns all layers of a collection. Even the hidden ones.
   *
   * @param {ol.Map|ol.layer.Group} collection The collection to get the layers
   *                                           from. This can be an ol.layer.Group
   *                                           or and ol.Map.
   * @param {function} [filter] A filter function that receives the layer.
   *                            If it returns true it will be included in the
   *                            returned layers.
   * @return {Array} An array of all Layers.
   */
  static getAllLayers(collection, filter = (() => true)) {
    if (!(collection instanceof OlMap) && !(collection instanceof OlLayerGroup)) {
      Logger.error('Input parameter collection must be from type `ol.Map`' +
        'or `ol.layer.Group`.');
      return [];
    }

    var layers = collection.getLayers().getArray();
    var allLayers = [];

    layers.forEach(function(layer) {
      if (layer instanceof OlLayerGroup) {
        MapUtil.getAllLayers(layer).forEach((layeri) => {
          if (filter(layeri)) {
            allLayers.push(layeri);
          }
        });
      }
      if (filter(layer)) {
        allLayers.push(layer);
      }
    });
    return allLayers;
  }

  /**
   * Get a layer by its key (ol_uid).
   *
   * @param {ol.Map} map The map to use for lookup.
   * @param {String} ol_uid The ol_uid of a layer.
   * @return {ol.layer.Layer} The layer.
   */
  static getLayerByOlUid = (map, ol_uid) => {
    const layers = MapUtil.getAllLayers(map);
    const layer = layers.find((l) => {
      return ol_uid === l.ol_uid.toString();
    });
    return layer;
  }

  /**
   * Returns the layer from the provided map by the given name
   * (parameter LAYERS).
   *
   * @param {ol.Map} map The map to use for lookup.
   * @param {String} name The name to get the layer by.
   * @return {ol.Layer} The result layer or undefined if the layer could not
   *                    be found.
   */
  static getLayerByName(map, name) {
    let layers = MapUtil.getAllLayers(map);
    let layerCandidate;

    for (let layer of layers) {
      if (layer.getSource &&
        layer.getSource().getParams &&
        layer.getSource().getParams()['LAYERS'] === name) {
        layerCandidate = layer;
        break;
      }
    }

    return layerCandidate;
  }

  /**
   * Returns the layer from the provided map by the given feature.
   *
   * @param {ol.Map} map The map to use for lookup.
   * @param {ol.Feature} feature The feature to get the layer by.
   * @param {Array} namespaces list of supported GeoServer namespaces.
   * @return {ol.Layer} The result layer or undefined if the layer could not
   *                    be found.
   */
  static getLayerByFeature(map, feature, namespaces) {
    let featureTypeName = FeatureUtil.getFeatureTypeName(feature);
    let layerCandidate;

    for (let namespace of namespaces) {
      let qualifiedFeatureTypeName = `${namespace}:${featureTypeName}`;
      let layer = MapUtil.getLayerByName(map, qualifiedFeatureTypeName);
      if (layer) {
        layerCandidate = layer;
        break;
      }
    }

    return layerCandidate;
  }

  /**
   * Returns all layers of the specified layer group recursively.
   *
   * @param {ol.Map} map The map to use for lookup.
   * @param {ol.Layer.Group} layerGroup The group to flatten.
   * @return {Array} The (flattened) layers from the group
   */
  static getLayersByGroup(map, layerGroup) {
    let layerCandidates = [];

    layerGroup.getLayers().forEach((layer) => {
      if (layer instanceof OlLayerGroup) {
        layerCandidates.push(...MapUtil.getLayersByGroup(map, layer));
      } else {
        layerCandidates.push(layer);
      }
    });

    return layerCandidates;
  }

  /**
   * Get information about the LayerPosition in the tree.
   *
   * @param {ol.layer.Layer} layer The layer to get the information.
   * @param {ol.layer.Group|ol.Map} [groupLayerOrMap] The groupLayer or map
   *                                                  containing the layer.
   * @return {Object} An object with these keys:
   *    {ol.layer.Group} groupLayer The groupLayer containing the layer.
   *    {Integer} position The position of the layer in the collection.
   */
  static getLayerPositionInfo = (layer, groupLayerOrMap) => {
    const groupLayer = groupLayerOrMap instanceof OlLayerGroup
      ? groupLayerOrMap
      : groupLayerOrMap.getLayerGroup();
    const layers = groupLayer.getLayers().getArray();
    let info = {};

    if (layers.indexOf(layer) < 0) {
      layers.forEach((childLayer) => {
        if (childLayer instanceof OlLayerGroup && !info.groupLayer) {
          info = MapUtil.getLayerPositionInfo(layer, childLayer);
        }
      });
    } else {
      info.position = layers.indexOf(layer);
      info.groupLayer = groupLayer;
    }
    return info;
  }

}

export default MapUtil;

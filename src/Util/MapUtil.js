import OlMap from 'ol/map';
import OlTileWMS from 'ol/source/tilewms';
import OlTileLayer from 'ol/layer/tile';
import OlTileGrid from 'ol/tilegrid/tilegrid';

import { reverse, unionWith, isEqual, find, isEmpty } from 'lodash';

import ObjectUtil from './ObjectUtil.js';

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
   * @static buildLayersFromInitialState - Description
   *
   * @param {type} mapLayerObjArray Description
   *
   * @return {type} Description
   */
  static buildLayersFromInitialState(mapLayerObjArray) {
    let layers = [];
    let tileGrids = [];

    if (isEmpty(mapLayerObjArray)) {
      return layers;
    }

    mapLayerObjArray.forEach(function(layerObj) {
      let tileGridObj = ObjectUtil.getValue('tileGrid', layerObj.source);
      let tileGrid = find(tileGrids,function(o) {
        return isEqual(o.getTileSize()[0], tileGridObj.tileSize) && isEqual(o.getTileSize()[1], tileGridObj.tileSize);
      });

      if (!tileGrid) {
        tileGrid = new OlTileGrid({
          resolutions: tileGridObj.tileGridResolutions,
          tileSize: [tileGridObj.tileSize, tileGridObj.tileSize],
          // origin: [180000, 5260000] // TODO check for already cached layers (e.g. BIS_FLURSTUECK)
          extent: [tileGridObj.tileGridExtent.lowerLeft.x, tileGridObj.tileGridExtent.lowerLeft.y, tileGridObj.tileGridExtent.upperRight.x, tileGridObj.tileGridExtent.upperRight.y]
        });
        tileGrids = unionWith(tileGrids, [tileGrid], isEqual);
      }

      if (layerObj.source.type === 'TileWMS') {
        let layerSource = new OlTileWMS({
          url: layerObj.source.url,
          attributions: layerObj.appearance.attribution,
          tileGrid: tileGrid,
          params: {
            'LAYERS': layerObj.source.layerNames,
            'TILED': layerObj.source.requestWithTiled
          }
        });

        layers.push(new OlTileLayer({
          source: layerSource,
          visible: layerObj.appearance.visible
        }));
      }

    });

    reverse(layers);

    return layers;
  }


}

export default MapUtil;

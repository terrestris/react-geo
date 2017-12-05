'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapUtil = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = require('ol/map');

var _map2 = _interopRequireDefault(_map);

var _proj = require('ol/proj');

var _proj2 = _interopRequireDefault(_proj);

var _tilewms = require('ol/source/tilewms');

var _tilewms2 = _interopRequireDefault(_tilewms);

var _tile = require('ol/layer/tile');

var _tile2 = _interopRequireDefault(_tile);

var _group = require('ol/layer/group');

var _group2 = _interopRequireDefault(_group);

var _base = require('ol/layer/base');

var _base2 = _interopRequireDefault(_base);

var _FeatureUtil = require('../FeatureUtil/FeatureUtil');

var _FeatureUtil2 = _interopRequireDefault(_FeatureUtil);

var _UrlUtil = require('../UrlUtil/UrlUtil');

var _UrlUtil2 = _interopRequireDefault(_UrlUtil);

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Helper Class for the ol3 map.
 *
 * @class
 */
var MapUtil = exports.MapUtil = function () {
  function MapUtil() {
    _classCallCheck(this, MapUtil);
  }

  _createClass(MapUtil, null, [{
    key: 'getInteractionsByName',


    /**
     * Returns all interactions by the given name of a map.
     *
     * @param {ol.Map} map The map to use for lookup.
     * @param {String} name The name of the interaction to look for.
     * @return {ol.interaction[]} The list of result interactions.
     */
    value: function getInteractionsByName(map, name) {
      var interactionCandidates = [];

      if (!(map instanceof _map2.default)) {
        _Logger2.default.debug('Input parameter map must be from type `ol.Map`.');
        return interactionCandidates;
      }

      var interactions = map.getInteractions();

      interactions.forEach(function (interaction) {
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

  }, {
    key: 'getInteractionsByClass',
    value: function getInteractionsByClass(map, clazz) {
      var interactionCandidates = [];

      if (!(map instanceof _map2.default)) {
        _Logger2.default.debug('Input parameter map must be from type `ol.Map`.');
        return interactionCandidates;
      }

      var interactions = map.getInteractions();

      interactions.forEach(function (interaction) {
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

  }, {
    key: 'getResolutionForScale',
    value: function getResolutionForScale(scale, units) {
      var dpi = 25.4 / 0.28;
      var mpu = _proj2.default.METERS_PER_UNIT[units];
      var inchesPerMeter = 39.37;

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

  }, {
    key: 'getScaleForResolution',
    value: function getScaleForResolution(resolution, units) {
      var dpi = 25.4 / 0.28;
      var mpu = _proj2.default.METERS_PER_UNIT[units];
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

  }, {
    key: 'getAllLayers',
    value: function getAllLayers(collection) {
      var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        return true;
      };

      if (!(collection instanceof _map2.default) && !(collection instanceof _group2.default)) {
        _Logger2.default.error('Input parameter collection must be from type `ol.Map`' + 'or `ol.layer.Group`.');
        return [];
      }

      var layers = collection.getLayers().getArray();
      var allLayers = [];

      layers.forEach(function (layer) {
        if (layer instanceof _group2.default) {
          MapUtil.getAllLayers(layer).forEach(function (layeri) {
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

  }, {
    key: 'getLayerByName',


    /**
     * Returns the layer from the provided map by the given name
     * (parameter LAYERS).
     *
     * @param {ol.Map} map The map to use for lookup.
     * @param {String} name The name to get the layer by.
     * @return {ol.Layer} The result layer or undefined if the layer could not
     *                    be found.
     */
    value: function getLayerByName(map, name) {
      var layers = MapUtil.getAllLayers(map);
      return layers.find(function (layer) {
        return layer.get('name') === name;
      });
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

  }, {
    key: 'getLayerByNameParam',
    value: function getLayerByNameParam(map, name) {
      var layers = MapUtil.getAllLayers(map);
      var layerCandidate = void 0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;

          if (layer.getSource && layer.getSource().getParams && layer.getSource().getParams()['LAYERS'] === name) {
            layerCandidate = layer;
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
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

  }, {
    key: 'getLayerByFeature',
    value: function getLayerByFeature(map, feature, namespaces) {
      var featureTypeName = _FeatureUtil2.default.getFeatureTypeName(feature);
      var layerCandidate = void 0;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = namespaces[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var namespace = _step2.value;

          var qualifiedFeatureTypeName = namespace + ':' + featureTypeName;
          var layer = MapUtil.getLayerByNameParam(map, qualifiedFeatureTypeName);
          if (layer) {
            layerCandidate = layer;
            break;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
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

  }, {
    key: 'getLayersByGroup',
    value: function getLayersByGroup(map, layerGroup) {
      var layerCandidates = [];

      layerGroup.getLayers().forEach(function (layer) {
        if (layer instanceof _group2.default) {
          layerCandidates.push.apply(layerCandidates, _toConsumableArray(MapUtil.getLayersByGroup(map, layer)));
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

  }, {
    key: 'getLegendGraphicUrl',


    /**
     * Get the getlegendGraphic url of a layer. Designed for geoserver.
     * Currently supported Sources:
     *  - ol.source.TileWms (with url configured)
     *
     * @param {ol.layer.Layer} layer The layer that you want to have a legendUrlfor.
     * @return {String|undefined} The getLegendGraphicUrl.
     */
    value: function getLegendGraphicUrl(layer, extraParams) {
      if (!(layer instanceof _base2.default)) {
        _Logger2.default.error('Invalid input parameter for MapUtil.getLegendGraphicUrl.');
        return;
      }

      if (layer instanceof _tile2.default && layer.getSource() instanceof _tilewms2.default) {
        var source = layer.getSource();
        var url = source.getUrls() ? source.getUrls()[0] : '';
        var params = {
          LAYER: source.getParams().LAYERS,
          VERSION: '1.3.0',
          SERVICE: 'WMS',
          REQUEST: 'getLegendGraphic',
          FORMAT: 'image/png'
        };

        var queryString = _UrlUtil2.default.objectToRequestString(Object.assign(params, extraParams));

        return url + '?' + queryString;
      } else {
        _Logger2.default.warn('Source of "' + layer.get('name') + '" is currently not supported ' + 'by MapUtil.getLegendGraphicUrl.');
        return;
      }
    }

    /**
     * Checks whether the resolution of the passed map's view lies inside of the
     * min- and max-resolution of the passed layer, e.g. whether the layer should
     * be displayed at the current map view resolution.
     *
     * @param {ol.layer.Layer} layer The layer to check.
     * @param {ol.Map} map The map to get the view resolution for comparison
     *     from.
     * @return {Boolean} Whether the resolution of the passed map's view lies
     *     inside of the min- and max-resolution of the passed layer, e.g. whether
     *     the layer should be displayed at the current map view resolution. Will
     *     be `false` when no `layer` or no `map` is passed or if the view of the
     *     map is falsy or does not have a resolution (yet).
     */

  }, {
    key: 'layerInResolutionRange',
    value: function layerInResolutionRange(layer, map) {
      var mapView = map && map.getView();
      var currentRes = mapView && mapView.getResolution();
      if (!layer || !mapView || !currentRes) {
        // It is questionable what we should return in this case, I opted for
        // false, since we cannot sanely determine a correct answer.
        return false;
      }
      var layerMinRes = layer.getMinResolution(); // default: 0 if unset
      var layerMaxRes = layer.getMaxResolution(); // default: Infinity if unset
      // minimum resolution is inclusive, maximum resolution exclusive
      var within = currentRes >= layerMinRes && currentRes < layerMaxRes;
      return within;
    }

    /**
     * Rounds a scalenumber in dependency to its size.
     *
     * @param  {Number} scale The exact scale
     * @return {Number} The roundedScale
     */

  }]);

  return MapUtil;
}();

MapUtil.getLayerByOlUid = function (map, ol_uid) {
  var layers = MapUtil.getAllLayers(map);
  var layer = layers.find(function (l) {
    return ol_uid === l.ol_uid.toString();
  });
  return layer;
};

MapUtil.getLayerPositionInfo = function (layer, groupLayerOrMap) {
  var groupLayer = groupLayerOrMap instanceof _group2.default ? groupLayerOrMap : groupLayerOrMap.getLayerGroup();
  var layers = groupLayer.getLayers().getArray();
  var info = {};

  if (layers.indexOf(layer) < 0) {
    layers.forEach(function (childLayer) {
      if (childLayer instanceof _group2.default && !info.groupLayer) {
        info = MapUtil.getLayerPositionInfo(layer, childLayer);
      }
    });
  } else {
    info.position = layers.indexOf(layer);
    info.groupLayer = groupLayer;
  }
  return info;
};

MapUtil.roundScale = function (scale) {
  var roundScale = void 0;
  if (scale < 100) {
    roundScale = Math.round(scale, 10);
  }
  if (scale >= 100 && scale < 10000) {
    roundScale = Math.round(scale / 10) * 10;
  }
  if (scale >= 10000 && scale < 1000000) {
    roundScale = Math.round(scale / 100) * 100;
  }
  if (scale >= 1000000) {
    roundScale = Math.round(scale / 1000) * 1000;
  }
  return roundScale;
};

exports.default = MapUtil;
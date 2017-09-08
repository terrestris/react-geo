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

var _Logger = require('./Logger.js');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  }]);

  return MapUtil;
}();

exports.default = MapUtil;
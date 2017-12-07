'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wmscapabilities = require('ol/format/wmscapabilities');

var _wmscapabilities2 = _interopRequireDefault(_wmscapabilities);

var _tilewms = require('ol/source/tilewms');

var _tilewms2 = _interopRequireDefault(_tilewms);

var _tile = require('ol/layer/tile');

var _tile2 = _interopRequireDefault(_tile);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Helper Class for the ol capabilities
 *
 * @class CapabilitiesUtil
 */
var CapabilitiesUtil = function () {
  function CapabilitiesUtil() {
    _classCallCheck(this, CapabilitiesUtil);
  }

  _createClass(CapabilitiesUtil, null, [{
    key: 'parseWmsCapabilities',


    /**
     * @static parseWmsCapabilities - function
     *
     * @param {String} capabilitiesUrl Url to WMS capabilities document
     *
     * @return {Object} An object representing the WMS capabilities.
     */
    value: function parseWmsCapabilities(capabilitiesUrl) {
      return fetch(capabilitiesUrl).then(function (response) {
        return response.text();
      }).then(function (data) {
        var wmsCapabilitiesParser = new _wmscapabilities2.default();
        return wmsCapabilitiesParser.read(data);
      });
    }

    /**
     * @static getLayersFromCapabilties - parse {OlLayerTile} from capabilities object
     *
     * @return {OlLayerTile[]} Array of OlLayerTile
     */

  }, {
    key: 'getLayersFromWmsCapabilties',
    value: function getLayersFromWmsCapabilties(capabilities) {
      var wmsVersion = (0, _lodash.get)(capabilities, 'version');
      var wmsAttribution = (0, _lodash.get)(capabilities, 'Service.AccessConstraints');
      var layersInCapabilities = (0, _lodash.get)(capabilities, 'Capability.Layer.Layer');
      var wmsGetMapConfig = (0, _lodash.get)(capabilities, 'Capability.Request.GetMap');
      var wmsGetFeatureInfoConfig = (0, _lodash.get)(capabilities, 'Capability.Request.GetFeatureInfo');
      var getMapUrl = (0, _lodash.get)(wmsGetMapConfig, 'DCPType[0].HTTP.Get.OnlineResource');
      var getFeatureInfoUrl = (0, _lodash.get)(wmsGetFeatureInfoConfig, 'DCPType[0].HTTP.Get.OnlineResource');
      return layersInCapabilities.map(function (layerObj) {
        return new _tile2.default({
          opacity: 1,
          title: (0, _lodash.get)(layerObj, 'Title'),
          abstract: (0, _lodash.get)(layerObj, 'Attribution'),
          getFeatureInfoUrl: getFeatureInfoUrl,
          source: new _tilewms2.default({
            url: getMapUrl,
            attributions: wmsAttribution,
            params: {
              'LAYERS': (0, _lodash.get)(layerObj, 'Name'),
              'VERSION': wmsVersion
            }
          })
        });
      });
    }
  }]);

  return CapabilitiesUtil;
}();

exports.default = CapabilitiesUtil;
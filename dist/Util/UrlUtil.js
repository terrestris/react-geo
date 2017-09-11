'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UrlUtil = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _urlParse = require('url-parse');

var _urlParse2 = _interopRequireDefault(_urlParse);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Helper Class for the URL handling.
 *
 * @class
 */
var UrlUtil = exports.UrlUtil = function () {
  function UrlUtil() {
    _classCallCheck(this, UrlUtil);
  }

  _createClass(UrlUtil, null, [{
    key: 'read',


    /**
     * Returns an object representation of an URL.
     *
     * @param {String} url The URL to read in.
     * @return {URL} The parsed URL object.
     */
    value: function read(url) {
      return new _urlParse2.default(url, null, true);
    }

    /**
     * Returns a string representation of an URL object.
     *
     * @param {URL} urlObj The URL object to write out.
     * @return {String} The stringified URL.
     */

  }, {
    key: 'write',
    value: function write(urlObj) {
      return urlObj.toString();
    }

    /**
     * Returns the base path of an URL.
     *
     * @param {String} url The URL to obtain the base path from.
     * @return {String} The base path.
     */

  }, {
    key: 'getBasePath',
    value: function getBasePath(url) {
      var urlObj = UrlUtil.read(url);

      return urlObj.protocol + '//' + urlObj.host + urlObj.pathname;
    }

    /**
     * Returns the query params of a given URL as object.
     *
     * @param {String} url The URL to get the query params from.
     * @return {Object} The query params of the given URL.
     */

  }, {
    key: 'getQueryParams',
    value: function getQueryParams(url) {
      var urlObj = UrlUtil.read(url);

      return urlObj.query;
    }

    /**
    * Joins some query parameters (defined by `keys`) of two query objects and
    * returns the joined query parameters.
    *
    *     var params1 = {FOO: 'foo,bar', BAZ: 'baz', HUMPTY: '1'};
    *     var params2 = {FOO: 'pupe,pape', BAZ: 'baz', DUMPTY: '42'};
    *     var keys = ['FOO'];
    *     var joined = this.joinQueryParams(params1, params2, keys);
    *     // joined is now
    *     // {FOO: 'foo,bar,pupe,pape', BAZ: 'baz', HUMPTY: '1'};
    *
    * @param {Object} params1 The first object with parameters, where certain
    *                         keys might have values that are joined with `,`.
    * @param {Object} params2 The second object with parameters, where certain
    *                         keys might have values that are joined with `,`.
    * @param {Array} keys The keys which we will consider for joining. Others
    *                     will be taken from the first object with parameters.
    * @return {Object} The joined query parameters.
    */

  }, {
    key: 'joinQueryParams',
    value: function joinQueryParams(params1, params2, keys) {
      var joined = (0, _lodash.clone)(params1);
      var comma = ',';

      keys.forEach(function (key) {
        if (joined[key]) {
          joined[key] = joined[key].split(comma).concat(params2[key].split(comma)).join(comma);
        }
      });

      return joined;
    }

    /**
     * This joins/bundles a given set of (typically WMS GetFeatureInfo) requests
     * by the base URL. E.g. it merges the following two requests:
     *
     * http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Shinji
     * http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa
     *
     * to
     *
     * http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Shinji,Kagawa
     *
     * @param {Array} featureInfoUrls An array of requests to bundle.
     * @param {Boolean} stringify Whether to stringify the output or not. If set
     *                            to false an object keyed by the base URL and
     *                            valued by the combined requests params will be
     *                            returned.
     * @param {Array} bundleParams An array of query params to bundle, default is
     *                             to ['LAYERS', 'QUERY_LAYERS', 'STYLES'].
     */

  }, {
    key: 'bundleOgcRequests',
    value: function bundleOgcRequests(featureInfoUrls, stringify) {
      var bundleParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['LAYERS', 'QUERY_LAYERS', 'STYLES'];

      var featureInfoUrlColl = {};

      featureInfoUrls.forEach(function (featureInfoUrl) {
        var featureInfoQueryParams = UrlUtil.getQueryParams(featureInfoUrl);
        var featureInfoBaseUrl = UrlUtil.getBasePath(featureInfoUrl);

        if (!featureInfoUrlColl[featureInfoBaseUrl]) {
          featureInfoUrlColl[featureInfoBaseUrl] = featureInfoQueryParams;
        } else {
          var existingQueryParams = featureInfoUrlColl[featureInfoBaseUrl];
          var newQueryParams = featureInfoQueryParams;

          featureInfoUrlColl[featureInfoBaseUrl] = UrlUtil.joinQueryParams(existingQueryParams, newQueryParams, bundleParams);
        }
      });

      var urls = [];
      if (stringify) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.entries(featureInfoUrlColl)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                baseUrl = _step$value[0],
                queryParams = _step$value[1];

            var urlObj = UrlUtil.read(baseUrl);
            urlObj.set('query', queryParams);
            urls.push(UrlUtil.write(urlObj));
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

        return urls;
      }

      return featureInfoUrlColl;
    }
  }]);

  return UrlUtil;
}();

exports.default = UrlUtil;
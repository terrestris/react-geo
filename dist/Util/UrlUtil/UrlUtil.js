'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UrlUtil = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _urlParse = require('url-parse');

var _urlParse2 = _interopRequireDefault(_urlParse);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _lodash = require('lodash');

var _isURL = require('validator/lib/isURL');

var _isURL2 = _interopRequireDefault(_isURL);

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
      return new _urlParse2.default(url, null, _queryString2.default.parse);
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
     * Returns the value of the given query param of the provided URL. If not
     * found, undefined will be returned.
     *
     * @param {String} url The URL to get the query params from.
     * @param {String} key The key to get the value from.
     * @return {String} The query param value.
     */

  }, {
    key: 'getQueryParam',
    value: function getQueryParam(url, key) {
      var queryParamsObj = UrlUtil.getQueryParams(url);
      var foundKey = Object.keys(queryParamsObj).find(function (k) {
        return k.toLowerCase() === key.toLowerCase();
      });

      return queryParamsObj[foundKey];
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
     * Checks if a given URL has the provided query parameter present.
     *
     * @param {String} url The URL to check.
     * @param {String} key The query parameter to check.
     * @return {Boolean} Whether the parameter is present or not.
     */

  }, {
    key: 'hasQueryParam',
    value: function hasQueryParam(url, key) {
      var queryParamsObj = UrlUtil.getQueryParams(url);

      return !!Object.keys(queryParamsObj).some(function (k) {
        return k.toLowerCase() === key.toLowerCase();
      });
    }

    /**
     * Creates a valid GetCapabilitiesRequest out of the given URL by checking if
     * SERVICE, REQUEST and VERSION are set.
     *
     * @param {String} url The URL to validate.
     * @param {String} service The service to set. Default is to 'WMS'.
     * @param {String} version The version to set. Default is to '1.3.0'.
     * @return {String} The validated URL.
     */

  }, {
    key: 'createValidGetCapabilitiesRequest',
    value: function createValidGetCapabilitiesRequest(url) {
      var service = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'WMS';
      var version = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1.3.0';

      var baseUrl = UrlUtil.getBasePath(url);
      var queryParamsObject = UrlUtil.getQueryParams(url);

      if (!UrlUtil.hasQueryParam(url, 'SERVICE')) {
        queryParamsObject['SERVICE'] = service;
      }

      if (!UrlUtil.hasQueryParam(url, 'REQUEST')) {
        queryParamsObject['REQUEST'] = 'GetCapabilities';
      }

      if (!UrlUtil.hasQueryParam(url, 'VERSION')) {
        queryParamsObject['VERSION'] = version;
      }

      return baseUrl + '?' + UrlUtil.objectToRequestString(queryParamsObject);
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

    /**
     * Transforms an object into a string containing requestParams (without
     * leading questionmark).
     *
     * @param {Object} object An object containing kvp for the request.
     *                        e.g. {height:400, width:200}
     * @return {String} The kvps as a requestString. e.g. 'height=400&width=200'
     */

  }, {
    key: 'objectToRequestString',
    value: function objectToRequestString(object) {
      var requestString = Object.keys(object).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
      }).join('&');

      return requestString;
    }

    /**
     * Checks if a given URL is valid. Implementation based on
     * https://www.npmjs.com/package/validator.
     *
     * @param {String} url The URL to validate.
     * @param {Object} opts The validation `validator` options.
     * @return {Boolean} Whether the URL is valid or not.
     */

  }, {
    key: 'isValid',
    value: function isValid(url) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        protocols: ['http', 'https', 'ftp'],
        require_tld: false,
        require_protocol: true,
        require_host: true,
        require_valid_protocol: true,
        allow_underscores: false,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false
      };

      return (0, _isURL2.default)(url, opts);
    }
  }]);

  return UrlUtil;
}();

exports.default = UrlUtil;
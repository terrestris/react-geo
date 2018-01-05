'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class provides some static methods which might be helpful when working
 * with objects.
 *
 * @class ObjectUtil
 */
var ObjectUtil = function () {
  function ObjectUtil() {
    _classCallCheck(this, ObjectUtil);
  }

  _createClass(ObjectUtil, null, [{
    key: 'getValue',


    /**
     * Method may be used to return a value of a given input object by a
     * provided query key. The query key can be used in two ways:
     *   * Single-value: Find the first matching key in the provided object
     *     (Use with caution as the object/array order may not be as
     *     expected and/or deterministic!).
     *   * Backslash ("/") separated value: Find the last (!) matching key
     *     in the provided object.
     *
     * @param {String} queryKey The key to be searched.
     * @param {Object} queryObject The object to be searched on
     *
     * @return {*} The target value or `undefined` if the given couldn't be
     *     found, or an object if a path was passed, from which we only could
     *     find a part, but not the most specific one.
     *     TODO Harmonize return values
     */
    value: function getValue(queryKey, queryObject) {
      var queryMatch;

      if (!(0, _lodash.isString)(queryKey)) {
        _Logger2.default.error('Missing input parameter queryKey <String>');
        return undefined;
      }
      if (!(0, _lodash.isObject)(queryObject)) {
        _Logger2.default.error('Missing input parameter queryObject <Object>');
        return undefined;
      }

      // if the queryKey contains backslashes we understand this as the
      // path in the object-hierarchy and will return the last matching
      // value
      if (queryKey.split('/').length > 1) {
        queryKey.split('/').forEach(function (key) {
          if (queryObject[key]) {
            queryObject = queryObject[key];
          } else {
            // if the last entry wasn't found return the last match
            return queryObject;
          }
        });
        return queryObject;
      }

      // iterate over the input object and return the first matching
      // value
      for (var key in queryObject) {

        // get the current value
        var value = queryObject[key];

        // if the given key is the queryKey, let's return the
        // corresponding value
        if (key === queryKey) {
          return value;
        }

        // TODO MJ: I do not like this too much, see the appropriate test.
        // I fear we can only reach this if the original key was not a path,
        // right?
        //
        // if the value is an array and the array contains an object as
        // well, let's call ourself recursively for this object
        if ((0, _lodash.isArray)(value)) {
          for (var i = 0; i < value.length; i++) {
            var val = value[i];
            if ((0, _lodash.isObject)(val)) {
              queryMatch = this.getValue(queryKey, val);
              if (queryMatch) {
                return queryMatch;
              }
            }
          }
        }

        // if the value is an object, let's call ourself recursively
        if ((0, _lodash.isObject)(value)) {
          queryMatch = this.getValue(queryKey, value);
          if (queryMatch) {
            return queryMatch;
          }
        }
      }

      // if we couldn't find any match, return undefined
      return undefined;
    }

    /**
     * Updates the given object at the given path with the value in place.
     * @param  {String} path   the path, seperated by dots
     * @param  {Object} object the object to update
     * @param  {any} value  the value to set
     */

  }, {
    key: 'updateObjectByStringPath',
    value: function updateObjectByStringPath(path, object, value) {
      var parts = path.split('.');

      parts.forEach(function (part, index) {
        if (index === parts.length - 1) {
          object[part] = value;
        } else {
          if (!object[part]) {
            object[part] = {};
          }
          object = object[part];
        }
      });
    }
  }]);

  return ObjectUtil;
}();

exports.default = ObjectUtil;
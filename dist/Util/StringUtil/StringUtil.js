'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Helper Class for Strings
 */
var StringUtil = function () {
  function StringUtil() {
    _classCallCheck(this, StringUtil);
  }

  _createClass(StringUtil, null, [{
    key: 'urlify',


    /**
     * Replaces any occurence of a link-like text with <a> tag.
     *
     * @param {String} text The string context to replace.
     * @return {String} The urlified string.
     */
    value: function urlify(text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;

      return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
    }

    /**
     * This coerces the value of a string by casting it to the most plausible
     * datatype, guessed by the value itself.
     *
     * @param {String} string The input string to coerce.
     * @return {*} The coerced value.
     */

  }, {
    key: 'coerce',
    value: function coerce(string) {
      if (!(string instanceof String || typeof string === 'string')) {
        return string;
      }

      var isFloatRegex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;

      if (string.toLowerCase() === 'true') {
        return true;
      } else if (string.toLowerCase() === 'false') {
        return false;
      } else if (isFloatRegex.test(string)) {
        return parseFloat(string);
      } else if (string.startsWith('[')) {
        return JSON.parse(string).map(function (a) {
          return StringUtil.coerce(a);
        });
      } else if (string.startsWith('{')) {
        var parsedObj = JSON.parse(string);
        var coercedObj = {};
        Object.keys(parsedObj).forEach(function (key) {
          coercedObj[key] = StringUtil.coerce(parsedObj[key]);
        });
        return coercedObj;
      } else {
        return string;
      }
    }
  }]);

  return StringUtil;
}();

exports.default = StringUtil;
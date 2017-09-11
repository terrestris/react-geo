"use strict";

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
    key: "urlify",


    /**
     * Replaces any occurence of a link-like text with <a> tag.
     *
     * @param {String} text The string context to replace.
     * @return {String} The urlified string.
     */
    value: function urlify(text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;

      return text.replace(urlRegex, "<a href=\"$1\" target=\"_blank\">$1</a>");
    }
  }]);

  return StringUtil;
}();

exports.default = StringUtil;
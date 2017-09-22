'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _StringUtil = require('../StringUtil/StringUtil');

var _StringUtil2 = _interopRequireDefault(_StringUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Helper Class for the ol features.
 *
 * @class FeatureUtil
 */
var FeatureUtil = function () {
  function FeatureUtil() {
    _classCallCheck(this, FeatureUtil);
  }

  _createClass(FeatureUtil, null, [{
    key: 'getFeatureTypeName',


    /**
     * Returns the featureType name out of a given feature. It assumes that
     * the feature has an ID in the following structure FEATURETYPE.FEATUREID.
     *
     * @param {ol.Feature} feature The feature to obtain the featureType
     *                             name from.
     * @return {String} The (unqualified) name of the featureType or undefined if
     *                  the name could not be picked.
     */
    value: function getFeatureTypeName(feature) {
      var featureId = feature.getId();
      var featureIdParts = featureId ? featureId.split('.') : featureId;

      return Array.isArray(featureIdParts) ? featureIdParts[0] : undefined;
    }

    /**
     * Resolves the given template string with the given feature attributes, e.g.
     * the template "Size of area is {{AREA_SIZE}} km²" would be to resolved
     * to "Size of area is 1909 km²" (assuming the feature's attribute AREA_SIZE
     * really exists).
     *
     * @param {ol.Feature} feature The feature to get the attributes from.
     * @param {String} template The template string to resolve.
     * @param {String} noValueFoundText The text to apply, if the templated value
     *                                  could not be found, default is to 'n.v.'.
     * @return {String} The resolved template string.
     */

  }, {
    key: 'resolveAttributeTemplate',
    value: function resolveAttributeTemplate(feature, template) {
      var noValueFoundText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'n.v.';

      var attributeTemplatePrefix = '\\{\\{';
      var attributeTemplateSuffix = '\\}\\}';
      var resolved = '';

      // Find any character between two braces (including the braces in the result)
      var regExp = new RegExp(attributeTemplatePrefix + '(.*?)' + attributeTemplateSuffix, 'g');
      var regExpRes = (0, _lodash.isString)(template) ? template.match(regExp) : null;

      // If we have a regex result, it means we found a placeholder in the
      // template and have to replace the placeholder with its appropriate value.
      if (regExpRes) {
        // Iterate over all regex match results and find the proper attribute
        // for the given placeholder, finally set the desired value to the hover.
        // field text
        regExpRes.forEach(function (res) {
          // We count every non matching candidate. If this count is equal to
          // the objects length, we assume that there is no match at all and
          // set the output value to the value of "noValueFoundText".
          var noMatchCnt = 0;

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Object.entries(feature.getProperties())[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _step$value = _slicedToArray(_step.value, 2),
                  key = _step$value[0],
                  value = _step$value[1];

              // Remove the suffixes and find the matching attribute column.
              var attributeName = res.slice(2, res.length - 2);

              if (attributeName.toLowerCase() === key.toLowerCase()) {
                template = template.replace(res, value);
                break;
              } else {
                noMatchCnt++;
              }
            }

            // No key match found for this feature (e.g. if key not
            // present or value is null).
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

          if (noMatchCnt === Object.keys(feature.getProperties()).length) {
            template = template.replace(res, noValueFoundText);
          }
        });
      }

      resolved = template;

      // Fallback if no feature attribute is found.
      if (!resolved) {
        resolved = feature.getId();
      }

      // Replace any HTTP url with an <a> element.
      resolved = _StringUtil2.default.urlify(resolved);

      // Replace all newline breaks with a html <br> tag.
      resolved = resolved.replace(/\n/g, '<br>');

      return resolved;
    }
  }]);

  return FeatureUtil;
}();

exports.default = FeatureUtil;
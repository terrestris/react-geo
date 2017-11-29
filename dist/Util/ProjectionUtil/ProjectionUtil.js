'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectionUtil = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _proj = require('proj4');

var _proj2 = _interopRequireDefault(_proj);

var _proj3 = require('ol/proj');

var _proj4 = _interopRequireDefault(_proj3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Helper class for ol/proj4 projection handling.
 *
 * @class
 */
var ProjectionUtil = exports.ProjectionUtil = function () {
  function ProjectionUtil() {
    _classCallCheck(this, ProjectionUtil);
  }

  _createClass(ProjectionUtil, null, [{
    key: 'initProj4Definitions',


    /**
     * Registers custom crs definitions to the application.
     *
     * @param {Object} proj4CrsDefinitions The (custom) proj4 definition strings.
     */
    value: function initProj4Definitions(proj4CrsDefinitions) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.entries(proj4CrsDefinitions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              projCode = _step$value[0],
              projDefinition = _step$value[1];

          _proj2.default.defs(projCode, projDefinition);
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

      _proj4.default.setProj4(_proj2.default);
    }

    /**
     * Registers custom crs mappings to allow automatic crs detection. Sometimes
     * FeatureCollections returned by the GeoServer may be associated with
     * crs identifiers (e.g. "urn:ogc:def:crs:EPSG::25832") that aren't
     * supported by proj4 and/or ol per default. Add appropriate
     * mappings to allow automatic crs detection by ol here.
     *
     * @param {Object} proj4CrsMappings The crs mappings.
     */

  }, {
    key: 'initProj4DefinitionMappings',
    value: function initProj4DefinitionMappings(proj4CrsMappings) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.entries(proj4CrsMappings)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              aliasProjCode = _step2$value[0],
              projCode = _step2$value[1];

          _proj2.default.defs(aliasProjCode, _proj2.default.defs(projCode));
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
    }
  }]);

  return ProjectionUtil;
}();

exports.default = ProjectionUtil;
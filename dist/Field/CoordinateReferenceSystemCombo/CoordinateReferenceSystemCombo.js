'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _autoComplete = require('antd/lib/auto-complete');

var _autoComplete2 = _interopRequireDefault(_autoComplete);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('antd/lib/auto-complete/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _index = require('../../index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Option = _autoComplete2.default.Option;

/**
 * Class representing a combo to choose coordinate projection system via a
 * dropdown menu and / or autocompletion
 *
 * @class The CoordinateReferenceSystemCombo
 * @extends React.Component
 */
var CoordinateReferenceSystemCombo = function (_React$Component) {
  _inherits(CoordinateReferenceSystemCombo, _React$Component);

  /**
   * Create a CRS combo.
   * @constructs CoordinateReferenceSystemCombo
   */
  function CoordinateReferenceSystemCombo(props) {
    _classCallCheck(this, CoordinateReferenceSystemCombo);

    var _this = _possibleConstructorReturn(this, (CoordinateReferenceSystemCombo.__proto__ || Object.getPrototypeOf(CoordinateReferenceSystemCombo)).call(this, props));

    _this.className = 'react-geo-coordinatereferencesystemcombo';

    _this.fetchCrs = function (searchVal) {
      var crsApiUrl = _this.props.crsApiUrl;


      var queryParameters = {
        format: 'json',
        q: searchVal
      };

      return fetch(crsApiUrl + '?' + _index.UrlUtil.objectToRequestString(queryParameters)).then(function (response) {
        return response.json();
      });
    };

    _this.transformResults = function (json) {
      var results = json.results;
      if (results && results.length > 0) {
        return results.map(function (obj) {
          return { code: obj.code, value: obj.name, proj4def: obj.proj4, bbox: obj.bbox };
        });
      } else {
        return [];
      }
    };

    _this.handleSearch = function (value) {
      var predefinedCrsDefinitions = _this.props.predefinedCrsDefinitions;


      if (!value || value.length === 0) {
        _this.setState({
          value: value,
          crsDefinitions: []
        });
        return;
      }

      if (!predefinedCrsDefinitions) {
        _this.fetchCrs(value).then(_this.transformResults).then(function (crsDefinitions) {
          return _this.setState({ crsDefinitions: crsDefinitions });
        }).catch(_this.onFetchError);
      } else {
        _this.setState({ value: value });
      }
    };

    _this.onCrsItemSelect = function (code) {
      var _this$props = _this.props,
          onSelect = _this$props.onSelect,
          predefinedCrsDefinitions = _this$props.predefinedCrsDefinitions;
      var crsDefinitions = _this.state.crsDefinitions;


      var crsObjects = predefinedCrsDefinitions || crsDefinitions;

      var selected = crsObjects.filter(function (i) {
        return i.code === code;
      })[0];
      _this.setState({
        value: selected
      });
      onSelect(selected);
    };

    _this.state = {
      crsDefinitions: [],
      value: null
    };

    _this.onCrsItemSelect = _this.onCrsItemSelect.bind(_this);
    return _this;
  }

  /**
   * Fetch CRS definitions from epsg.io for given search string
   *
   * @param {String} searchVal The search string
   */


  /**
   * The className added to this component.
   * @type {String}
   * @private
   */


  _createClass(CoordinateReferenceSystemCombo, [{
    key: 'onFetchError',


    /**
     * This function gets called when the EPSG.io fetch returns an error.
     * It logs the error to the console.
     *
     * @param {String} error The error string.
     */
    value: function onFetchError(error) {
      _index.Logger.error('Error while requesting in CoordinateReferenceSystemCombo: ' + error);
    }

    /**
     * This function transforms results of EPSG.io
     *
     * @param {Object} json The result object of EPSG.io-API, see where
     *                 https://github.com/klokantech/epsg.io#api-for-results   *
     * @return {Array} Array of CRS definitons used in CoordinateReferenceSystemCombo
     */


    /**
     * This function gets called when the EPSG.io fetch returns an error.
     * It logs the error to the console.
     *
     * @param {String} error The error string.
     */


    /**
     * Handles selection of a CRS item in Autocomplete
     *
     * @param {type} code EPSG code
     */

  }, {
    key: 'transformCrsObjectsToOptions',


    /**
     * Tranforms CRS object returned by EPSG.io to antd  Option component
     *
     * @param {type} crsObj Single plain CRS object returned by EPSG.io
     *
     * @return {Option} Option component to render
     */
    value: function transformCrsObjectsToOptions(crsObject) {
      return _react2.default.createElement(
        Option,
        { key: crsObject.code },
        crsObject.value + ' (EPSG:' + crsObject.code + ')'
      );
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          emptyTextPlaceholderText = _props.emptyTextPlaceholderText,
          onSelect = _props.onSelect,
          predefinedCrsDefinitions = _props.predefinedCrsDefinitions,
          passThroughOpts = _objectWithoutProperties(_props, ['className', 'emptyTextPlaceholderText', 'onSelect', 'predefinedCrsDefinitions']);

      var crsDefinitions = this.state.crsDefinitions;


      var crsObjects = predefinedCrsDefinitions || crsDefinitions;

      var finalClassName = className ? className + ' ' + this.className : this.className;

      return _react2.default.createElement(_autoComplete2.default, _extends({
        className: finalClassName,
        allowClear: true,
        dataSource: crsObjects.map(this.transformCrsObjectsToOptions),
        onSelect: this.onCrsItemSelect,
        onChange: this.handleSearch,
        placeholder: emptyTextPlaceholderText
      }, passThroughOpts));
    }
  }]);

  return CoordinateReferenceSystemCombo;
}(_react2.default.Component);

CoordinateReferenceSystemCombo.propTypes = {
  /**
   * The className which should be added.
   * @type {String}
   */
  className: _propTypes2.default.string,
  /**
   * The API to query for CRS definitions
   * default: http://epsg.io
   * @type {String}
   */
  crsApiUrl: _propTypes2.default.string,
  /**
   * The empty text set if no value is given / provided
   * @type {String}
   */
  emptyTextPlaceholderText: _propTypes2.default.string,
  /**
   * An array of predefined crs definitions habving at least value (name of
   * CRS) and code (e.g. EPSG-code of CRS) property
   * @type {Array}
   */
  predefinedCrsDefinitions: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    value: _propTypes2.default.string,
    code: _propTypes2.default.string
  })),
  /**
   * A function
   * @type {String}
   */
  onSelect: _propTypes2.default.func
};
CoordinateReferenceSystemCombo.defaultProps = {
  emptyTextPlaceholderText: 'Please select a CRS',
  crsApiUrl: 'https://epsg.io/',
  onSelect: function onSelect() {} };
exports.default = CoordinateReferenceSystemCombo;
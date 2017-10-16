'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NominatimSearch = undefined;

var _autoComplete = require('antd/lib/auto-complete');

var _autoComplete2 = _interopRequireDefault(_autoComplete);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('antd/lib/auto-complete/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Logger = require('../../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _UrlUtil = require('../../Util/UrlUtil/UrlUtil');

var _UrlUtil2 = _interopRequireDefault(_UrlUtil);

var _proj = require('ol/proj');

var _proj2 = _interopRequireDefault(_proj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Option = _autoComplete2.default.Option;

/**
 * The NominatimSearch.
 *
 * @class NominatimSearch
 * @extends React.Component
 */
var NominatimSearch = exports.NominatimSearch = function (_React$Component) {
  _inherits(NominatimSearch, _React$Component);

  /**
   * Create the NominatimSearch.
   *
   * @param {Object} props The initial props.
   * @constructs NominatimSearch
   */
  function NominatimSearch(props) {
    _classCallCheck(this, NominatimSearch);

    var _this = _possibleConstructorReturn(this, (NominatimSearch.__proto__ || Object.getPrototypeOf(NominatimSearch)).call(this, props));

    _this.className = 'react-geo-nominatimsearch';

    _this.state = {
      searchTerm: '',
      dataSource: []
    };
    _this.onUpdateInput = _this.onUpdateInput.bind(_this);
    _this.onMenuItemSelected = _this.onMenuItemSelected.bind(_this);
    return _this;
  }

  /**
   * Called if the input of the AutoComplete is being updated. It sets the
   * current inputValue as searchTerm and starts a search if the inputValue has
   * a length of at least `this.props.minChars` (default 3).
   *
   * @param {String|undefined} inputValue The inputValue. Undefined if clear btn
   *                                      is pressed.
   */


  /**
   * The className added to this component.
   * @type {String}
   * @private
   */


  _createClass(NominatimSearch, [{
    key: 'onUpdateInput',
    value: function onUpdateInput(inputValue) {
      var _this2 = this;

      this.setState({
        dataSource: []
      });

      this.setState({
        searchTerm: inputValue || ''
      }, function () {
        if (_this2.state.searchTerm.length >= _this2.props.minChars) {
          _this2.doSearch();
        }
      });
    }

    /**
     * Perform the search.
     */

  }, {
    key: 'doSearch',
    value: function doSearch() {
      var baseParams = {
        format: this.props.format,
        viewbox: this.props.viewbox,
        bounded: this.props.bounded,
        polygon_geojson: this.props.polygon_geojson,
        addressdetails: this.props.addressdetails,
        limit: this.props.limit,
        countrycodes: this.props.countrycodes,
        q: this.state.searchTerm
      };

      var getRequestParams = _UrlUtil2.default.objectToRequestString(baseParams);

      fetch('' + this.props.nominatimBaseUrl + getRequestParams).then(function (response) {
        return response.json();
      }).then(this.onFetchSuccess.bind(this)).catch(this.onFetchError.bind(this));
    }

    /**
     * This function gets called on success of the nominatim fetch.
     * It sets the response as dataSource.
     *
     * @param {Array<object>} response The found features.
     */

  }, {
    key: 'onFetchSuccess',
    value: function onFetchSuccess(response) {
      this.setState({
        dataSource: response
      });
    }

    /**
     * This function gets called when the nomintim fetch returns an error.
     * It logs the error to the console.
     *
     * @param {String} error The errorstring.
     */

  }, {
    key: 'onFetchError',
    value: function onFetchError(error) {
      _Logger2.default.error('Error while requesting Nominatim: ' + error);
    }

    /**
     * The function describes what to do when an item is selected.
     *
     * @param {value} key The key of the selected option.
     */

  }, {
    key: 'onMenuItemSelected',
    value: function onMenuItemSelected(key) {
      var selected = this.state.dataSource.filter(function (i) {
        return i.place_id === key;
      })[0];
      this.props.onSelect(selected, this.props.map);
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          nominatimBaseUrl = _props.nominatimBaseUrl,
          format = _props.format,
          viewbox = _props.viewbox,
          bounded = _props.bounded,
          polygon_geojson = _props.polygon_geojson,
          addressdetails = _props.addressdetails,
          limit = _props.limit,
          countrycodes = _props.countrycodes,
          map = _props.map,
          onSelect = _props.onSelect,
          renderOption = _props.renderOption,
          passThroughProps = _objectWithoutProperties(_props, ['className', 'nominatimBaseUrl', 'format', 'viewbox', 'bounded', 'polygon_geojson', 'addressdetails', 'limit', 'countrycodes', 'map', 'onSelect', 'renderOption']);

      var finalClassName = className ? className + ' ' + this.className : this.className;

      return _react2.default.createElement(_autoComplete2.default, _extends({
        className: finalClassName,
        allowClear: true,
        placeholder: 'Ortsname, Stra\xDFenname, Stadtteilname, POI usw.',
        dataSource: this.state.dataSource.map(renderOption.bind(this)),
        optionLabelProp: 'display_name',
        onChange: this.onUpdateInput,
        onSelect: this.onMenuItemSelected
      }, passThroughProps));
    }
  }]);

  return NominatimSearch;
}(_react2.default.Component);

NominatimSearch.propTypes = {
  className: _propTypes2.default.string,
  /**
   * The Nominatim Base URL. See http://wiki.openstreetmap.org/wiki/Nominatim
   * @type {String}
   */
  nominatimBaseUrl: _propTypes2.default.string,
  /**
   * Output format.
   * @type {String}
   */
  format: _propTypes2.default.string,
  /**
   * The preferred area to find search results in <left>,<top>,<right>,<bottom>.
   * @type {String}
   */
  viewbox: _propTypes2.default.string,
  /**
   * Restrict the results to only items contained with the bounding box.
   * Restricting the results to the bounding box also enables searching by
   * amenity only. For example a search query of just "[pub]" would normally be
   * rejected but with bounded=1 will result in a list of items matching within
   * the bounding box.
   * @type {Number}
   */
  bounded: _propTypes2.default.number,
  /**
   * Output geometry of results in geojson format.
   * @type {Number}
   */
  polygon_geojson: _propTypes2.default.number,
  /**
   * Include a breakdown of the address into elements.
   * @type {Number}
   */
  addressdetails: _propTypes2.default.number,
  /**
   * Limit the number of returned results.
   * @type {Number}
   */
  limit: _propTypes2.default.number,
  /**
   * Limit search results to a specific country (or a list of countries).
   * <countrycode> should be the ISO 3166-1alpha2 code, e.g. gb for the United
   * Kingdom, de for Germany, etc.
   * @type {String}
   */
  countrycodes: _propTypes2.default.string,
  /**
   * The ol.map where the map will zoom to.
   *
   * @type {Object}
   */
  map: _propTypes2.default.object.isRequired,
  /**
   * The minimal amount of characters entered in the input to start a search.
   * @type {Number}
   */
  minChars: _propTypes2.default.number,
  /**
   * A render function which gets called with the selected item as it is
   * returned by nominatim. It must return an `AutoComplete.Option`.
   *
   * @type {function}
   */
  renderOption: _propTypes2.default.func,
  /**
   * An onSelect function which gets called with the selected item as it is
   * returned by nominatim.
   * @type {function}
   */
  onSelect: _propTypes2.default.func,
  /**
   * The style object passed to the AutoComplete.
   * @type {Object}
   */
  style: _propTypes2.default.object
};
NominatimSearch.defaultProps = {
  nominatimBaseUrl: 'https://nominatim.openstreetmap.org/search?',
  format: 'json',
  viewbox: '-180,90,180,-90',
  bounded: 1,
  polygon_geojson: 1,
  addressdetails: 1,
  limit: 10,
  countrycodes: 'de',
  minChars: 3,
  /**
   * Create an AutoComplete.Option from the given data.
   *
   * @param {Object} item The tuple as an object.
   * @return {AutoComplete.Option} The returned option
   */
  renderOption: function renderOption(item) {
    return _react2.default.createElement(
      Option,
      { key: item.place_id },
      item.display_name
    );
  },
  /**
   * The default onSelect method if no onSelect prop is given. It zooms to the
   * selected item.
   *
   * @param {object} selected The selected item as it is returned by nominatim.
   */
  onSelect: function onSelect(selected, olMap) {
    if (selected && selected.boundingbox) {
      var olView = olMap.getView();
      var extent = [selected.boundingbox[2], selected.boundingbox[0], selected.boundingbox[3], selected.boundingbox[1]];

      extent = extent.map(function (coord) {
        return parseFloat(coord);
      });

      extent = _proj2.default.transformExtent(extent, 'EPSG:4326', olView.getProjection().getCode());

      olView.fit(extent, {
        duration: 500
      });
    }
  },
  style: {
    width: 200
  } };
exports.default = NominatimSearch;
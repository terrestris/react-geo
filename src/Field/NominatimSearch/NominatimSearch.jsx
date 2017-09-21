import React from 'react';
import PropTypes from 'prop-types';
import {
  AutoComplete,
} from 'antd';
const Option = AutoComplete.Option;

import Logger from '../../Util/Logger';
import UrlUtil from '../../Util/UrlUtil.js';
import olProj from 'ol/proj';

/**
 * The NominatimSearch.
 *
 * @class NominatimSearch
 * @extends React.Component
 */
export class NominatimSearch extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = 'react-geo-nominatimsearch'

  static propTypes = {
    className: PropTypes.string,
    nominatimBaseUrl: PropTypes.string,
    format: PropTypes.string,
    viewbox: PropTypes.string,
    bounded: PropTypes.number,
    polygon_geojson: PropTypes.number,
    addressdetails: PropTypes.number,
    limit: PropTypes.number,
    countrycodes: PropTypes.string,
    map: PropTypes.object.isRequired,
    minChars: PropTypes.number
  }

  static defaultProps = {
    /**
     * The Nominatim Base URL. See http://wiki.openstreetmap.org/wiki/Nominatim
     * @type {String}
     */
    nominatimBaseUrl: 'https://nominatim.openstreetmap.org/search?',

    /**
     * Output format.
     * @type {String}
     */
    format: 'json',

    /**
     * The preferred area to find search results in <left>,<top>,<right>,<bottom>.
     * @type {String}
     */
    viewbox: '-180,90,180,-90',

    /**
     * Restrict the results to only items contained with the bounding box.
     * Restricting the results to the bounding box also enables searching by
     * amenity only. For example a search query of just "[pub]" would normally be
     * rejected but with bounded=1 will result in a list of items matching within
     * the bounding box.
     * @type {Number}
     */
    bounded: 1,

    /**
     * Output geometry of results in geojson format.
     * @type {Number}
     */
    polygon_geojson: 1,

    /**
     * Include a breakdown of the address into elements.
     * @type {Number}
     */
    addressdetails: 1,

    /**
     * Limit the number of returned results.
     * @type {Number}
     */
    limit: 10,

    /**
     * Limit search results to a specific country (or a list of countries).
     * <countrycode> should be the ISO 3166-1alpha2 code, e.g. gb for the United
     * Kingdom, de for Germany, etc.
     * @type {String}
     */
    countrycodes: 'de',

    /**
     * The minimal amount of characters entered in the input to start a search.
     * @type {Number}
     */
    minChars: 3,

    /**
     * The style object passed to the AutoComplete.
     * @type {Object}
     */
    style: {
      width: 200
    }
  }

  /**
   * Create the NominatimSearch.
   *
   * @param {Object} props The initial props.
   * @constructs NominatimSearch
   */
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      dataSource: []
    };
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
  }

  /**
   * Called if the input of the AutoComplete is being updated. It sets the
   * current inputValue as searchTerm and starts a search if the inputValue has
   * a length of at least `this.props.minChars` (default 3).
   *
   * @param {String|undefined} inputValue The inputValue. Undefined if clear btn
   *                                      is pressed.
   */
  onUpdateInput(inputValue) {
    this.setState({
      dataSource: []
    });

    this.setState({
      searchTerm: inputValue || ''
    }, () => {
      if (this.state.searchTerm.length >= this.props.minChars) {
        this.doSearch();
      }
    });
  }

  /**
   * Perform the search.
   */
  doSearch() {
    const baseParams = {
      format: this.props.format,
      viewbox: this.props.viewbox,
      bounded: this.props.bounded,
      polygon_geojson: this.props.polygon_geojson,
      addressdetails: this.props.addressdetails,
      limit: this.props.limit,
      countrycodes: this.props.countrycodes,
      q: this.state.searchTerm
    };

    const getRequestParams = UrlUtil.objectToRequestString(baseParams);

    fetch(`${this.props.nominatimBaseUrl}${getRequestParams}`)
      .then(response => response.json())
      .then(this.onFetchSuccess.bind(this))
      .catch(this.onFetchError.bind(this));
  }

  /**
   * This function gets called on success of the nominatim fetch.
   * It sets the response as dataSource.
   *
   * @param {Array<object>} response The found features.
   */
  onFetchSuccess(response) {
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
  onFetchError(error) {
    Logger.error(`Error while requesting Nominatim: ${error}`);
  }

  /**
   * The function describes what to do when an item is selected.
   *
   * @param {value} key The key of the selected option.
   */
  onMenuItemSelected(key) {
    const selected = this.state.dataSource.filter(i => i.place_id === key)[0];

    if (selected && selected.boundingbox) {
      const olMap = this.props.map;
      const olView = olMap.getView();
      let extent = [
        selected.boundingbox[2],
        selected.boundingbox[0],
        selected.boundingbox[3],
        selected.boundingbox[1]
      ];

      extent = extent.map(function(coord) {
        return parseFloat(coord);
      });

      extent = olProj.transformExtent(extent, 'EPSG:4326',
        olView.getProjection().getCode());

      olView.fit(extent, {
        duration: 500
      });
    }
  }

  /**
   * Create an AutoComplete.Option from the given data.
   *
   * @param {Object} item The tuple as an object.
   * @return {AutoComplete.Option} The returned option
   */
  renderOption(item) {
    return (
      <Option key={item.place_id}>
        {item.display_name}
      </Option>
    );
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      nominatimBaseUrl,
      format,
      viewbox,
      bounded,
      polygon_geojson,
      addressdetails,
      limit,
      countrycodes,
      map,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <AutoComplete
        className={finalClassName}
        allowClear={true}
        placeholder="Ortsname, Straßenname, Stadtteilname, POI usw."
        dataSource={this.state.dataSource.map(this.renderOption)}
        optionLabelProp="display_name"
        onChange={this.onUpdateInput}
        onSelect={this.onMenuItemSelected}
        {...passThroughProps}
      />
    );
  }
}

export default NominatimSearch;

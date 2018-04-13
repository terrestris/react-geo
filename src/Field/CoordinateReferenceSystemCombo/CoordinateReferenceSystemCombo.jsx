import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
const Option = AutoComplete.Option;

import UrlUtil from '../../Util/UrlUtil/UrlUtil';
import Logger from '../../Util/Logger';

import { CSS_PREFIX } from '../../constants';

/**
 * Class representing a combo to choose coordinate projection system via a
 * dropdown menu and / or autocompletion
 *
 * @class The CoordinateReferenceSystemCombo
 * @extends React.Component
 */
class CoordinateReferenceSystemCombo extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}coordinatereferencesystemcombo`

  static propTypes = {
    /**
     * An optional CSS class which should be added.
     * @type {String}
     */
    className: PropTypes.string,
    /**
     * The API to query for CRS definitions
     * default: http://epsg.io
     * @type {String}
     */
    crsApiUrl: PropTypes.string,
    /**
     * The empty text set if no value is given / provided
     * @type {String}
     */
    emptyTextPlaceholderText: PropTypes.string,
    /**
     * An array of predefined crs definitions habving at least value (name of
     * CRS) and code (e.g. EPSG-code of CRS) property
     * @type {Array}
     */
    predefinedCrsDefinitions: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      code: PropTypes.string
    })),
    /**
     * A function
     * @type {String}
     */
    onSelect: PropTypes.func
  }

  static defaultProps = {
    emptyTextPlaceholderText: 'Please select a CRS',
    crsApiUrl: 'https://epsg.io/',
    onSelect: () => {}
  }

  /**
   * Create a CRS combo.
   * @constructs CoordinateReferenceSystemCombo
   */
  constructor(props) {
    super(props);

    this.state = {
      crsDefinitions: [],
      value: null
    };

    this.onCrsItemSelect = this.onCrsItemSelect.bind(this);
  }

  /**
   * Fetch CRS definitions from epsg.io for given search string
   *
   * @param {String} searchVal The search string
   */
  fetchCrs = (searchVal) => {
    const { crsApiUrl } = this.props;

    const queryParameters = {
      format: 'json',
      q: searchVal
    };

    return fetch(`${crsApiUrl}?${UrlUtil.objectToRequestString(queryParameters)}`)
      .then(response => response.json());
  }

  /**
   * This function gets called when the EPSG.io fetch returns an error.
   * It logs the error to the console.
   *
   * @param {String} error The error string.
   */
  onFetchError(error) {
    Logger.error(`Error while requesting in CoordinateReferenceSystemCombo: ${error}`);
  }

  /**
   * This function transforms results of EPSG.io
   *
   * @param {Object} json The result object of EPSG.io-API, see where
   *                 https://github.com/klokantech/epsg.io#api-for-results   *
   * @return {Array} Array of CRS definitons used in CoordinateReferenceSystemCombo
   */
  transformResults = (json) => {
    const results = json.results;
    if (results && results.length > 0) {
      return results.map(obj => ({code: obj.code, value: obj.name, proj4def: obj.proj4, bbox: obj.bbox}));
    } else {
      return [];
    }
  }

  /**
   * This function gets called when the EPSG.io fetch returns an error.
   * It logs the error to the console.
   *
   * @param {String} error The error string.
   */
  handleSearch = (value) => {
    const {
      predefinedCrsDefinitions
    } = this.props;

    if (!value || value.length === 0) {
      this.setState({
        value,
        crsDefinitions: []
      });
      return;
    }

    if (!predefinedCrsDefinitions) {
      this.fetchCrs(value)
        .then(this.transformResults)
        .then(crsDefinitions => this.setState({crsDefinitions}))
        .catch(this.onFetchError);
    } else {
      this.setState({ value });
    }
  }

  /**
   * Handles selection of a CRS item in Autocomplete
   *
   * @param {type} code EPSG code
   */
  onCrsItemSelect = (code) => {
    const {
      onSelect,
      predefinedCrsDefinitions
    } = this.props;

    const  {
      crsDefinitions
    } = this.state;

    const crsObjects = predefinedCrsDefinitions || crsDefinitions;

    const selected = crsObjects.filter(i => i.code === code)[0];
    this.setState({
      value: selected
    });
    onSelect(selected);
  }

  /**
   * Tranforms CRS object returned by EPSG.io to antd  Option component
   *
   * @param {type} crsObj Single plain CRS object returned by EPSG.io
   *
   * @return {Option} Option component to render
   */
  transformCrsObjectsToOptions(crsObject) {
    return (
      <Option key={crsObject.code}>
        {`${crsObject.value} (EPSG:${crsObject.code})`}
      </Option>
    );
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      emptyTextPlaceholderText,
      onSelect,
      predefinedCrsDefinitions,
      ...passThroughOpts
    } = this.props;

    const {
      crsDefinitions
    } = this.state;

    const crsObjects = predefinedCrsDefinitions || crsDefinitions;

    const finalClassName = className ? `${className} ${this.className}` : this.className;

    return (
      <AutoComplete
        className={finalClassName}
        allowClear={true}
        dataSource={crsObjects.map(this.transformCrsObjectsToOptions)}
        onSelect={this.onCrsItemSelect}
        onChange={this.handleSearch}
        placeholder={emptyTextPlaceholderText}
        {...passThroughOpts}
      >
      </AutoComplete>
    );
  }
}

export default CoordinateReferenceSystemCombo;

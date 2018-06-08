import React from 'react';
import PropTypes from 'prop-types';
import { Select, Spin } from 'antd';
const Option = Select.Option;

import Logger from '../../Util/Logger';
import WfsFilterUtil from '../../Util/WfsFilterUtil/WfsFilterUtil';
import { CSS_PREFIX } from '../../constants';

import OlMap from 'ol/map';
import OlFormatGeoJSON from 'ol/format/geojson';
import OlFormatWFS from 'ol/format/wfs';

/**
 * The WfsSearch field.
 * Implements an input field to do a WFS-GetFeature request.
 *
 * The GetFeature request is created with `ol.format.WFS.writeGetFeature`
 * so most of the WFS specific options work like document in the corresponding
 * API-docs: https://openlayers.org/en/latest/apidoc/ol.format.WFS.html#writeGetFeature
 *
 * @class WfsSearch
 * @extends React.Component
 */
export class WfsSearch extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}wfssearch`

  static propTypes = {
    /**
     * An optional CSS class which should be added.
     * @type {String}
     */
    className: PropTypes.string,
    /**
     * The base URL. Please make sure that the WFS-Server supports CORS.
     * @type {String}
     */
    baseUrl: PropTypes.string.isRequired,
    /**
     * An object mapping feature types to an array of attributes that should be searched through.
     * @type {Object}
     */
    searchAttributes: PropTypes.object.isRequired,
    /**
     * A nested object mapping feature types to an object of attribute details,
     * which are also mapped by search attribute name.
     *
     * Example:
     *   ```
     *   attributeDetails: {
     *    featType1: {
     *      attr1: {
     *        matchCase: true,
     *        type: 'number',
     *        exactSearch: false
     *      },
     *      attr2: {
     *        matchCase: false,
     *        type: 'string',
     *        exactSearch: true
     *      }
     *    },
     *    featType2: {...}
     *   }
     *   ```
     * @type {Object}
     */
    attributeDetails: PropTypes.objectOf(
      PropTypes.objectOf(
        PropTypes.shape({
          matchCase: PropTypes.bool,
          type: PropTypes.string,
          exactSearch: PropTypes.bool
        })
      )
    ),
    /**
     * The namespace URI used for features.
     * @type {String}
     */
    featureNS: PropTypes.string,
    /**
     * The prefix for the feature namespace.
     * @type {String}
     */
    featurePrefix: PropTypes.string,
    /**
     * The feature type names. Required.
     * @type {String[]}
     */
    featureTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    /**
     * SRS name. No srsName attribute will be set on geometries when this is not
     * provided.
     * @type {string}
     */
    srsName: PropTypes.string,
    /**
     * The output format of the response.
     * @type {string}
     */
    outputFormat: PropTypes.string,
    /**
     * Maximum number of features to fetch.
     * @type {number}
     */
    maxFeatures: PropTypes.number,
    /**
     * Geometry name to use in a BBOX filter.
     * @type {string}
     */
    geometryName: PropTypes.string,
    /**
     * Optional list of property names to serialize.
     * @type {String[]}
     */
    propertyNames: PropTypes.arrayOf(PropTypes.string),
    /**
     * Filter condition. See https://openlayers.org/en/latest/apidoc/ol.format.filter.html
     * for more information.
     * @type {object}
     */
    filter: PropTypes.object,
    /**
     * The ol.map to interact with on selection.
     *
     * @type {Object}
     */
    map: PropTypes.instanceOf(OlMap),
    /**
     * The minimal amount of characters entered in the input to start a search.
     * @type {Number}
     */
    minChars: PropTypes.number,
    /**
     * A render function which gets called with the selected item as it is
     * returned by the server. It must return an `AutoComplete.Option` with
     * `key={feature.id}`.
     * The default will display the property `name` if existing or the `id` to
     * and requires an `id` field on the feature. A custom function is required
     * if your features don't have an `id` field.
     *
     * @type {function}
     */
    renderOption: PropTypes.func,
    /**
     * An onSelect function which gets called with the selected feature as it is
     * returned by server.
     * The default function will create a searchlayer, adds the feature and will
     * zoom to its extend.
     * @type {function}
     */
    onSelect: PropTypes.func,
    /**
     * Options which are added to the fetch-POST-request. credentials is set to
     * 'same-origin' as default but can be overwritten. See also
     * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
     * @type {object}
     */
    additionalFetchOptions: PropTypes.object,
    /**
     * Options which are passed to the constructor of the ol.format.WFS.
     * compare: https://openlayers.org/en/latest/apidoc/ol.format.WFS.html
     * @type {object}
     */
    wfsFormatOptions: PropTypes.object,
    /**
     * Which prop value of option will render as content of select.
     * @type {string}
     */
    optionLabelProp: PropTypes.string,
    /**
     * Delay in ms before actually sending requests.
     * @type {number}
     */
    delay: PropTypes.number
  }

  static defaultProps = {
    srsName: 'EPSG:3857',
    outputFormat: 'application/json',
    minChars: 3,
    additionalFetchOptions: {},
    optionLabelProp: 'title',
    attributeDetails: {},
    delay: 300,
    /**
     * Create an AutoComplete.Option from the given data.
     *
     * @param {Object} feature The feature as returned by the server.
     * @return {AutoComplete.Option} The AutoComplete.Option that will be
     * rendered for each feature.
     */
    renderOption: feature => {
      const display = feature.properties.name ? feature.properties.name : feature.id;
      return (
        <Option key={feature.id} title={display}>
          {display}
        </Option>
      );
    },

    /**
     * The default onSelect method if no onSelect prop is given. It zooms to the
     * selected item.
     *
     * @param {object} feature The selected feature as returned by the server.
     * @param {ol.map} olMap The openlayers map that was passed via prop.
     */
    onSelect: (feature, olMap) => {
      if (feature) {
        const olView = olMap.getView();
        const geoJsonFormat = new OlFormatGeoJSON();
        const olFeature = geoJsonFormat.readFeature(feature);
        const geometry = olFeature.getGeometry();

        if (geometry) {
          olView.fit(geometry, {
            duration: 500
          });
        }
      }
    },
    style: {
      width: 200
    }
  }

  /**
   * Create the WfsSearch.
   *
   * @param {Object} props The initial props.
   * @constructs WfsSearch
   */
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      data: [],
      latestRequestTime: 0
    };
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
  }

  /**
   * Called if the input of the AutoComplete is being updated. It sets the
   * current inputValue as searchTerm and starts a search if the inputValue has
   * a length of at least `this.props.minChars` (default 3).
   *
   * @param {String|undefined} value The inputValue. Undefined if clear btn
   *                                      is pressed.
   */
  onUpdateInput(value) {
    this.setState({
      data: []
    });

    if (value) {
      this.setState({
        searchTerm: value
      }, () => {
        if (this.state.searchTerm.length >= this.props.minChars) {
          this.doSearch();
        }
      });
    }
  }

  /**
   *
   */
  getCombinedRequests() {
    const {
      featureNS,
      featurePrefix,
      featureTypes,
      geometryName,
      maxFeatures,
      outputFormat,
      propertyNames,
      srsName,
      wfsFormatOptions,
      searchAttributes,
      attributeDetails
    } = this.props;

    const { searchTerm } = this.state;

    const requests = featureTypes.map(featureType => {

      const filter = WfsFilterUtil.createWfsFilter(
        featureType, searchTerm, searchAttributes, attributeDetails
      );
      const options = {
        featureNS,
        featurePrefix,
        featureTypes: [featureType],
        geometryName,
        maxFeatures,
        outputFormat,
        propertyNames,
        srsName,
        filter: filter
      };

      const wfsFormat = new OlFormatWFS(wfsFormatOptions);
      return wfsFormat.writeGetFeature(options);
    });

    const request = requests[0];

    requests.forEach(req => {
      if (req !== request) {
        const query = req.querySelector('Query');
        request.append(query);
      }
    });

    return request;
  }

  /**
   * Perform the search.
   * @private
   */
  doSearch() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    const {
      additionalFetchOptions,
      baseUrl
    } = this.props;

    const request = this.getCombinedRequests();
    const fetchTime = new Date();

    this.timeoutHandle = setTimeout(() => {
      this.setState({
        fetching: true,
        latestRequestTime: fetchTime.getTime()
      }, () => {
        fetch(`${baseUrl}`, {
          method: 'POST',
          credentials: additionalFetchOptions.credentials
            ? additionalFetchOptions.credentials
            : 'same-origin',
          body: new XMLSerializer().serializeToString(request),
          ...additionalFetchOptions
        })
          .then(response => response.json())
          .then(this.onFetchSuccess.bind(this, fetchTime.getTime()))
          .catch(this.onFetchError.bind(this));
      });
    }, this.props.delay);
  }

  /**
   * This function gets called on success of the WFS GetFeature fetch request.
   * It sets the response as data.
   *
   * @param {Number} searchTime the timestamp when the search was sent out
   * @param {Array<object>} response The found features.
   */
  onFetchSuccess(searchTime, response) {
    const latestTime = this.state.latestRequestTime;
    if (latestTime !== searchTime) {
      return;
    }
    const data = response.features ? response.features : [];
    data.forEach(feature => feature.searchTerm = this.state.searchTerm);
    this.setState({
      data,
      fetching: false
    });
  }

  /**
   * This function gets called when the WFS GetFeature fetch request returns an error.
   * It logs the error to the console.
   *
   * @param {String} error The errorstring.
   */
  onFetchError(error) {
    Logger.error(`Error while requesting WFS GetFeature: ${error}`);
    this.setState({
      fetching: false
    });
  }

  /**
   * The function describes what to do when an item is selected.
   *
   * @param {String|number} value The value of the selected option.
   */
  onMenuItemSelected(value) {
    const {
      map
    } = this.props;
    const selectedFeature = this.state.data.filter(i => i.id === value)[0];
    this.props.onSelect(selectedFeature, map);
  }

  /**
   * The render function.
   */
  render() {
    const {
      data,
      fetching
    } = this.state;

    const {
      additionalFetchOptions,
      baseUrl,
      className,
      featureNS,
      featurePrefix,
      featureTypes,
      filter,
      geometryName,
      map,
      maxFeatures,
      minChars,
      optionLabelProp,
      outputFormat,
      onSelect,
      propertyNames,
      renderOption,
      searchAttributes,
      srsName,
      wfsFormatOptions,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <Select
        mode="combobox"
        className={finalClassName}
        defaultActiveFirstOption={false}
        allowClear={true}
        onChange={this.onUpdateInput}
        onSelect={this.onMenuItemSelected}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        optionLabelProp={optionLabelProp}
        filterOption={false}
        showArrow={false}
        {...passThroughProps}
      >
        {data.map(renderOption.bind(this))}
      </Select>
    );
  }
}

export default WfsSearch;

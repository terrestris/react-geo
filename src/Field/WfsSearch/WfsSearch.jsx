import React from 'react';
import PropTypes from 'prop-types';
import {
  AutoComplete,
  Spin
} from 'antd';
const Option = AutoComplete.Option;
import isFunction from 'lodash/isFunction.js';
import debounce from 'lodash/debounce.js';

import Logger from '@terrestris/base-util/src/Logger';
import WfsFilterUtil from '@terrestris/ol-util/src/WfsFilterUtil/WfsFilterUtil';
import { CSS_PREFIX } from '../../constants';

import OlMap from 'ol/Map';
import OlFormatGeoJSON from 'ol/format/GeoJSON';

/**
 * The WfsSearch field.
 * Implements an input field to do a WFS-GetFeature request.
 *
 * The GetFeature request is created with `ol.format.WFS.writeGetFeature`
 * so most of the WFS specific options work like document in the corresponding
 * API-docs: https://openlayers.org/en/latest/apidoc/module-ol_format_WFS.html
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
     * @type {String}
     */
    srsName: PropTypes.string,
    /**
     * The output format of the response.
     * @type {String}
     */
    outputFormat: PropTypes.string,
    /**
     * Maximum number of features to fetch.
     * @type {Number}
     */
    maxFeatures: PropTypes.number,
    /**
     * Geometry name to use in a BBOX filter.
     * @type {String}
     */
    geometryName: PropTypes.string,
    /**
     * Optional list of property names to serialize.
     * @type {String[]}
     */
    propertyNames: PropTypes.arrayOf(PropTypes.string),
    /**
     * Filter condition. See https://openlayers.org/en/latest/apidoc/module-ol_format_filter.html
     * for more information.
     * @type {Object}
     */
    filter: PropTypes.object,
    /**
     * The ol.map to interact with on selection.
     *
     * @type {ol.Map}
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
     * @type {Function}
     */
    renderOption: PropTypes.func,
    /**
     * An onSelect function which gets called with the selected feature as it is
     * returned by server.
     * The default function will create a searchlayer, adds the feature and will
     * zoom to its extend.
     * @type {Function}
     */
    onSelect: PropTypes.func,
    /**
     * An onChange function which gets called with the current value of the
     * field.
     * @type {Function}
     */
    onChange: PropTypes.func,
    /**
      * Optional callback function, that will be called before WFS search starts.
      * Can be useful if input value manipulation is needed (e.g. umlaut
      * replacement `ä => oa` etc.)
      * @type {Function}
      */
    onBeforeSearch: PropTypes.func,
    /**
     * Options which are added to the fetch-POST-request. credentials is set to
     * 'same-origin' as default but can be overwritten. See also
     * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
     * @type {Object}
     */
    additionalFetchOptions: PropTypes.object,
    /**
     * Options which are passed to the constructor of the ol.format.WFS.
     * compare: https://openlayers.org/en/latest/apidoc/ol.format.WFS.html
     * @type {Object}
     */
    wfsFormatOptions: PropTypes.object,
    /**
     * Which prop value of option will render as content of select.
     * @type {String}
     */
    displayValue: PropTypes.string,
    /**
     * Delay in ms before actually sending requests.
     * @type {Number}
     */
    delay: PropTypes.number
  }

  static defaultProps = {
    srsName: 'EPSG:3857',
    outputFormat: 'application/json',
    minChars: 3,
    additionalFetchOptions: {},
    displayValue: 'name',
    attributeDetails: {},
    delay: 300,
    /**
     * Create an AutoComplete.Option from the given data.
     *
     * @param {Object} feature The feature as returned by the server.
     * @param {Object} props The current props of the component.
     * @return {AutoComplete.Option} The AutoComplete.Option that will be
     * rendered for each feature.
     */
    renderOption: (feature, props) => {
      const {
        displayValue
      } = props;

      const display = feature.properties[displayValue] ?
        feature.properties[displayValue] : feature.id;

      return (
        <Option
          value={display}
          key={feature.id}
          title={display}
        >
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
      data: []
    };
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
    // delay requests invoking
    this.doSearch = debounce(this.doSearch, this.props.delay);
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
    const {
      minChars,
      onChange,
      onBeforeSearch
    } = this.props;

    this.setState({
      data: []
    });

    if (isFunction(onBeforeSearch)) {
      value = onBeforeSearch(value);
    }

    this.setState({
      searchTerm: value
    }, () => {
      if (this.state.searchTerm && this.state.searchTerm.length >= minChars) {
        this.doSearch();
      }
    });

    if (isFunction(onChange)) {
      onChange(value);
    }
  }

  /**
   * Perform the search.
   * @private
   */
  doSearch() {
    const {
      additionalFetchOptions,
      baseUrl,
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

    const searchOpts = {
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
    };

    const request = WfsFilterUtil.getCombinedRequests(
      searchOpts, this.state.searchTerm
    );

    if (request) {
      this.setState({
        fetching: true
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
          .then(this.onFetchSuccess.bind(this))
          .catch(this.onFetchError.bind(this));
      });
    } else {
      this.onFetchError('Missing GetFeature request parameters');
    }
  }

  /**
   * This function gets called on success of the WFS GetFeature fetch request.
   * It sets the response as data.
   *
   * @param {Array<object>} response The found features.
   */
  onFetchSuccess(response) {
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
   * @param {Node} option The selected option.
   */
  onMenuItemSelected(value, option) {
    const {
      map
    } = this.props;

    const selectedFeature = this.state.data.filter(feat => feat.id === option.key)[0];
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
      outputFormat,
      onChange,
      onSelect,
      propertyNames,
      renderOption,
      searchAttributes,
      attributeDetails,
      srsName,
      wfsFormatOptions,
      displayValue,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <AutoComplete
        className={finalClassName}
        defaultActiveFirstOption={false}
        allowClear={true}
        onChange={this.onUpdateInput}
        onSelect={this.onMenuItemSelected}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        showArrow={false}
        {...passThroughProps}
      >
        {
          data.map(d => {
            return renderOption(d, this.props);
          })
        }
      </AutoComplete>
    );
  }
}

export default WfsSearch;

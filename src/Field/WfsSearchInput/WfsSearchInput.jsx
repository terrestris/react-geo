import React from 'react';
import PropTypes from 'prop-types';

import {
  Input,
  Icon
} from 'antd';

import OlMap from 'ol/Map';

import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';

import Logger from '@terrestris/base-util/dist/Logger';
import WfsFilterUtil from '@terrestris/ol-util/dist/WfsFilterUtil/WfsFilterUtil';

import { CSS_PREFIX } from '../../constants';

/**
 * The WfsSearchInput field.
 * Implements an input field to do a WFS-GetFeature request.
 *
 * The GetFeature request is created with `ol.format.WFS.writeGetFeature`
 * so most of the WFS specific options work like document in the corresponding
 * API-docs: https://openlayers.org/en/latest/apidoc/module-ol_format_WFS.html
 *
 * @class WfsSearchInput
 * @extends React.Component
 */
export class WfsSearchInput extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}wfssearchinput`

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
     * Filter condition. See https://openlayers.org/en/latest/apidoc/module-ol_format_filter.html.
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
     * An onFetchSuccess callback function which gets called with the
     * successfully fetched data.
     * Please note: if omitted only data fetch will be performed and no data
     * will be shown afterwards!
     * @type {Function}
     */
    onFetchSuccess: PropTypes.func,
    /**
     * An onFetchError callback function which gets called if data fetch is
     * failed.
     * @type {Function}
     */
    onFetchError: PropTypes.func,
    /**
     * Optional callback function, that will be called if 'clear' button of
     * input field was clicked.
     * @type {Function}
     */
    onClearClick: PropTypes.func,
    /**
      * Optional callback function, that will be called before WFS search starts.
      * Can be useful if input value manipulation is needed before (e.g. umlaut
      * replacement `ä => ae` etc.)
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
     * compare: https://openlayers.org/en/latest/apidoc/module-ol_format_WFS.html
     * @type {Object}
     */
    wfsFormatOptions: PropTypes.object,
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
    attributeDetails: {},
    delay: 300
  }

  /**
   * Create the WfsSearchInput.
   *
   * @param {Object} props The initial props.
   * @constructs WfsSearchInput
   */
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      data: []
    };
    this.onUpdateInput = this.onUpdateInput.bind(this);
    // delay requests invoking
    this.doSearch = debounce(this.doSearch, this.props.delay);
  }

  /**
   * Called if the input is being updated. It sets the current inputValue
   * as searchTerm and starts a search if the inputValue has
   * a length of at least `this.props.minChars` (default 3).
   *
   * @param {Event|undefined} evt The input value from `keyup` event.
   * Gets undefined if clear btn is pressed.
   */
  onUpdateInput(evt) {
    const {
      minChars,
      onBeforeSearch
    } = this.props;

    this.setState({
      data: []
    });

    let value = '';

    if (evt && evt.target && evt.target.value) {
      value = evt.target.value;
    }

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
   * If an additional function `onFetchSuccess` is provided, it will be called
   * as callback.
   * @param {Array<object>} response The found features.
   */
  onFetchSuccess(response) {
    const {
      onFetchSuccess
    } = this.props;
    const data = response.features ? response.features : [];
    data.forEach(feature => feature.searchTerm = this.state.searchTerm);
    this.setState({
      data,
      fetching: false
    }, () => {
      if (isFunction(onFetchSuccess)) {
        onFetchSuccess(data);
      }
    });
  }

  /**
   * This function gets called when the WFS GetFeature fetch request returns an error.
   * It logs the error to the console.
   * If an additional function `onFetchSuccess` is provided, it will be called
   * as callback.
   *
   * @param {String} error The errorstring.
   */
  onFetchError(error) {
    const {
      onFetchError
    } = this.props;
    Logger.error(`Error while requesting WFS GetFeature: ${error}`);
    this.setState({
      fetching: false
    }, () => {
      if (isFunction(onFetchError)) {
        onFetchError(error);
      }
    });
  }

  /**
   * Resets input field value and previously fetched data on reset button click.
   */
  resetSearch() {
    const {
      onClearClick
    } = this.props;
    this.inputRef.input.value = '';
    this.setState({
      data: []
    }, () => {
      if (isFunction(onClearClick)) {
        onClearClick();
      }
    });
  }

  /**
   * The render function.
   */
  render() {
    const {
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
      propertyNames,
      searchAttributes,
      attributeDetails,
      srsName,
      wfsFormatOptions,
      onFetchSuccess,
      onFetchError,
      onClearClick,
      onBeforeSearch,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <Input
        className={finalClassName}
        ref={inputRef => {this.inputRef = inputRef;}}
        suffix={
          <Icon
            type={fetching ? 'loading' : 'close-circle'}
            onClick={this.resetSearch.bind(this)}
          />
        }
        onPressEnter={this.onUpdateInput}
        onKeyUp={this.onUpdateInput}
        {...passThroughProps}
      />
    );
  }
}

export default WfsSearchInput;

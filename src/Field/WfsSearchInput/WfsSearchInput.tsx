import * as React from 'react';

import {
  Input
} from 'antd';
import { InputProps } from 'antd/lib/input';

import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';

import OlMap from 'ol/Map';

const isFunction = require('lodash/isFunction');
const debounce = require('lodash/debounce');

import Logger from '@terrestris/base-util/dist/Logger';
import WfsFilterUtil from '@terrestris/ol-util/dist/WfsFilterUtil/WfsFilterUtil';

import { CSS_PREFIX } from '../../constants';

import './WfsSearchInput.less';

interface DefaultProps {
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
   */
  attributeDetails: {
    [featureType: string]: {
      [attributeName: string]: {
        matchCase: boolean,
        type: string,
        exactSearch: boolean
      }
    }
  };
  /**
   * SRS name. No srsName attribute will be set on geometries when this is not
   * provided.
   */
  srsName: string;
  /**
   * The output format of the response.
   */
  outputFormat: string;
  /**
   * Options which are added to the fetch-POST-request. credentials is set to
   * 'same-origin' as default but can be overwritten. See also
   * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
   */
  additionalFetchOptions: any;
  /**
   * The minimal amount of characters entered in the input to start a search.
   */
  minChars: number;
  /**
   * Delay in ms before actually sending requests.
   */
  delay: number;
}

interface BaseProps {
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * The base URL. Please make sure that the WFS-Server supports CORS.
   */
  baseUrl: string;
  /**
   * An object mapping feature types to an array of attributes that should be searched through.
   */
  searchAttributes: {
    [featurType: string]: string[]
  };
  /**
   * The namespace URI used for features.
   */
  featureNS?: string;
  /**
   * The prefix for the feature namespace.
   */
  featurePrefix?: string;
  /**
   * The feature type names.
   */
  featureTypes: string[];
  /**
   * Maximum number of features to fetch.
   */
  maxFeatures?: number;
  /**
   * Geometry name to use in a BBOX filter.
   */
  geometryName?: string;
  /**
   * Optional list of property names to serialize.
   */
  propertyNames?: string[];
  /**
   * The ol.map to interact with on selection.
   */
  map: OlMap;
  /**
   * Optional callback function, that will be called before WFS search starts.
   * Can be useful if input value manipulation is needed (e.g. umlaut
   * replacement `ä => oa` etc.)
   */
  onBeforeSearch?: (value: string) => string;
  /**
   * An onFetchSuccess callback function which gets called with the
   * successfully fetched data.
   * Please note: if omitted only data fetch will be performed and no data
   * will be shown afterwards!
   */
  onFetchSuccess?: (data: any) => void;
  /**
   * An onFetchError callback function which gets called if data fetch is
   * failed.
   */
  onFetchError?: (data: any) => void;
  /**
   * Optional callback function, that will be called if 'clear' button of
   * input field was clicked.
   */
  onClearClick?: () => void;
  /**
   * Options which are passed to the constructor of the ol.format.WFS.
   * compare: https://openlayers.org/en/latest/apidoc/module-ol_format_WFS.html
   */
  wfsFormatOptions?: any;
}

interface WfsSearchState {
  searchTerm: string;
  data: any[];
  fetching: boolean;
}

export type WfsSearchInputProps = BaseProps & Partial<DefaultProps> & InputProps;

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
export class WfsSearchInput extends React.Component<WfsSearchInputProps, WfsSearchState> {

  /**
   * The reference to the Input Element of the WfsSearch.
   * @private
   */
  _inputRef: any;

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}wfssearchinput`;

  static defaultProps: DefaultProps = {
    srsName: 'EPSG:3857',
    outputFormat: 'application/json',
    minChars: 3,
    additionalFetchOptions: {},
    attributeDetails: {},
    delay: 300
  };

  /**
   * Create the WfsSearchInput.
   *
   * @param props The initial props.
   * @constructs WfsSearchInput
   */
  constructor(props: WfsSearchInputProps) {
    super(props);
    this.state = {
      searchTerm: '',
      data: [],
      fetching: false
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
   * @param evt The input value from `keyup` event.
   * Gets undefined if clear btn is pressed.
   */
  onUpdateInput(evt: any) {
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
   * @param response The found features.
   */
  onFetchSuccess(response: any) {
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
   * @param error The errorstring.
   */
  onFetchError(error: string) {
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
    this._inputRef.input.value = '';
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
        ref={inputRef => {this._inputRef = inputRef; }}
        suffix={
          fetching ?
            <LoadingOutlined
              onClick={this.resetSearch.bind(this)}
            /> :
            <CloseCircleOutlined
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

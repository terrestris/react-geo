import {
  AutoComplete,
  Spin
} from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';
import * as React from 'react';
const Option = AutoComplete.Option;
import './WfsSearch.less';

import Logger from '@terrestris/base-util/dist/Logger';
import WfsFilterUtil, { AttributeDetails } from '@terrestris/ol-util/dist/WfsFilterUtil/WfsFilterUtil';
import { OptionProps } from 'antd/lib/select';
import _debounce from 'lodash/debounce';
import _isFunction from 'lodash/isFunction';
import OlFeature from 'ol/Feature';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlSimpleGeometry from 'ol/geom/SimpleGeometry';
import OlMap from 'ol/Map';

import { CSS_PREFIX } from '../../constants';

interface OwnProps {
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
  attributeDetails: AttributeDetails;
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
   * Which prop value of option will render as content of select.
   */
  displayValue: string;
  /**
   * The id property of the feature. Default is to `id`.
   */
  idProperty: string;
  /**
   * Delay in ms before actually sending requests.
   */
  delay: number;
  /**
   * A render function which gets called with the selected item as it is
   * returned by the server. It must return an `AutoComplete.Option` with
   * `key={feature.id}`.
   * The default will display the property `name` if existing or the
   * property defined in `props.idProperty` (default is to `id`).
   */
  renderOption: (feature: any, props: Partial<WfsSearchProps>) => React.ReactElement<OptionProps>;
  /**
   * An onSelect function which gets called with the selected feature as it is
   * returned by server.
   * The default function will create a searchlayer, adds the feature and will
   * zoom to its extend.
   */
  onSelect: (feature: any, olMap: OlMap) => void;
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * The base URL. Please make sure that the WFS-Server supports CORS.
   */
  baseUrl: string;

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
   * Filter condition. See https://openlayers.org/en/latest/apidoc/module-ol_format_filter.html
   * for more information.
   */
  filter?: any;
  /**
   * The ol.map to interact with on selection.
   */
  map: OlMap;
  /**
   * An onChange function which gets called with the current value of the
   * field.
   */
  onChange?: (value: string) => void;
  /**
   * Optional callback function, that will be called before WFS search starts.
   * Can be useful if input value manipulation is needed (e.g. umlaut
   * replacement `ä => oa` etc.)
   */
  onBeforeSearch?: (value: string) => string;
  /**
   * Options which are passed to the constructor of the ol.format.WFS.
   * compare: https://openlayers.org/en/latest/apidoc/module-ol_format_WFS.html
   */
  wfsFormatOptions?: any;
}

export interface WfsSearchState {
  searchTerm: string;
  data: Array<any>;
  fetching: boolean;
}

export type WfsSearchProps = OwnProps & AutoCompleteProps;

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
export class WfsSearch extends React.Component<WfsSearchProps, WfsSearchState> {

  static defaultProps = {
    srsName: 'EPSG:3857',
    outputFormat: 'application/json',
    minChars: 3,
    additionalFetchOptions: {},
    displayValue: 'name',
    idProperty: 'id',
    attributeDetails: {},
    delay: 300,
    /**
     * Create an AutoComplete.Option from the given data.
     *
     * @param feature The feature as returned by the server.
     * @param props The current props of the component.
     * @return The AutoComplete.Option that will be
     * rendered for each feature.
     */
    renderOption: (feature: any, props: any): React.ReactElement<OptionProps> => {
      const {
        displayValue,
        idProperty
      } = props;

      const display = feature.properties[displayValue] ?
        feature.properties[displayValue] : feature[idProperty];
      return (
        <Option
          value={display}
          key={feature[idProperty]}
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
     * @param feature The selected feature as returned by the server.
     * @param olMap The openlayers map that was passed via prop.
     */
    onSelect: (feature: any, olMap: OlMap) => {
      if (feature) {
        const olView = olMap.getView();
        const geoJsonFormat = new OlFormatGeoJSON();
        const olFeature = geoJsonFormat.readFeature(feature);
        if (olFeature instanceof OlFeature) {
          const geometry = olFeature.getGeometry() as OlSimpleGeometry;

          if (geometry) {
            olView.fit(geometry, {
              duration: 500
            });
          }
        }
      }
    }
  };

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}wfssearch`;

  /**
   * Create the WfsSearch.
   *
   * @param props The initial props.
   * @constructs WfsSearch
   */
  constructor(props: WfsSearchProps) {
    super(props);
    this.state = {
      searchTerm: '',
      data: [],
      fetching: false
    };
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
    // delay requests invoking
    this.doSearch = _debounce(this.doSearch, this.props.delay);
  }

  /**
   * Called if the input of the AutoComplete is being updated. It sets the
   * current inputValue as searchTerm and starts a search if the inputValue has
   * a length of at least `this.props.minChars` (default 3).
   *
   * @param value The inputValue. Undefined if clear btn is pressed.
   */
  onUpdateInput(value: string) {
    const {
      minChars,
      onChange,
      onBeforeSearch
    } = this.props;

    this.setState({
      data: []
    });

    if (_isFunction(onBeforeSearch)) {
      value = onBeforeSearch(value);
    }

    this.setState({
      searchTerm: value
    }, () => {
      if (this.state.searchTerm && this.state.searchTerm.length >= minChars) {
        this.doSearch();
      }
    });

    if (_isFunction(onChange)) {
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
      attributeDetails
    } = this.props;

    const searchOpts = {
      featureNS: featureNS ?? '',
      featurePrefix: featurePrefix ?? '',
      featureTypes,
      geometryName: geometryName ?? '',
      maxFeatures: maxFeatures ?? 0,
      outputFormat,
      propertyNames: propertyNames ?? [],
      srsName,
      wfsFormatOptions,
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
   * @param response The found features.
   */
  onFetchSuccess(response: any) {
    const data = response.features ? response.features : [];
    data.forEach((feature: any) => feature.searchTerm = this.state.searchTerm);
    this.setState({
      data,
      fetching: false
    });
  }

  /**
   * This function gets called when the WFS GetFeature fetch request returns an error.
   * It logs the error to the console.
   *
   * @param error The errorstring.
   */
  onFetchError(error: any) {
    Logger.error(`Error while requesting WFS GetFeature: ${error}`);
    this.setState({
      fetching: false
    });
  }

  /**
   * The function describes what to do when an item is selected.
   *
   * @param value The value of the selected option.
   * @param option The selected option.
   */
  onMenuItemSelected(value: string, option: OptionProps) {
    const {
      map,
      idProperty
    } = this.props;

    const selectedFeature = this.state.data.filter(feat =>
      feat[idProperty] === option.key)[0];
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
      attributeDetails,
      srsName,
      wfsFormatOptions,
      displayValue,
      idProperty,
      filterOption,
      onDeselect,
      filterSort,
      options,
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
          data.map(d => renderOption(d, this.props))
        }
      </AutoComplete>
    );
  }
}

export default WfsSearch;

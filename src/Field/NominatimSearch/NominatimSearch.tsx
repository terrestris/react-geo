import * as React from 'react';
import { AutoComplete } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';
const Option = AutoComplete.Option;
import { OptionProps } from 'antd/lib/select';
import { OptionData } from 'rc-select/lib/interface';

import Logger from '@terrestris/base-util/dist/Logger';
import UrlUtil from '@terrestris/base-util/dist/UrlUtil/UrlUtil';

import OlMap from 'ol/Map';
import { transformExtent } from 'ol/proj';
import { Extent as OlExtent } from 'ol/extent';

import { GeoJSON } from 'geojson';

import { CSS_PREFIX } from '../../constants';

import './NominatimSearch.less';

// See https://nominatim.org/release-docs/develop/api/Output/ for some more information
export type NominatimPlace = {
  // eslint-disable-next-line camelcase
  place_id: number;
  // eslint-disable-next-line camelcase
  osm_type: string;
  // eslint-disable-next-line camelcase
  osm_id: number;
  boundingbox: string[];
  // eslint-disable-next-line camelcase
  display_name: string;
  category: string;
  type: string;
  importance: number;
  icon?: string;
  address?: any;
  extratags?: any;
  namedetails?: any;
  geojson: GeoJSON;
  licence: string;
};

interface DefaultProps {
  /**
   * The Nominatim Base URL. See https://wiki.openstreetmap.org/wiki/Nominatim
   */
  nominatimBaseUrl: string;
  /**
   * Output format.
   */
  format: string;
  /**
   * The preferred area to find search results in [left],[top],[right],[bottom].
   */
  viewBox: string;
  /**
   * Restrict the results to only items contained with the bounding box.
   * Restricting the results to the bounding box also enables searching by
   * amenity only. For example a search query of just "[pub]" would normally be
   * rejected but with bounded=1 will result in a list of items matching within
   * the bounding box.
   */
  bounded: number;
  /**
   * Output geometry of results in geojson format.
   */
  polygonGeoJSON: number;
  /**
   * Include a breakdown of the address into elements.
   */
  addressDetails: number;
  /**
   * Limit the number of returned results.
   */
  limit: number;
  /**
   * Limit search results to a specific country (or a list of countries).
   * [countrycode] should be the ISO 3166-1alpha2 code, e.g. gb for the United
   * Kingdom, de for Germany, etc.
   */
  countryCodes: string;
  /**
   * The minimal amount of characters entered in the input to start a search.
   */
  minChars: number;
  /**
   * A render function which gets called with the selected item as it is
   * returned by nominatim. It must return an `AutoComplete.Option`.
   */
  renderOption: (item: NominatimPlace) => React.ReactElement<OptionProps>;
  /**
   * An onSelect function which gets called with the selected item as it is
   * returned by nominatim.
   */
  onSelect: (item: NominatimPlace, olMap: OlMap) => void;
  /**
   * Indicate if we should render the input and results. When setting to false,
   * you need to handle user input and result yourself
   */
  visible?: boolean;
  /**
   * The searchTerm may be given as prop. This is useful when setting
   * `visible` to `false`.
   */
  searchTerm?: string;
  /**
   * A callback function which gets called with the successfully fetched data.
   */
  onFetchSuccess?: (data: NominatimPlace[]) => void;
  /**
   * A callback function which gets called if data fetching has failed.
   */
  onFetchError?: (error: any) => void;
}

interface BaseProps {
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * The ol.map where the map will zoom to.
   *
   */
  map: OlMap;
  /**
   * A function that gets called when the clear Button is pressed or the input
   * value is empty.
   */
  onClear?: () => void;
}

interface NominatimSearchState {
  searchTerm: string;
  dataSource: NominatimPlace[];
}

export type NominatimSearchProps = BaseProps & Partial<DefaultProps> & Omit<AutoCompleteProps, 'onSelect'>;

/**
 * The NominatimSearch.
 *
 * @class NominatimSearch
 * @extends React.Component
 */
export class NominatimSearch extends React.Component<NominatimSearchProps, NominatimSearchState> {

  static defaultProps: DefaultProps = {
    nominatimBaseUrl: 'https://nominatim.openstreetmap.org/search?',
    format: 'json',
    viewBox: '-180,90,180,-90',
    bounded: 1,
    polygonGeoJSON: 1,
    addressDetails: 1,
    limit: 10,
    countryCodes: 'de',
    minChars: 3,
    visible: true,
    /**
     * Create an AutoComplete.Option from the given data.
     *
     * @param item The tuple as an object.
     * @return The returned option
     */
    renderOption: (item: NominatimPlace): React.ReactElement<OptionProps> => {
      return (
        <Option
          key={item.place_id}
          value={item.display_name}
        >
          {item.display_name}
        </Option>
      );
    },
    /**
     * The default onSelect method if no onSelect prop is given. It zooms to the
     * selected item.
     *
     * @param selected The selected item as it is returned by nominatim.
     */
    onSelect: (selected: NominatimPlace, olMap: OlMap) => {
      if (selected && selected.boundingbox) {
        const olView = olMap.getView();
        const bbox: number[] = selected.boundingbox.map(parseFloat);
        let extent = [
          bbox[2],
          bbox[0],
          bbox[3],
          bbox[1]
        ] as OlExtent;

        extent = transformExtent(extent, 'EPSG:4326',
          olView.getProjection().getCode());

        olView.fit(extent, {
          duration: 500
        });
      }
    }
  };

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}nominatimsearch`;

  /**
   * Create the NominatimSearch.
   *
   * @param props The initial props.
   * @constructs NominatimSearch
   */
  constructor(props: NominatimSearchProps) {
    super(props);
    this.state = {
      searchTerm: '',
      dataSource: []
    };
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
  }

  /**
   * Trigger search when searchTerm prop has changed
   *
   * @param prevProps Previous props
   */
  componentDidUpdate(prevProps) {
    if (this.props.searchTerm !== prevProps.searchTerm) {
      this.onUpdateInput(this.props.searchTerm);
    }
  }

  /**
   * Called if the input of the AutoComplete is being updated. It sets the
   * current inputValue as searchTerm and starts a search if the inputValue has
   * a length of at least `this.props.minChars` (default 3).
   *
   * @param inputValue The inputValue. Undefined if clear btn
   *                                      is pressed.
   */
  onUpdateInput(inputValue?: string) {
    const {
      onClear
    } = this.props;

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

    if (!inputValue && onClear) {
      onClear();
    }
  }

  /**
   * Perform the search.
   */
  doSearch() {
    const baseParams = {
      format: this.props.format,
      viewbox: this.props.viewBox,
      bounded: this.props.bounded,
      // eslint-disable-next-line camelcase
      polygon_geojson: this.props.polygonGeoJSON,
      addressdetails: this.props.addressDetails,
      limit: this.props.limit,
      countrycodes: this.props.countryCodes,
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
   * @param response The found features.
   */
  onFetchSuccess(response: any) {
    this.setState({
      dataSource: response
    }, () => {
      if (this.props.onFetchSuccess) {
        this.props.onFetchSuccess(response);
      }
    });
  }

  /**
   * This function gets called when the nomintim fetch returns an error.
   * It logs the error to the console.
   *
   * @param error The errorstring.
   */
  onFetchError(error: string) {
    Logger.error(`Error while requesting Nominatim: ${error}`);
    if (this.props.onFetchError) {
      this.props.onFetchError(error);
    }
  }

  /**
   * The function describes what to do when an item is selected.
   *
   * @param value The value of the selected option.
   * @param option The selected OptionData
   */
  onMenuItemSelected(value: string, option: OptionData) {
    const selected = this.state.dataSource.find(
      i => i.place_id.toString() === option.key
    );
    this.props.onSelect(selected, this.props.map);
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      nominatimBaseUrl,
      format,
      viewBox,
      bounded,
      polygonGeoJSON,
      addressDetails,
      limit,
      countryCodes,
      map,
      onSelect,
      renderOption,
      minChars,
      visible,
      ...passThroughProps
    } = this.props;

    if (visible === false) {
      return null;
    }

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <AutoComplete
        className={finalClassName}
        allowClear={true}
        placeholder="Ortsname, Straßenname, Stadtteilname, POI usw."
        onChange={(v: string) => this.onUpdateInput(v)}
        onSelect={(v: string, o: OptionData) => this.onMenuItemSelected(v, o)}
        {...passThroughProps}
      >
        {
          this.state.dataSource.map(renderOption)
        }
      </AutoComplete>
    );
  }
}

export default NominatimSearch;

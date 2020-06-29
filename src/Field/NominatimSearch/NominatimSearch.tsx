import * as React from 'react';
import { AutoComplete } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';
const Option = AutoComplete.Option;

import Logger from '@terrestris/base-util/dist/Logger';
import UrlUtil from '@terrestris/base-util/dist/UrlUtil/UrlUtil';

import OlMap from 'ol/Map';

import { transformExtent } from 'ol/proj';

import { CSS_PREFIX } from '../../constants';
import { OptionProps } from 'antd/lib/select';

import './NominatimSearch.less';

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
  viewbox: string;
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
  polygon_geojson: number;
  /**
   * Include a breakdown of the address into elements.
   */
  addressdetails: number;
  /**
   * Limit the number of returned results.
   */
  limit: number;
  /**
   * Limit search results to a specific country (or a list of countries).
   * [countrycode] should be the ISO 3166-1alpha2 code, e.g. gb for the United
   * Kingdom, de for Germany, etc.
   */
  countrycodes: string;
  /**
   * The minimal amount of characters entered in the input to start a search.
   */
  minChars: number;
  /**
   * A render function which gets called with the selected item as it is
   * returned by nominatim. It must return an `AutoComplete.Option`.
   */
  renderOption: (item: any) => React.ReactElement<OptionProps>;
  /**
   * An onSelect function which gets called with the selected item as it is
   * returned by nominatim.
   */
  onSelect: (item: any, olMap: OlMap) => void;
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
  dataSource: any;
}

export type NominatimSearchProps = BaseProps & Partial<DefaultProps> & AutoCompleteProps;

/**
 * The NominatimSearch.
 *
 * @class NominatimSearch
 * @extends React.Component
 */
export class NominatimSearch extends React.Component<NominatimSearchProps, NominatimSearchState> {

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}nominatimsearch`;

  static defaultProps: DefaultProps = {
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
     * @param item The tuple as an object.
     * @return The returned option
     */
    renderOption: (item: any): React.ReactElement<OptionProps> => {
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
    onSelect: (selected: any, olMap: OlMap) => {
      if (selected && selected.boundingbox) {
        const olView = olMap.getView();
        let extent = [
          selected.boundingbox[2],
          selected.boundingbox[0],
          selected.boundingbox[3],
          selected.boundingbox[1]
        ];

        extent = extent.map(function(coord: string) {
          return parseFloat(coord);
        });

        extent = transformExtent(extent, 'EPSG:4326',
          olView.getProjection().getCode());

        olView.fit(extent, {
          duration: 500
        });
      }
    }
  };

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
   * @param response The found features.
   */
  onFetchSuccess(response: any) {
    this.setState({
      dataSource: response
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
  }

  /**
   * The function describes what to do when an item is selected.
   *
   * @param value The value of the selected option.
   * @param value The values of the selected option.
   */
  onMenuItemSelected(value: string, option: OptionProps) {
    const selected = this.state.dataSource.find(
      (i: any) => i.place_id.toString() === option.key.toString()
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
      viewbox,
      bounded,
      polygon_geojson,
      addressdetails,
      limit,
      countrycodes,
      map,
      onSelect,
      renderOption,
      minChars,
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
        onChange={this.onUpdateInput}
        onSelect={this.onMenuItemSelected}
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

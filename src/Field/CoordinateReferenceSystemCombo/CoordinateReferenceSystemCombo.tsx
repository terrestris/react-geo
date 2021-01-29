import * as React from 'react';
import { AutoComplete } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';
import { OptionProps } from 'antd/lib/select';

const Option = AutoComplete.Option;

import UrlUtil from '@terrestris/base-util/dist/UrlUtil/UrlUtil';
import Logger from '@terrestris/base-util/dist/Logger';

import { CSS_PREFIX } from '../../constants';

import './CoordinateReferenceSystemCombo.less';

interface DefaultProps {
  /**
   * The API to query for CRS definitions
   * default: https://epsg.io
   */
  crsApiUrl: string;
  /**
   * The empty text set if no value is given / provided
   */
  emptyTextPlaceholderText: string;
  /**
   * A function
   */
  onSelect: (crsDefinition: any) => void;
}

interface BaseProps {
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * An array of predefined crs definitions having at least value (name of
   * CRS) and code (e.g. EPSG-code of CRS) property
   */
  predefinedCrsDefinitions?: {value: string; code: string}[];
}

interface CRSComboState {
  crsDefinitions: any[];
  value: string;
}

export type CRSComboProps = BaseProps & Partial<DefaultProps> & AutoCompleteProps;

/**
 * Class representing a combo to choose coordinate projection system via a
 * dropdown menu and / or autocompletion
 *
 * @class The CoordinateReferenceSystemCombo
 * @extends React.Component
 */
class CoordinateReferenceSystemCombo extends React.Component<CRSComboProps, CRSComboState> {

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}coordinatereferencesystemcombo`;

  static defaultProps: DefaultProps = {
    emptyTextPlaceholderText: 'Please select a CRS',
    crsApiUrl: 'https://epsg.io/',
    onSelect: () => undefined
  };

  /**
   * Create a CRS combo.
   * @constructs CoordinateReferenceSystemCombo
   */
  constructor(props: CRSComboProps) {
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
   * @param searchVal The search string
   */
  fetchCrs = async (searchVal: string) => {
    const { crsApiUrl } = this.props;

    const queryParameters = {
      format: 'json',
      q: searchVal
    };

    return fetch(`${crsApiUrl}?${UrlUtil.objectToRequestString(queryParameters)}`)
      .then(response => response.json());
  };

  /**
   * This function gets called when the EPSG.io fetch returns an error.
   * It logs the error to the console.
   *
   */
  onFetchError(error: string) {
    Logger.error(`Error while requesting in CoordinateReferenceSystemCombo: ${error}`);
  }

  /**
   * This function transforms results of EPSG.io
   *
   * @param json The result object of EPSG.io-API, see where
   *  https://github.com/klokantech/epsg.io#api-for-results
   * @return Array of CRS definitons used in CoordinateReferenceSystemCombo
   */
  transformResults = (json: any) => {
    const results = json.results;
    if (results && results.length > 0) {
      return results.map(obj => ({code: obj.code, value: obj.name, proj4def: obj.proj4, bbox: obj.bbox}));
    } else {
      return [];
    }
  };

  /**
   * This function gets called when the EPSG.io fetch returns an error.
   * It logs the error to the console.
   *
   * @param value The search value.
   */
  handleSearch = (value?: string) => {
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
  };

  /**
   * Handles selection of a CRS item in Autocomplete
   *
   * @param value The EPSG code.
   * @param option The values of the selected option.
   */
  onCrsItemSelect = (value: string, option: OptionProps) => {
    const {
      onSelect,
      predefinedCrsDefinitions
    } = this.props;

    const  {
      crsDefinitions
    } = this.state;

    const crsObjects = predefinedCrsDefinitions || crsDefinitions;

    const selected = crsObjects.filter(i => i.code === option.key)[0];

    this.setState({
      value: selected
    });

    onSelect(selected);
  };

  /**
   * Tranforms CRS object returned by EPSG.io to antd  Option component
   *
   * @param crsObj Single plain CRS object returned by EPSG.io
   *
   * @return Option component to render
   */
  transformCrsObjectsToOptions(crsObject: any) {
    const value = `${crsObject.value} (EPSG:${crsObject.code})`;

    return (
      <Option
        key={crsObject.code}
        value={value}
      >
        {value}
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
      crsApiUrl,
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
        onSelect={this.onCrsItemSelect}
        onChange={this.handleSearch}
        placeholder={emptyTextPlaceholderText}
        {...passThroughOpts}
      >
        {
          crsObjects.map(this.transformCrsObjectsToOptions)
        }
      </AutoComplete>
    );
  }
}

export default CoordinateReferenceSystemCombo;

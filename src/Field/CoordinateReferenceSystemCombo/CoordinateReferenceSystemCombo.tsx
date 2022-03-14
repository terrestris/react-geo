import * as React from 'react';
import { AutoComplete } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';

const { Option } = AutoComplete;

import UrlUtil from '@terrestris/base-util/dist/UrlUtil/UrlUtil';
import Logger from '@terrestris/base-util/dist/Logger';

import { CSS_PREFIX } from '../../constants';

import './CoordinateReferenceSystemCombo.less';

interface CrsDefinition {
  value: string;
  code: string;
}

interface OwnProps {
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
  onSelect: (crsDefinition: CrsDefinition) => void;
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * An array of predefined crs definitions having at least value (name of
   * CRS) and code (e.g. EPSG-code of CRS) property
   */
  predefinedCrsDefinitions?: CrsDefinition[];
}

interface CRSComboState {
  crsDefinitions: CrsDefinition[];
  value: string|null;
}

export type CRSComboProps = OwnProps & AutoCompleteProps;

/**
 * Class representing a combo to choose coordinate projection system via a
 * dropdown menu and / or autocompletion
 *
 * @class The CoordinateReferenceSystemCombo
 * @extends React.Component
 */
class CoordinateReferenceSystemCombo extends React.Component<CRSComboProps, CRSComboState> {

  static defaultProps = {
    emptyTextPlaceholderText: 'Please select a CRS',
    crsApiUrl: 'https://epsg.io/',
    onSelect: () => undefined
  };

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}coordinatereferencesystemcombo`;

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
  onFetchError(error: Error) {
    Logger.error('Error while requesting in CoordinateReferenceSystemCombo', error);
  }

  /**
   * This function transforms results of EPSG.io
   *
   * @param json The result object of EPSG.io-API, see where
   *  https://github.com/klokantech/epsg.io#api-for-results
   * @return Array of CRS definitons used in CoordinateReferenceSystemCombo
   */
  transformResults = (json: any): CrsDefinition[] => {
    const results = json.results;
    if (results && results.length > 0) {
      return results.map((obj: any) => ({code: obj.code, value: obj.name, proj4def: obj.proj4, bbox: obj.bbox}));
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
  handleSearch = async (value: string) => {
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
      try {
        const result = await this.fetchCrs(value);
        this.setState({
          crsDefinitions: this.transformResults(result)
        });
      } catch (e) {
        this.onFetchError(e);
      }
    } else {
      this.setState({ value });
    }
  };

  /**
   * Handles selection of a CRS item in Autocomplete
   *
   * @param value The EPSG code.
   * @param option The selected OptionData
   */
  onCrsItemSelect = (value: string, option: any) => {
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
      value: selected.value
    });

    onSelect(selected);
  };

  /**
   * Tranforms CRS object returned by EPSG.io to antd  Option component
   *
   * @param crsObject Single plain CRS object returned by EPSG.io
   *
   * @return Option component to render
   */
  transformCrsObjectsToOptions(crsObject: CrsDefinition) {
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
        onSelect={(v: string, o: any) => this.onCrsItemSelect(v, o)}
        onChange={(v: string) => this.handleSearch(v)}
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

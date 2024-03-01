import './WfsSearch.less';

import Logger from '@terrestris/base-util/dist/Logger';
import { SearchConfig } from '@terrestris/ol-util/dist/WfsFilterUtil/WfsFilterUtil';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { useWfs } from '@terrestris/react-util/dist/Hooks/useWfs/useWfs';
import { AutoComplete, Spin } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';
import { DefaultOptionType, OptionProps } from 'antd/lib/select';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import OlFeature from 'ol/Feature';
import React, { FC, useMemo, useState } from 'react';

import { CSS_PREFIX } from '../../constants';

const Option = AutoComplete.Option;

export interface WfsSearchState {
  data: Array<any>;
  fetching: boolean;
  searchTerm: string;
}

export type WfsSearchProps = {
  additionalFetchOptions?: Partial<RequestInit>;
  baseUrl: string;
  className?: string;
  displayValue?: string;
  idProperty?: string;
  minChars?: number;
} & SearchConfig & AutoCompleteProps ;

const defaultClassName = `${CSS_PREFIX}wfssearch`;

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
export const WfsSearch: FC<WfsSearchProps> = ({
  additionalFetchOptions,
  attributeDetails = {},
  baseUrl,
  className,
  displayValue = 'name',
  featureNS,
  featurePrefix,
  featureTypes,
  geometryName,
  idProperty = 'id',
  maxFeatures,
  minChars = 3,
  outputFormat = 'application/json',
  propertyNames,
  srsName = 'EPSG:3857',
  wfsFormatOptions,
  ...passThroughProps
}) => {

  const [searchTerm, setSearchTerm] = useState<string>();

  const map = useMap();

  const searchConfig: SearchConfig = useMemo(() => ({
    attributeDetails,
    featureNS,
    featurePrefix,
    featureTypes,
    geometryName,
    maxFeatures,
    outputFormat,
    propertyNames,
    srsName,
    wfsFormatOptions
  }), [
    attributeDetails,
    featureNS,
    featurePrefix,
    featureTypes,
    geometryName,
    maxFeatures,
    outputFormat,
    propertyNames,
    srsName,
    wfsFormatOptions
  ]);

  /**
   * This function gets called when the WFS GetFeature fetch request returns an error.
   * It logs the error to the console.
   *
   * @param error The error string.
   */
  const onFetchError = (error: any) => {
    Logger.error(`Error while requesting WFS GetFeature: ${error}`);
  };

  const {
    loading,
    features
  } = useWfs({
    baseUrl,
    minChars,
    onFetchError,
    searchTerm,
    searchConfig
  });

  /**
    * Create an AutoComplete.Option from the given data.
    *
    * @param feature The feature as returned by the server.
    * @return The AutoComplete.Option that will be
    * rendered for each feature.
    */
  const renderOption = (feature?: OlFeature): React.ReactElement<OptionProps> => {
    if (_isNil(feature)) {
      return <></>;
    }

    const value = _get(feature?.getProperties(), displayValue);
    const display = _isNil(value) ? feature.get(idProperty) : value;
    return (
      <Option
        key={feature.get(idProperty)}
        title={display}
        value={display}
      >
        {display}
      </Option>
    );
  };

  /**
   * The default onSelect method if no onSelect prop is given. It zooms to the
   * selected item.
   *
   * @param feature The selected feature as returned by the server.
   */
  const onSelect = (feature: OlFeature) => {
    if (!_isNil(feature) && !_isNil(map)) {
      const olView = map.getView();
      const geometry = feature.getGeometry()?.getExtent();
      if (!_isNil(geometry)) {
        olView.fit(geometry, {
          duration: 500
        });
      }
    }
  };

  const onUpdateInput = (val: string) => setSearchTerm(val);

  /**
   * The function describes what to do when an item is selected.
   *
   * @param value The value of the selected option.
   * @param option The selected option.
   */
  const onMenuItemSelected = (value: string, option: DefaultOptionType): void => {
    const selectedFeatures = features?.filter(feat => `${feat.get(idProperty)}` === option.key);
    if (!_isNil(selectedFeatures) && Array.isArray(selectedFeatures) && selectedFeatures?.length > 0) {
      onSelect(selectedFeatures[0]);
    }
  };

  const finalClassName = className ? `${className} ${defaultClassName}` : defaultClassName;

  return (
    <AutoComplete<string>
      allowClear={true}
      className={finalClassName}
      defaultActiveFirstOption={false}
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      onChange={onUpdateInput}
      onSelect={onMenuItemSelected}
      suffixIcon={null}
      {...passThroughProps}
    >
      {
        features?.map(renderOption)
      }
    </AutoComplete>
  );
};

export default WfsSearch;

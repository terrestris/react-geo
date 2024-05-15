import './WfsSearchField.less';

import { faCircleNotch, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logger from '@terrestris/base-util/dist/Logger';
import { SearchConfig } from '@terrestris/ol-util/dist/WfsFilterUtil/WfsFilterUtil';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import { useWfs, WfsQueryArgs } from '@terrestris/react-util/dist/Hooks/useWfs/useWfs';
import { AutoComplete, Input, Spin } from 'antd';
import { DefaultOptionType, OptionProps } from 'antd/lib/select';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import OlFeature from 'ol/Feature';
import React, { FC, useEffect, useMemo, useState } from 'react';

import { CSS_PREFIX } from '../../constants';

const Option = AutoComplete.Option;

export type WfsSearchFieldProps = {
  asInput?: boolean;
  className?: string;
  displayValue?: string;
  idProperty?: string;
  onBeforeSearch?: (value: string) => string;
  onChange?: (val: OlFeature[] | undefined) => undefined;
  value?: OlFeature[] | undefined;
} & SearchConfig & Omit<WfsQueryArgs, 'searchConfig' | 'searchTerm'>;

const defaultClassName = `${CSS_PREFIX}wfssearch`;

/**
 * The WfsSearchField field.
 * Implements a field to do a WFS-GetFeature request.
 *
 * The GetFeature request is created with `ol.format.WFS.writeGetFeature`
 * so most of the WFS specific options work like document in the corresponding
 * API-docs: https://openlayers.org/en/latest/apidoc/module-ol_format_WFS.html
 *
 */
export const WfsSearchField: FC<WfsSearchFieldProps> = ({
  additionalFetchOptions,
  asInput = false,
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
  onBeforeSearch = v => v,
  onChange = () => undefined,
  outputFormat = 'application/json',
  propertyNames,
  srsName = 'EPSG:3857',
  value,
  wfsFormatOptions,
  onFetchError,
  onFetchSuccess,
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
  const onFetchErrorInternal = (error: any) => {
    const msg = `Error while requesting WFS GetFeature: ${error}`;
    Logger.error(msg);
    onFetchError?.(msg);
  };

  const {
    loading,
    features
  } = useWfs({
    baseUrl,
    minChars,
    onFetchError: onFetchErrorInternal,
    onFetchSuccess,
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

    const v = _get(feature?.getProperties(), displayValue);
    const display = _isNil(v) ? feature.get(idProperty) : v;
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

  /**
   * Called if the input is being updated. It sets the current inputValue
   * as searchTerm and starts a search if the inputValue has
   * a length of at least `this.props.minChars` (default 3).
   *
   * Gets undefined if clear btn is pressed.
   * @param val
   */
  const onUpdateInput = (val: any) => {
    let updatedValue = '';
    if (_isString(val)) {
      updatedValue = onBeforeSearch(val);
    } else {
      if (val?.target?.value) {
        updatedValue = onBeforeSearch(val.target.value);
      }
    }
    setSearchTerm(updatedValue);
    return;
  };

  /**
   * The function describes what to do when an item is selected.
   *
   * @param _
   * @param option The selected option.
   */
  const onMenuItemSelected = (_: string, option: DefaultOptionType): void => {
    const selectedFeatures = features?.filter(feat => `${feat.get(idProperty)}` === option.key);
    if (!_isNil(selectedFeatures) && Array.isArray(selectedFeatures) && selectedFeatures?.length > 0) {
      onSelect(selectedFeatures[0]);
    }
  };

  /**
   * Resets input field value and previously fetched data on reset button click.
   */
  const resetSearch = () => setSearchTerm(undefined);

  useEffect(() => {
    onChange(features);
  }, [onChange, features]);

  const finalClassName = className ? `${className} ${defaultClassName}` : defaultClassName;

  if (asInput) {
    return (
      <Input
        className={finalClassName}
        onChange={onUpdateInput}
        suffix={
          loading ?
            <FontAwesomeIcon
              spin={true}
              icon={faCircleNotch}
              onClick={resetSearch}
            /> :
            <FontAwesomeIcon
              icon={faClose}
              onClick={resetSearch}
            />
        }
        value={searchTerm}
      />
    );
  }

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
      value={searchTerm}
      {...passThroughProps}
    >
      {
        features?.map(renderOption)
      }
    </AutoComplete>
  );
};

export default WfsSearchField;

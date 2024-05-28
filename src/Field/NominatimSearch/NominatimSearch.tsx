import './NominatimSearch.less';

import { useMap } from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import useNominatim, {
  NominatimPlace,
  UseNominatimArgs
} from '@terrestris/react-util/dist/Hooks/useNominatim/useNominatim';
import { AutoComplete } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';
import { OptionProps } from 'antd/lib/select';
import _isNil from 'lodash/isNil';
import { Extent as OlExtent } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import { DefaultOptionType } from 'rc-select/lib/Select';
import React, { FC, useCallback, useState } from 'react';

import { CSS_PREFIX } from '../../constants';

const Option = AutoComplete.Option;

interface OwnProps {
  /**
   * A render function which gets called with the selected item as it is
   * returned by nominatim. It must return an `AutoComplete.Option`.
   */
  renderOption?: (item: NominatimPlace) => React.ReactElement<OptionProps>;
  /**
   * An onSelect function which gets called with the selected item as it is
   * returned by nominatim.
   */
  onSelect?: (item: NominatimPlace) => void;
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * A function that gets called when the clear Button is pressed or the input
   * value is empty.
   */
  onClear?: () => void;
}

export type NominatimSearchProps = OwnProps &
  Omit<AutoCompleteProps, 'onSelect'> & Omit<UseNominatimArgs, 'searchTerm'>;

/**
 * The NominatimSearch.
 */
export const NominatimSearch: FC<NominatimSearchProps> = ({
  addressDetails,
  bounded,
  className = `${CSS_PREFIX}nominatimsearch`,
  countryCodes,
  debounceTime,
  format,
  limit,
  minChars,
  nominatimBaseUrl,
  onChange = () => undefined,
  onClear,
  onFetchError,
  onFetchSuccess,
  onSelect,
  polygonGeoJSON,
  renderOption,
  searchResultLanguage,
  viewBox,
  ...passThroughProps
}) => {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const map = useMap();

  const nominatimResults = useNominatim({
    addressDetails,
    bounded,
    countryCodes,
    debounceTime,
    format,
    limit,
    minChars,
    nominatimBaseUrl,
    onFetchError,
    polygonGeoJSON,
    searchResultLanguage,
    searchTerm,
    viewBox
  });

  const finalOnSelect = useCallback((selected: NominatimPlace) => {
    if (onSelect) {
      onSelect(selected);
    } else if (selected && selected.boundingbox) {
      const olView = map?.getView();
      const bbox: number[] = selected.boundingbox.map(parseFloat);
      let extent = [
        bbox[2],
        bbox[0],
        bbox[3],
        bbox[1]
      ] as OlExtent;

      extent = transformExtent(extent, 'EPSG:4326',
        olView?.getProjection().getCode());

      olView?.fit(extent, {
        duration: 500
      });
    }
  }, [map, onSelect]);

  const finalRenderOption = useCallback((item: NominatimPlace): React.ReactElement<OptionProps> => {
    if (_isNil(item)) {
      return <></>;
    }
    if (renderOption) {
      return renderOption(item);
    } else {
      return (
        <Option
          key={item?.place_id}
          value={item?.display_name}
        >
          {item?.display_name}
        </Option>
      );
    }
  }, [renderOption]);

  /**
   * The function describes what to do when an item is selected.
   *
   * @param option The selected OptionData
   */
  const onMenuItemSelected = useCallback((_: any, option: DefaultOptionType) => {
    if (!map) {
      return;
    }
    const selected = nominatimResults?.find(
      i => `${i.place_id}` === option.key
    );
    if (!_isNil(selected)) {
      finalOnSelect(selected);
    }
  }, [finalOnSelect, nominatimResults, map]);

  const onValueChange = (value: string, place: NominatimPlace) => {
    setSearchTerm(value);
    if (!_isNil(place)) {
      onChange(value, {
        ...place,
        label: place.display_name
      });
    } else {
      onChange(value, place);
    }
  };

  return (
    <AutoComplete<string, any>
      className={className}
      allowClear={true}
      placeholder="Ortsname, Straßenname, Stadtteilname, POI usw."
      onChange={onValueChange}
      onSelect={onMenuItemSelected}
      value={searchTerm}
      {...passThroughProps}
    >
      {
        nominatimResults?.map(finalRenderOption)
      }
    </AutoComplete>
  );
};

export default NominatimSearch;

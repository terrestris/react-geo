import './SearchField.less';

import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import { AutoComplete, Spin } from 'antd';

import { AutoCompleteProps } from 'antd/lib/auto-complete';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { Extent } from 'ol/extent';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import { transformExtent } from 'ol/proj';

import { SearchFunction, SearchOptions, useSearch } from '@terrestris/react-util';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';

import { CSS_PREFIX } from '../../constants';

export type SearchProps<
  G extends Geometry = Geometry,
  T extends NonNullable<GeoJsonProperties> = Record<string, any>,
  C extends FeatureCollection<G, T> = FeatureCollection<G, T>
> = {
  searchFunction: SearchFunction<G, T, C>;
  searchOptions?: SearchOptions<G, T, C>;
  getValue?: (feature: Feature<G, T>) => string;
  /**
   * An onSelect function which gets called with the selected item as it is
   * returned by the search function.
   */
  onSelect?: (feature: Feature<G, T>) => void;
  /**
   * A function which gets called with the search results if the search is completed.
   */
  onSearchCompleted?: (featureCollection: FeatureCollection<G, T> | undefined) => void;
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * A function that gets called when the clear Button is pressed or the input
   * value is empty.
   */
  onClear?: () => void;
  zoomToFeature?: boolean;
  getExtent?: (feature: Feature<G, T>) => Extent;
  autoCompleteDisabled?: boolean;
} & Omit<AutoCompleteProps, 'onSelect'|'onSearch'|'onChange'|'onClear'|'notFoundContent'>;

/**
 * The SearchField.
 */
export function SearchField<
  G extends Geometry = Geometry,
  T extends NonNullable<GeoJsonProperties> = Record<string, any>,
  C extends FeatureCollection<G, T> = FeatureCollection<G, T>
>({
  className = `${CSS_PREFIX}search`,
  onSelect,
  onSearchCompleted,
  getValue = () => '',
  searchFunction,
  searchOptions = {},
  zoomToFeature = true,
  autoCompleteDisabled = false,
  getExtent,
  ...passThroughProps
}: SearchProps<G, T, C>): ReactElement {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const map = useMap();

  const {
    featureCollection,
    loading
  } = useSearch<G, T, C>(searchFunction, searchTerm, searchOptions);

  useEffect(() => {
    if (onSearchCompleted) {
      onSearchCompleted(featureCollection);
    }
  }, [featureCollection, onSearchCompleted]);

  const options = useMemo(
    () => featureCollection?.features.map(f => ({
      label: getValue(f),
      value: getValue(f)
    })),
    [featureCollection, getValue]
  );

  const onMenuItemSelected = useCallback((value: string) => {
    const selected = featureCollection?.features.find(f => getValue(f) === value);
    if (selected && onSelect) {
      onSelect(selected);
    }
    if (selected && zoomToFeature) {
      if (!map) {
        return;
      }
      let extent: Extent;
      if (getExtent) {
        extent = getExtent(selected);
      } else {
        const olFormat = new OlFormatGeoJSON();
        const geometry = olFormat.readGeometry(selected.geometry);
        extent = geometry.getExtent();
      }

      const olView = map?.getView();

      extent = transformExtent(extent, 'EPSG:4326', olView.getProjection());

      olView.fit(extent, {
        duration: 500
      });
    }
  }, [map, onSelect, getValue, getExtent, featureCollection?.features, zoomToFeature]);

  return (
    <AutoComplete
      className={className}
      allowClear
      classNames={{
        popup: {
          root: autoCompleteDisabled ? 'autocomplete-disabled' : undefined
        }
      }}
      popupRender={autoCompleteDisabled ? () => <></> : undefined}
      onSearch={text =>
        setSearchTerm(text)
      }
      onClear={() =>
        setSearchTerm('')
      }
      onSelect={onMenuItemSelected}
      options={options}
      notFoundContent={loading ? <Spin size="small" /> : null}
      {...passThroughProps}
    />
  );
}

export default SearchField;

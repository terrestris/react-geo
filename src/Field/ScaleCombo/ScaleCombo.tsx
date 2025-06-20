import './ScaleCombo.less';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import { Select } from 'antd';

import { SelectProps } from 'antd/lib/select';
import _clone from 'lodash/clone';
import _isEmpty from 'lodash/isEmpty';
import _isInteger from 'lodash/isInteger';
import _isNil from 'lodash/isNil';
import _isNumber from 'lodash/isNumber';
import { ObjectEvent as OlObjectEvent } from 'ol/Object';
import OlView from 'ol/View';

import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';


import { CSS_PREFIX } from '../../constants';

interface OwnProps {
  resolutionsFilter?: (item: any, index?: number, resolutions?: number[]) => boolean;
  syncWithMap?: boolean;
  scales?: number[];
  onZoomLevelSelect?: (zoomLevel: string) => void;
  resolutions?: number[];
}

export type ScaleComboProps = SelectProps & OwnProps;

const defaultClassName = `${CSS_PREFIX}scalecombo`;

const ScaleCombo: React.FC<ScaleComboProps> = ({
  resolutionsFilter = () => true,
  syncWithMap = true,
  scales = [],
  className,
  onZoomLevelSelect,
  // required for proper definition of passthrough
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resolutions,
  ...passThroughProps
}) => {

  const [internalZoomLevel, setInternalZoomLevel] = useState<number>();

  const map = useMap();

  const getOptionsFromMap = useCallback(() => {
    if (!map) {
      return [];
    }

    const optionScales: number[] = [];
    const view = map.getView();
    // use existing resolutions array if exists
    const viewResolutions = view.getResolutions();
    const pushScale = (s: number[], r: number, v: OlView) => {
      const scale = MapUtil.getScaleForResolution(r, v.getProjection().getUnits());
      if (!scale) {
        return;
      }
      const roundScale = MapUtil.roundScale(scale);
      if (optionScales.includes(roundScale) ) {
        return;
      }
      optionScales.push(roundScale);
    };

    if (_isEmpty(viewResolutions) || _isNil(viewResolutions)) {
      for (let currentZoomLevel = view.getMaxZoom(); currentZoomLevel >= view.getMinZoom(); currentZoomLevel--) {
        const resolution = view.getResolutionForZoom(currentZoomLevel);
        if (resolutionsFilter(resolution)) {
          pushScale(optionScales, resolution, view);
        }
      }
    } else {
      const reversedResolutions = _clone(viewResolutions).reverse();
      reversedResolutions
        .filter(resolutionsFilter)
        .forEach(resolution => pushScale(scales, resolution, view));
    }

    return optionScales;
  }, [map, resolutionsFilter, scales]);

  const zoomListener = useCallback((evt: OlObjectEvent) => {
    const zoom = (evt.target as OlView).getZoom();
    let roundZoom = 0;
    if (_isNumber(zoom)) {
      roundZoom = Math.round(zoom);
    }

    setInternalZoomLevel(roundZoom);
  }, []);

  const internalScales = useMemo(() => {
    return scales.length > 0 ? scales : getOptionsFromMap();
  }, [scales, getOptionsFromMap]);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (syncWithMap) {
      map.getView().on('change:resolution', zoomListener);
    } else {
      map.getView().un('change:resolution', zoomListener);
    }
  }, [map, syncWithMap, zoomListener]);

  useEffect(() => {
    setInternalZoomLevel(map?.getView().getZoom());
  }, [map]);

  const onZoomLevelSelectInternal = (selectedScale: string) => {
    if (!map) {
      return;
    }

    if (onZoomLevelSelect) {
      onZoomLevelSelect(selectedScale);
    } else {
      // The default.
      const mapView = map.getView();
      const calculatedResolution = MapUtil.getResolutionForScale(
        parseInt(selectedScale, 10), mapView.getProjection().getUnits()
      );
      mapView.setResolution(calculatedResolution);
    }
  };

  const determineOptionKeyForZoomLevel = (zoom: number): string | undefined => {
    if (!_isInteger(zoom) || (internalScales.length - 1 - zoom) < 0) {
      return undefined;
    }
    return internalScales[internalScales.length - 1 - zoom].toString();
  };

  const finalClassName = className
    ? `${className} ${defaultClassName}`
    : defaultClassName;

  return (
    <Select
      showSearch
      onChange={onZoomLevelSelectInternal}
      filterOption={(input, option) => option?.key?.toString().startsWith(input) ?? false}
      value={determineOptionKeyForZoomLevel(internalZoomLevel ?? 0)}
      size="small"
      className={finalClassName}
      options={internalScales.map(roundScale => ({
        value: roundScale.toString(),
        label: `1:${roundScale.toLocaleString()}`
      }))}
      {...passThroughProps}
    />
  );
};

export default ScaleCombo;

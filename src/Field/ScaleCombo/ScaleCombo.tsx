import { Select } from 'antd';
import * as React from 'react';
const Option = Select.Option;

import './ScaleCombo.less';

import Logger from '@terrestris/base-util/dist/Logger';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import _clone from 'lodash/clone';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _isFunction from 'lodash/isFunction';
import _isInteger from 'lodash/isInteger';
import _isNil from 'lodash/isNil';
import _isNumber from 'lodash/isNumber';
import _reverse from 'lodash/reverse';
import OlMap from 'ol/Map';
import OlMapEvent from 'ol/MapEvent';
import OlView from 'ol/View';

import { CSS_PREFIX } from '../../constants';

interface ScaleComboProps {
  /**
   * A filter function to filter resolutions no options should be created
   */
  resolutionsFilter: (item: any, index?: number, resolutions?: number[]) => boolean;
  /**
   * Set to false to not listen to the map moveend event.
   */
  syncWithMap: boolean;
  /**
   * The scales.
   */
  scales: number[];
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * The zoomLevel.
   */
  zoomLevel?: number;
  /**
   * The onZoomLevelSelect function. Pass a function if you want something
   * different than the resolution of the passed map.
   */
  onZoomLevelSelect?: (zoomLevel: string) => void;
  /**
   * The resolutions.
   */
  resolutions?: number[];
  /**
   * The map
   */
  map: OlMap;
}

interface ScaleComboState {
  /**
   * The zoomLevel.
   */
  zoomLevel?: number;
  /**
   * The onZoomLevelSelect function. Pass a function if you want something
   * different than the resolution of the passed map.
   */
  onZoomLevelSelect?: (zoomLevel: string) => void;
  /**
   * The scales.
   */
  scales: number[];
}

/**
 * Class representing a scale combo to choose map scale via a dropdown menu.
 *
 * @class The ScaleCombo
 * @extends React.Component
 */
class ScaleCombo extends React.Component<ScaleComboProps, ScaleComboState> {

  /**
   * The default props
   */
  static defaultProps = {
    resolutionsFilter: () => true,
    scales: [],
    syncWithMap: true
  };

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}scalecombo`;

  /**
   * Create a scale combo.
   * @constructs ScaleCombo
   */
  constructor(props: ScaleComboProps) {
    super(props);

    /**
     * The default onZoomLevelSelect function sets the resolution of the passed
     * map according to the selected Scale.
     *
     * @param selectedScale The selectedScale.
     */
    const defaultOnZoomLevelSelect = (selectedScale: string) => {
      const mapView = props.map.getView();
      const calculatedResolution = MapUtil.getResolutionForScale(
        parseInt(selectedScale, 10), mapView.getProjection().getUnits()
      );
      mapView.setResolution(calculatedResolution);
    };

    this.state = {
      zoomLevel: props.zoomLevel || props.map.getView().getZoom(),
      onZoomLevelSelect: props.onZoomLevelSelect || defaultOnZoomLevelSelect,
      scales: props.scales.length > 0 ? props.scales : this.getOptionsFromMap()
    };

    if (props.syncWithMap) {
      props.map.on('moveend', this.zoomListener);
    }
  }

  /**
   * Invoked after the component is instantiated as well as when it
   * receives new props. It should return an object to update state, or null
   * to indicate that the new props do not require any state updates.
   *
   * @param nextProps The next properties.
   * @param prevState The previous state.
   */
  static getDerivedStateFromProps(nextProps: ScaleComboProps, prevState: ScaleComboState) {
    if (_isInteger(nextProps.zoomLevel) &&
        !_isEqual(nextProps.zoomLevel, prevState.zoomLevel)) {
      return {
        zoomLevel: nextProps.zoomLevel
      };
    }

    if (_isFunction(nextProps.onZoomLevelSelect) &&
        !_isEqual(nextProps.onZoomLevelSelect, prevState.onZoomLevelSelect)) {
      return {
        onZoomLevelSelect: nextProps.onZoomLevelSelect
      };
    }

    return null;
  }

  /**
   * Invoked immediately after updating occurs. This method is not called for
   * the initial render.
   *
   * @param prevProps The previous props.
   */
  componentDidUpdate(prevProps: ScaleComboProps) {
    const {
      map,
      syncWithMap
    } = this.props;

    if (!_isEqual(syncWithMap, prevProps.syncWithMap)) {
      if (syncWithMap) {
        map.on('moveend', this.zoomListener);
      } else {
        map.un('moveend', this.zoomListener);
      }
    }
  }

  /**
   * Set the zoomLevel of the to the ScaleCombo.
   *
   * @param evt The 'moveend' event
   * @private
   */
  zoomListener = (evt: OlMapEvent) => {
    const zoom = (evt.target as OlMap).getView().getZoom();
    let roundZoom = 0;
    if (_isNumber(zoom)) {
      roundZoom = Math.round(zoom);
    }

    this.setState({
      zoomLevel: roundZoom
    });
  };

  /**
   * @function pushScaleOption: Helper function to create a {@link Option} scale component
   * based on a resolution and the {@link OlView}
   *
   * @param scales The scales array to push the scale to.
   * @param resolution map cresolution to generate the option for
   * @param view The map view
   *
   */
  pushScale = (scales: number[], resolution: number, view: OlView) => {
    const scale = MapUtil.getScaleForResolution(resolution, view.getProjection().getUnits());
    if (!scale) {
      return;
    }
    const roundScale = MapUtil.roundScale(scale);
    if (scales.includes(roundScale) ) {
      return;
    }
    scales.push(roundScale);
  };

  /**
   * Generates the scales to add as {@link Option} to the SelectField based on
   * the given instance of {@link OlMap}.
   *
   * @return The array of scales.
   */
  getOptionsFromMap() {
    const {
      map,
      resolutionsFilter
    } = this.props;

    if (!map) {
      Logger.warn('Map component not found. Could not initialize options array.');
      return [];
    }

    const scales: number[] = [];
    const view = map.getView();
    // use existing resolutions array if exists
    const resolutions = view.getResolutions();

    if (_isEmpty(resolutions) || _isNil(resolutions)) {
      for (let currentZoomLevel = view.getMaxZoom(); currentZoomLevel >= view.getMinZoom(); currentZoomLevel--) {
        const resolution = view.getResolutionForZoom(currentZoomLevel);
        if (resolutionsFilter(resolution)) {
          this.pushScale(scales, resolution, view);
        }
      }
    } else {
      const reversedResolutions = _reverse(_clone(resolutions));
      reversedResolutions
        .filter(resolutionsFilter)
        .forEach((resolution) => {
          this.pushScale(scales, resolution, view);
        });
    }

    return scales;
  }

  /**
   * Determine option element for provided zoom level out of array of valid options.
   *
   * @param zoom zoom level
   *
   * @return Option element for provided zoom level
   */
  determineOptionKeyForZoomLevel = (zoom?: number): string | undefined => {
    if (_isNil(zoom)) {
      return undefined;
    }
    if (!_isInteger(zoom) || (this.state.scales.length - 1 - zoom) < 0) {
      return undefined;
    }
    return this.state.scales[this.state.scales.length - 1 - zoom].toString();
  };

  /**
   * The render function.
   */
  render() {
    const {
      map,
      className,
      onZoomLevelSelect: onZoomLevelSelectProp,
      resolutions,
      resolutionsFilter,
      scales: scalesProp,
      syncWithMap,
      zoomLevel: zoomLevelProp,
      ...passThroughProps
    } = this.props;

    const {
      onZoomLevelSelect,
      scales,
      zoomLevel
    } = this.state;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    const options = scales.map(roundScale => {
      return (
        <Option
          key={roundScale}
          value={roundScale.toString()}
        >
          {`1:${roundScale.toLocaleString()}`}
        </Option>
      );
    });

    return (
      <Select
        showSearch
        onChange={onZoomLevelSelect}
        filterOption={(input, option) => option?.key?.toString().startsWith(input) ?? false}
        value={this.determineOptionKeyForZoomLevel(zoomLevel ?? 0)}
        size="small"
        className={finalClassName}
        {...passThroughProps}
      >
        {options}
      </Select>
    );
  }
}

export default ScaleCombo;

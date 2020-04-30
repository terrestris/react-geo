import * as React from 'react';
import { Select } from 'antd';
const Option = Select.Option;

import OlMap from 'ol/Map';
import OlView from 'ol/View';

const _isInteger = require('lodash/isInteger');
const _isEmpty = require('lodash/isEmpty');
const _isEqual = require('lodash/isEqual');
const _isFunction = require('lodash/isFunction');
const _reverse = require('lodash/reverse');
const _clone = require('lodash/clone');

import Logger from '@terrestris/base-util/dist/Logger';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import { CSS_PREFIX } from '../../constants';

import './ScaleCombo.less';

interface DefaultProps {
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
}

interface BaseProps {
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

export type ScaleComboProps = BaseProps & Partial<DefaultProps>;

/**
 * Class representing a scale combo to choose map scale via a dropdown menu.
 *
 * @class The ScaleCombo
 * @extends React.Component
 */
class ScaleCombo extends React.Component<ScaleComboProps, ScaleComboState> {

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}scalecombo`;

  /**
   * The default props
   */
  static defaultProps = {
    resolutionsFilter: () => true,
    scales: [],
    syncWithMap: true
  };

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
        selectedScale, mapView.getProjection().getUnits()
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
  zoomListener = (evt) => {
    const zoom = evt.target.getView().getZoom();
    let roundZoom = Math.round(zoom);
    if (!roundZoom) {
      roundZoom = 0;
    }

    this.setState({
      zoomLevel: roundZoom
    });
  }

  /**
   * @function pushScaleOption: Helper function to create a {@link Option} scale component
   * based on a resolution and the {@link Ol.View}
   *
   * @param scales The scales array to push the scale to.
   * @param resolution map cresolution to generate the option for
   * @param view The map view
   *
   */
  pushScale = (scales: string[], resolution: number, view: OlView) => {
    let scale = MapUtil.getScaleForResolution(resolution, view.getProjection().getUnits());
    const roundScale = MapUtil.roundScale(scale);
    if (scales.includes(roundScale) ) {
      return;
    }
    scales.push(roundScale);
  }

  /**
   * Generates the scales to add as {@link Option} to the SelectField based on
   * the given instance of {@link Ol.Map}.
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

    let scales = [];
    let view = map.getView();
    // use existing resolutions array if exists
    let resolutions = view.getResolutions();

    if (_isEmpty(resolutions)) {
      for (let currentZoomLevel = view.getMaxZoom(); currentZoomLevel >= view.getMinZoom(); currentZoomLevel--) {
        let resolution = view.getResolutionForZoom(currentZoomLevel);
        if (resolutionsFilter(resolution)) {
          this.pushScale(scales, resolution, view);
        }
      }
    } else {
      let reversedResolutions = _reverse(_clone(resolutions));
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
  determineOptionKeyForZoomLevel = (zoom: number): string | undefined => {
    if (!_isInteger(zoom) || (this.state.scales.length - 1 - zoom) < 0) {
      return undefined;
    }
    return this.state.scales[this.state.scales.length - 1 - zoom].toString();
  }

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
        filterOption={(input, option) => option.key.toString().startsWith(input)}
        value={this.determineOptionKeyForZoomLevel(zoomLevel)}
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

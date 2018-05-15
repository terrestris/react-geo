import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
const Option = Select.Option;
import OlMap from 'ol/map';
import {
  isInteger,
  isEmpty,
  isEqual,
  isFunction,
  reverse,
  clone
} from 'lodash';

import Logger from '../../Util/Logger';
import MapUtil from '../../Util/MapUtil/MapUtil';
import { CSS_PREFIX } from '../../constants';

/**
 * Class representing a scale combo to choose map scale via a dropdown menu.
 *
 * @class The ScaleCombo
 * @extends React.Component
 */
class ScaleCombo extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}scalecombo`

  static propTypes = {
    /**
     * An optional CSS class which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * The zoomLevel.
     * @type {Number}
     */
    zoomLevel: PropTypes.number,

    /**
     * The onZoomLevelSelect function. Pass a function if you want something
     * different than the resolution of the passed map.
     *
     * @type {Function}
     */
    onZoomLevelSelect: PropTypes.func,

    /**
     * The resolutions.
     * @type {Array}
     */
    resolutions: PropTypes.arrayOf(PropTypes.number),

    /**
     * The scales.
     * @type {Array}
     */
    scales: PropTypes.arrayOf(PropTypes.shape),

    /**
     * A filter function to filter resolutions no options should be created
     * @type {Function}
     */
    resolutionsFilter: PropTypes.func,

    /**
     * The style object
     * @type {Object}
     */
    style: PropTypes.object,

    /**
     * The map
     * @type {Ol.Map}
     */
    map: PropTypes.instanceOf(OlMap).isRequired,

    /**
     * Set to false to not listen to the map moveend event.
     *
     * @type {Boolean}
     */
    syncWithMap: PropTypes.bool
  }

  /**
   * The default props
   */
  static defaultProps = {
    resolutionsFilter: () => true,
    style: {
      width: 100
    },
    scales: [],
    syncWithMap: true
  }

  /**
   * Create a scale combo.
   * @constructs ScaleCombo
   */
  constructor(props) {
    super(props);

    /**
     * The default onZoomLevelSelect function sets the resolution of the passed
     * map according to the selected Scale.
     *
     * @param  {Number} selectedScale The selectedScale.
     */
    const defaultOnZoomLevelSelect = selectedScale => {
      const mapView = props.map.getView();
      const calculatedResolution = MapUtil.getResolutionForScale(
        selectedScale, mapView.getProjection().getUnits()
      );
      mapView.setResolution(calculatedResolution);
    };

    this.state = {
      zoomLevel: props.zoomLevel || props.map.getView().getZoom(),
      onZoomLevelSelect: props.onZoomLevelSelect || defaultOnZoomLevelSelect,
      scales: props.scales
    };

    if (props.syncWithMap) {
      props.map.on('moveend', this.zoomListener);
    }
  }

  /**
   * Set the zoomLevel of the to the ScaleCombo.
   *
   * @param  {Object} evt The 'moveend' event
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
   * Called on componentWillReceiveProps lifecycle event.
   *
   * @param {Object} newProps The new properties.
   */
  componentWillReceiveProps(newProps) {
    if (!isEqual(newProps.zoomLevel, this.props.zoomLevel)) {
      this.setState({
        zoomLevel: newProps.zoomLevel
      });
    }

    if (!newProps.syncWithMap !== this.props.syncWithMap) {
      if (newProps.syncWithMap) {
        this.props.map.on('moveend', this.zoomListener);
      } else {
        this.props.map.un('moveend', this.zoomListener);
      }
    }

    if (isFunction(newProps.onZoomLevelSelect)
      && !isEqual(newProps.onZoomLevelSelect, this.state.onZoomLevelSelect)) {
      this.setState({
        onZoomLevelSelect: newProps.onZoomLevelSelect
      });
    }
  }

  /**
   * @function pushScaleOption: Helper function to create a {@link Option} scale component
   * based on a resolution and the {@link Ol.View}
   *
   * @param {Number} resolution map cresolution to generate the option for
   * @param {Ol.View} mv The map view
   *
   */
  pushScale = (resolution, mv) => {
    let scale = MapUtil.getScaleForResolution(resolution, mv.getProjection().getUnits());
    const roundScale = MapUtil.roundScale(scale);
    if (this.state.scales.includes(roundScale) ) {
      return;
    }
    this.state.scales.push(roundScale);
  };

  /**
   * @function getOptionsFromMap: Helper function generate {@link Option} scale components
   * based on an existing instance of {@link Ol.Map}
   */
  getOptionsFromMap = () => {
    const {
      map,
      resolutionsFilter
    } = this.props;

    if (!isEmpty(this.state.scales)) {
      Logger.debug('Array with scales found. Returning');
      return;
    }
    if (!map) {
      Logger.warn('Map component not found. Could not initialize options array.');
      return;
    }

    let mv = map.getView();
    // use existing resolutions array if exists
    let resolutions = mv.getResolutions();
    if (isEmpty(resolutions)) {
      for (let currentZoomLevel = mv.getMaxZoom(); currentZoomLevel >= mv.getMinZoom(); currentZoomLevel--) {
        let resolution = mv.getResolutionForZoom(currentZoomLevel);
        if (resolutionsFilter(resolution)) {
          this.pushScale(resolution, mv);
        }
      }
    } else {
      let reversedResolutions = reverse(clone(resolutions));
      reversedResolutions
        .filter(resolutionsFilter)
        .forEach((resolution) => {
          this.pushScale(resolution, mv);
        });
    }
  };

  /**
   * Determine option element for provided zoom level out of array of valid options.
   *
   * @param {Number} zoom zoom level
   *
   * @return {Element} Option element for provided zoom level
   */
  determineOptionKeyForZoomLevel = (zoom) => {
    if (!isInteger(zoom) || (this.state.scales.length - 1 - zoom) < 0) {
      return undefined;
    }
    return this.state.scales[this.state.scales.length - 1 - zoom].toString();
  }

  /**
   * componentWillMount - lifecycle event.
   */
  componentWillMount() {
    if (isEmpty(this.state.scales) && this.props.map) {
      this.getOptionsFromMap();
    }
  }

  /**
   * The render function.
   */
  render() {
    const {
      style,
      className
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
      return <Option
        key={roundScale}
        value={roundScale.toString()}
      >
        {`1:${roundScale.toLocaleString()}`}
      </Option>;
    });

    return (
      <Select
        showSearch
        onChange={onZoomLevelSelect}
        filterOption={(input, option) => option.key.startsWith(input)}
        value={this.determineOptionKeyForZoomLevel(zoomLevel)}
        size="small"
        style={style}
        className={finalClassName}
      >
        {options}
      </Select>
    );
  }
}

export default ScaleCombo;

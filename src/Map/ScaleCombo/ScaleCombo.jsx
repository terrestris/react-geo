import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
const Option = Select.Option;
import { isNumber, isEmpty, isEqual, reverse, clone } from 'lodash';

import Logger from '../../Util/Logger';
import MapUtils from '../../Util/MapUtil';

/**
 * Class representating a scale combo to choose map scale via a dropdown menu.
 *
 * @class The ScaleCombo
 * @extends React.Component
 */
class ScaleCombo extends React.Component {

  static propTypes = {
    /**
     * The zoomLevel.
     * @type {Number}
     */
    zoomLevel: PropTypes.number,

    /**
     * The onZoomLevelSelect function. This function is passed to Select component
     * @type {Function}
     */
    onZoomLevelSelect: PropTypes.func.isRequired,

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
     * The style object
     * @type {Object}
     */
    style: PropTypes.object,

    /**
     * The map
     * @type {Ol.Map}
     */
    map: PropTypes.object
  }

  /**
   * The default props
   */
  static defaultProps = {
    style: {
      width: 100
    },
    scales: []
  }

  /**
   * Create a map.
   * @constructs Map
   */
  constructor(props) {
    super(props);

    this.pushScaleOption = this.pushScaleOption.bind(this);
    this.getOptionsFromMap = this.getOptionsFromMap.bind(this);
    this.determineOptionKeyForZoomLevel = this.determineOptionKeyForZoomLevel.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.getInputElement = this.getInputElement.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);

    this.state = {
      zoomLevel: props.zoomLevel,
      scales: props.scales
    };
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
  }

  /**
   * @function pushScaleOption: Helper function to create a {@link Option} scale component
   * based on a resolution and the {@link Ol.View}
   *
   * @param {Number} resolution map cresolution to generate the option for
   * @param {Ol.View} mv The map view
   *
   */
  pushScaleOption = (resolution, mv) => {
    let scale = MapUtils.getScaleForResolution(resolution, mv.getProjection().getUnits());
    // Round scale to nearest multiple of 10.
    let roundScale = Math.round(scale / 10) * 10;
    let option = <Option key={roundScale.toString()} value={roundScale.toString()}>1:{roundScale.toLocaleString()}</Option>;
    this.state.scales.push(option);
  };

  /**
   * @function getOptionsFromMap: Helper function generate {@link Option} scale components
   * based on an existing instance of {@link Ol.Map}
   */
  getOptionsFromMap = () => {
    if (!isEmpty(this.state.scales)) {
      Logger.debug('Array with scales found. Returning');
      return;
    }
    if (!this.props.map) {
      Logger.warn('Map component not found. Could not initialize options array.');
      return;
    }

    let map = this.props.map;
    let mv = map.getView();
    // use existing resolutions array if exists
    let resolutions = mv.getResolutions();
    if (isEmpty(resolutions)) {
      for (let currentZoomLevel = mv.getMaxZoom(); currentZoomLevel >= mv.getMinZoom(); currentZoomLevel--) {
        let resolution = mv.getResolutionForZoom(currentZoomLevel);
        this.pushScaleOption(resolution, mv);
      }
    } else {
      let reversedResolutions = reverse(clone(resolutions));
      reversedResolutions.forEach((resolution) => {
        this.pushScaleOption(resolution, mv);
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
  determineOptionKeyForZoomLevel (zoom) {
    if (!isNumber(zoom) || (this.state.scales.length - 1 - zoom) < 0) {
      return undefined;
    }
    return this.state.scales[this.state.scales.length - 1 - zoom].key;
  }

  /**
   * handleOnKeyDown of input:
   * trigger setScale (passed by props) after ENTER key pressed
   *
   * @param {Event} event KeyBoard event
   */
  handleOnKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.props.onZoomLevelSelect(event.target.value);
    }
  }

  /**
   * Create input element with registered onKeyDown event used in Select
   *
   * @return {Element} input of scale chooser
   */
  getInputElement = () => {
    return <input onKeyDown={this.handleOnKeyDown} />;
  }

  /**
   * componentWillMount - Description
   *
   * @return {type} Description
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
    let {
      onZoomLevelSelect,
      style
    } = this.props;

    return (
      <div>
        <Select
          showSearch
          onChange={onZoomLevelSelect}
          getInputElement={this.getInputElement}
          filterOption={false}
          value={this.determineOptionKeyForZoomLevel(this.state.zoomLevel)}
          size="small"
          style={style}
          className = "scale-select"
        >
          {this.state.scales}
        </Select>
      </div>);
  }
}

export default ScaleCombo;

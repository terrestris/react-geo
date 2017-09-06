import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
const Option = Select.Option;
import { isNumber, isEmpty } from 'lodash';

import Logger from '../../Util/Logger';
import MapUtils from '../../Util/MapUtil';

/**
 * Class representating a scale combo to choose map scale via a dropdown menu.
 *
 * @class The FloatingMapLogo
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
    this.getVal = this.getVal.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.getInputElement = this.getInputElement.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);

    this.state = {
      zoomLevel: props.zoomLevel
    };
  }

  /**
   * Unknown - Description
   *
   * @param {type} resolution Description
   * @param {type} mv         Description
   *
   * @return {type} Description
   */
  pushScaleOption = (resolution, mv) => {
    let scale = MapUtils.getScaleForResolution(resolution, mv.getProjection().getUnits());
    let roundScale = Math.round(scale);
    let option = <Option key={roundScale.toString()} value={roundScale.toString()}>1:{roundScale.toLocaleString()}</Option>;
    this.props.scales.push(option);
  };

  /**
   * Unknown - Description
   *
   * @param {type} resolution Description
   * @param {type} mv         Description
   *
   * @return {type} Description
   */
  getOptionsFromMap = () => {
    if (!isEmpty(this.props.scales)) {
      Logger.debug('Array with scales found. Returning');
      return;
    }
    if (! this.props.map) {
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
      resolutions.forEach((resolution) => {
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
  getVal (zoom) {
    if (!isNumber(zoom) || (this.props.scales.length - 1 - zoom) < 0) {
      return undefined;
    }
    return this.props.scales[this.props.scales.length - 1 - zoom].key;
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
    if (isEmpty(this.props.scales) && this.props.map) {
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
          value={this.getVal(this.state.zoomLevel)}
          size="small"
          style={style}
          className = "scale-select"
        >
          {this.props.scales}
        </Select>
      </div>);
  }
}

export default ScaleCombo;

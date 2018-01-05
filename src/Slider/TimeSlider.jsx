import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  isArray
} from 'lodash';

import {
  Slider
} from 'antd';

/**
 * Customized slider that uses ISO 8601 time strings as input.
 *
 * @class The TimeSlider
 * @extends React.Component
 */
class TimeSlider extends React.Component {

  static propTypes = {
    /**
     * A class name string to use on surrounding div.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * Whether to allow range selection.
     * @type {Boolean}
     */
    useRange: PropTypes.bool,

    /**
     * The default value(s).
     * @type {Array<String> | String}
     */
    defaultValue: PropTypes.any,

    /**
     * The minimum value.
     * @type {String}
     */
    min: PropTypes.string,

    /**
     * The maximum value.
     * @type {String}
     */
    max: PropTypes.string,

    /**
     * Called when the value changes.
     * @type {Function}
     */
    onChange: PropTypes.func,

    /**
     * The current value(s).
     * @type {Array<String> | String}
     */
    value: PropTypes.any,

    /**
     * The moment.js compliant format string for the slider tooltip.
     * @type {String}
     */
    formatString: PropTypes.string
  }

  static defaultProps = {
    useRange: false,
    defaultValue: moment().toISOString(),
    min: moment().subtract(1, 'hour').toISOString(),
    max: moment().toISOString(),
    onChange: () => undefined,
    value: moment().toISOString(),
    formatString: 'DD.MM. HH:mm'
  }

  /**
   * The constructor.
   *
   * @constructs TimeSlider
   * @param {Object} props The properties.
   */
  constructor(props) {
    super(props);

    this.state = this.convertTimestamps();
  }

  /**
   * Converts the various input strings to unix timestamps.
   * @return {Object} the converted values
   */
  convertTimestamps = () => {
    return {
      min: moment(this.props.min).unix(),
      max: moment(this.props.max).unix(),
      defaultValue: this.convert(this.props.defaultValue)
    };
  }

  /**
   * Convert a value to unix timestamps.
   * @param  {Array | String} val the input value(s)
   * @return {Array | Number}     the converted value(s)
   */
  convert = val => {
    if (val === undefined) {
      return val;
    }
    return isArray(val) ?
      val.map(iso => moment(iso).unix()) :
      moment(val).unix();
  }

  /**
   * Formats a timestamp for user display.
   * @param  {Number} unix unix timestamps
   * @return {String}      the formatted timestamps
   */
  formatTimestamp = unix => {
    return moment(unix * 1000).format(this.props.formatString);
  }

  /**
   * Called when the value(s) are changed. Converts the value(s) back to ISO
   * timestrings.
   * @param  {Array | Number} value the new value
   */
  valueUpdated = value => {
    this.props.onChange(isArray(value) ?
      [moment(value[0] * 1000).toISOString(),
        moment(value[1] * 1000).toISOString()] :
      moment(value * 1000).toISOString());
  }

  /**
   * The render function.
   */
  render() {
    return (
      <div>
        <Slider
          className={this.props.className}
          defaultValue={this.convert(this.props.defaultValue)}
          range={this.props.useRange}
          min={moment(this.props.min).unix()}
          max={moment(this.props.max).unix()}
          tipFormatter={this.formatTimestamp}
          onChange={this.valueUpdated}
          value={this.convert(this.props.value)}
        />
      </div>
    );
  }
}

export default TimeSlider;

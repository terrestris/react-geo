import React from 'react';
import moment from 'moment';

import { Slider } from 'antd';

import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import { SliderMarks, SliderValue } from 'antd/lib/slider';

import { CSS_PREFIX } from '../constants';

interface TimeSliderDefaultProps {
  /**
   * Whether to allow range selection.
   * @type {Boolean}
   */
  useRange: boolean;
  /**
   * The default value(s).
   */
  defaultValue: string[] | string;
  /**
   * The minimum value.
   */
  min: string;
  /**
   * The maximum value.
   */
  max: string;
  /**
   * Called when the value changes.
   * @type {Function}
   */
  onChange: (val: string | string[]) => void;
  /**
   * The current value(s).
   * @type {Array<String> | String}
   */
  value: string[] | string;
  /**
   * The moment.js compliant format string for the slider tooltip.
   */
  formatString: string;
}

/**
 *
 * @export
 * @interface TimeSliderProps
 * @extends {Partial<TimeSliderDefaultProps>}
 */
export interface TimeSliderProps extends Partial<TimeSliderDefaultProps> {
  /**
   * An optional CSS class which should be added.
   */
  className: string;
  /**
   * Tick mark of Slider, type of key must be TimeStamp ISOString, and must in
   * closed interval min, max，each mark can declare its own style.
   */
  marks: SliderMarks;
}

/**
 * Customized slider that uses ISO 8601 time strings as input.
 *
 * @class The TimeSlider
 * @extends React.Component
 */
class TimeSlider extends React.Component<TimeSliderProps> {

  /**
   * The className added to this component.
   * @private
   */
  className: string = `${CSS_PREFIX}timeslider`;

  static defaultProps: TimeSliderDefaultProps = {
    useRange: false,
    defaultValue: moment().toISOString(),
    min: moment().subtract(1, 'hour').toISOString(),
    max: moment().toISOString(),
    onChange: () => undefined,
    value: moment().toISOString(),
    formatString: 'DD.MM. HH:mm'
  };

  /**
   * The constructor.
   *
   * @constructs TimeSlider
   * @param {Object} props The properties.
   */
  constructor(props: TimeSliderProps) {
    super(props);

    // TODO: State is never used. Can we remove this?
    this.state = this.convertTimestamps();
  }

  /**
   * Converts the various input strings to unix timestamps.
   * @return {Object} the converted values
   */
  convertTimestamps() {
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
  convert(val: string[] | string): SliderValue | undefined {
    if (val === undefined) {
      return val as undefined;
    }
    return isArray(val) ?
      val.map(iso => moment(iso).unix()) as SliderValue :
      moment(val).unix() as SliderValue;
  }

  /**
   * Convert the keys of mark values to unix timestamps.
   *
   * @param {Object} marks The marks prop.
   * @return {Object} The marks prop with converted keys.
   */
  convertMarks(marks: SliderMarks) {
    let convertedMarks;
    if (isObject(marks)) {
      convertedMarks = {};
      Object.keys(marks).forEach(key => {
        const convertedKey = this.convert(key) as number;
        convertedMarks[convertedKey] = marks[key];
      });
    }
    return convertedMarks;
  }

  /**
   * Formats a timestamp for user display.
   * @param  {Number} unix unix timestamps
   * @return {String}      the formatted timestamps
   */
  formatTimestamp(unix: number): string {
    return moment(unix * 1000).format(this.props.formatString);
  }

  /**
   * Called when the value(s) are changed. Converts the value(s) back to ISO
   * timestrings.
   * @param  {Array | Number} value the new value
   */
  valueUpdated(value: number | number[]) {
    this.props.onChange(isArray(value) ?
      [moment(value[0] * 1000).toISOString(),
        moment(value[1] * 1000).toISOString()] :
      moment(value * 1000).toISOString());
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      defaultValue,
      formatString,
      min,
      max,
      value,
      marks,
      onChange,
      useRange,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    const convertedMarks = this.convertMarks(marks);

    return (
      <Slider
        className={finalClassName}
        defaultValue={this.convert(defaultValue)}
        range={useRange}
        min={moment(min).unix()}
        max={moment(max).unix()}
        tipFormatter={this.formatTimestamp.bind(this)}
        onChange={this.valueUpdated.bind(this)}
        value={this.convert(value)}
        marks={convertedMarks}
        {...passThroughProps}
      />
    );
  }
}

export default TimeSlider;

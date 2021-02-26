import * as React from 'react';
import moment from 'moment';

import { Slider } from 'antd';

import _isArray from 'lodash/isArray';
import _isObject from 'lodash/isObject';
import { SliderMarks, SliderBaseProps } from 'antd/lib/slider';

import { CSS_PREFIX } from '../../constants';

interface DefaultProps {
  /**
   * Whether to allow range selection.
   */
  useRange: boolean;
  /**
   * The default value(s).
   */
  defaultValue: string | [string, string];
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
   */
  onChange: (val: string | [string, string]) => void;
  /**
   * The current value(s).
   */
  value: string | [string, string];
  /**
   * The moment.js compliant format string for the slider tooltip.
   */
  formatString: string;
}

export interface BaseProps {
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * Tick mark of Slider, type of key must be TimeStamp ISOString, and must in
   * closed interval min, max，each mark can declare its own style.
   */
  marks?: SliderMarks;
}

export type TimeSliderProps = BaseProps & Partial<DefaultProps> &
Omit<SliderBaseProps, 'min' | 'max' | 'marks' | 'className'>;

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

  static defaultProps: DefaultProps = {
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
   * @param props The properties.
   */
  constructor(props: TimeSliderProps) {
    super(props);

    // TODO: State is never used. Can we remove this?
    this.state = this.convertTimestamps();
  }

  /**
   * Converts the various input strings to unix timestamps.
   * @return The converted values
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
   * @param val the input value(s)
   * @return The converted value(s)
   */
  convert(val: string[] | string): number | [number, number] | undefined {
    if (val === undefined) {
      return val as undefined;
    }
    return _isArray(val) ?
      (val as Array<string>).map(iso => moment(iso).unix()) as [number, number]:
      moment(val).unix() as number;
  }

  /**
   * Convert the keys of mark values to unix timestamps.
   *
   * @param marks The marks prop.
   * @return The marks prop with converted keys.
   */
  convertMarks(marks: SliderMarks): SliderMarks {
    let convertedMarks: SliderMarks;
    if (_isObject(marks)) {
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
   * @param unix unix timestamps
   * @return The formatted timestamps
   */
  formatTimestamp(unix: number): string {
    return moment(unix * 1000).format(this.props.formatString);
  }

  /**
   * Called when the value(s) are changed. Converts the value(s) back to ISO
   * timestrings.
   * @param value the new value
   */
  valueUpdated(value: number | number[]) {
    this.props.onChange(_isArray(value) ?
      [moment(value[0] * 1000).toISOString(),
        moment(value[1] * 1000).toISOString()] :
      moment((value as number) * 1000).toISOString());
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

    let defaultVal;
    let val;
    if (useRange) {
      defaultVal = this.convert(defaultValue) as [number, number];
      val = this.convert(value) as [number, number];
    } else {
      defaultVal = this.convert(defaultValue) as number;
      val = this.convert(value) as number;
    }

    return (
      <Slider
        className={finalClassName}
        defaultValue={defaultVal}
        range={useRange}
        min={moment(min).unix()}
        max={moment(max).unix()}
        tipFormatter={this.formatTimestamp.bind(this)}
        onChange={this.valueUpdated.bind(this)}
        value={val}
        marks={convertedMarks}
        {...passThroughProps}
      />
    );
  }
}

export default TimeSlider;

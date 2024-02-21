import { Slider, SliderSingleProps } from 'antd';
import _isArray from 'lodash/isArray';
import moment from 'moment';
import React, { CSSProperties, ReactNode } from 'react';

import { CSS_PREFIX } from '../../constants';

interface Mark {
  style?: CSSProperties;
  label?: ReactNode;
}

export type SliderMarks = {
  [key: number]: ReactNode | Mark;
};
interface OwnProps {
  useRange?: boolean;
  defaultValue: string | [string, string];
  min: string;
  max: string;
  onChange: (val: string | [string, string]) => void;
  value: string | [string, string];
  formatString: string;
  className?: string;
  marks: SliderSingleProps['marks'];
}

export type TimeSliderProps = OwnProps;

const TimeSlider: React.FC<TimeSliderProps> = ({
  useRange = false,
  defaultValue = moment().toISOString(),
  min = moment().subtract(1, 'hour').toISOString(),
  max = moment().toISOString(),
  onChange = () => undefined,
  value = moment().toISOString(),
  formatString = 'DD.MM. HH:mm',
  className,
  marks,
  ...passThroughProps
}) => {
  const convert = (val: string[] | string): number | [number, number] => {
    return _isArray(val)
      ? ((val as Array<string>).map(iso => moment(iso).unix()) as [
          number,
          number
        ])
      : (moment(val).unix() as number);
  };

  const convertMarks = (
    mks: SliderSingleProps['marks']
  ): SliderSingleProps['marks'] => {
    if (!mks) {
      return;
    }
    let convertedMks: SliderSingleProps['marks'] = {};
    Object.keys(mks).forEach((key: string) => {
      if (!convertedMks) {
        return;
      }
      const convertedKey = convert([key]) as number; // Assuming key is ISOString
      convertedMks[convertedKey] = mks[key];
    });
    return convertedMks;
  };

  const formatTimestamp = (unix: number): string => {
    return unix ? moment(unix * 1000).format(formatString) : '';
  };

  const valueUpdated = (val: number | number[]) => {
    onChange(
      _isArray(val)
        ? [
          moment(val[0] * 1000).toISOString(),
          moment(val[1] * 1000).toISOString()
        ]
        : moment(val * 1000).toISOString()
    );
  };

  const finalClassName = className
    ? `${className} ${CSS_PREFIX}timeslider`
    : `${CSS_PREFIX}timeslider`;
  const convertedMarks = convertMarks(marks);

  return useRange ? (
    <Slider
      className={finalClassName}
      defaultValue={convert(defaultValue) as [number, number]}
      range={true}
      min={moment(min).unix()}
      max={moment(max).unix()}
      tooltip={{ formatter: val => formatTimestamp(val as number) }}
      onChange={(val: number[]) => valueUpdated(val)}
      value={convert(value) as [number, number]}
      marks={convertedMarks}
      {...passThroughProps}
    />
  ) : (
    <Slider
      className={finalClassName}
      defaultValue={convert(defaultValue) as number}
      range={false}
      min={moment(min).unix()}
      max={moment(max).unix()}
      tooltip={{
        formatter: val => formatTimestamp(val as number)
      }}
      onChange={(val: number) => valueUpdated(val as number)}
      value={convert(value) as number}
      marks={convertedMarks}
      {...passThroughProps}
    />
  );
};

export default TimeSlider;

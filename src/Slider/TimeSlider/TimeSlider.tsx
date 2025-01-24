import React, { useMemo } from 'react';

import { Slider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import _isArray from 'lodash/isArray';
import _isFunction from 'lodash/isFunction';
import { MarkObj } from 'rc-slider/lib/Marks';

import { CSS_PREFIX } from '../../constants';

export interface TimeSliderMark {
  timestamp: Dayjs;
  markConfig: MarkObj;
}

interface OwnProps {
  className?: string;
  defaultValue?: Dayjs | [Dayjs, Dayjs];
  formatString?: string;
  marks?: TimeSliderMark[];
  max?: Dayjs;
  min?: Dayjs;
  onChange?: (val: Dayjs | [Dayjs, Dayjs]) => void;
  onChangeComplete?: (val: Dayjs | [Dayjs, Dayjs]) => void;
  useRange?: boolean;
  value?: Dayjs | [Dayjs, Dayjs];
}

export type TimeSliderProps = OwnProps;

const TimeSlider: React.FC<TimeSliderProps> = ({
  className,
  defaultValue = dayjs(),
  formatString = 'DD.MM. HH:mm',
  marks,
  max = dayjs(),
  min = dayjs().subtract(1, 'hour'),
  onChange = () => undefined,
  onChangeComplete = () => undefined,
  useRange = false,
  value = dayjs(),
  ...passThroughProps
}) => {

  const maxUnixTimestamp = useMemo(() => dayjs(max).unix(), [max]);
  const minUnixTimestamp = useMemo(() => dayjs(min).unix(), [min]);

  const convertDayjsToUnix = (val: Dayjs[] | Dayjs): number | [number, number] => {
    return _isArray(val)
      ? val.map(iso => iso.unix()) as [number, number]
      : val.unix();
  };

  const convertedMarks: Record<number, MarkObj> | undefined = useMemo(() => {
    if (!marks) {
      return;
    }
    const convertedMks: Record<number, MarkObj> = {};
    marks.forEach((mark) => {
      const convertedTimestamp = convertDayjsToUnix(mark.timestamp);
      if (Array.isArray(convertedTimestamp)) {
        return;
      }
      convertedMks[convertedTimestamp] = mark.markConfig;
    });
    return convertedMks;
  }, [marks]);

  const formatTimestamp = (unix: number): string => {
    return unix ? dayjs(unix * 1000).format(formatString) : '';
  };

  const valueUpdated = (val: number | number[]) => {
    const updatedValue = _isArray(val)
      ? [dayjs(val[0] * 1000), dayjs(val[1] * 1000)] as [Dayjs, Dayjs]
      : dayjs(val * 1000);

    if (_isFunction(onChange)) {
      onChange(updatedValue);
    }
    if (_isFunction(onChangeComplete)) {
      onChangeComplete(updatedValue);
    }
  };

  const finalClassName = className ? `${className} ${CSS_PREFIX}timeslider` : `${CSS_PREFIX}timeslider`;

  return useRange ? (
    <Slider
      className={finalClassName}
      defaultValue={convertDayjsToUnix(defaultValue) as [number, number]}
      marks={convertedMarks}
      max={maxUnixTimestamp}
      min={minUnixTimestamp}
      onChange={valueUpdated}
      onChangeComplete={valueUpdated}
      range={true}
      tooltip={{ formatter: val => formatTimestamp(val as number) }}
      value={convertDayjsToUnix(value) as [number, number]}
      {...passThroughProps}
    />
  ) : (
    <Slider
      className={finalClassName}
      defaultValue={convertDayjsToUnix(defaultValue) as number}
      marks={convertedMarks}
      max={maxUnixTimestamp}
      min={minUnixTimestamp}
      onChange={valueUpdated}
      onChangeComplete={valueUpdated}
      range={false}
      tooltip={{
        formatter: val => formatTimestamp(val as number)
      }}
      value={convertDayjsToUnix(value) as number}
      {...passThroughProps}
    />
  );
};

export default TimeSlider;

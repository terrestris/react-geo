import './TimeLayerSliderPanel.less';

import { faCalendar, faPauseCircle, faPlayCircle, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WmsLayer } from '@terrestris/ol-util/dist/typeUtils/typeUtils';
import { TimeLayerAwareConfig } from '@terrestris/react-util/dist/Hooks/useTimeLayerAware/useTimeLayerAware';
import { DatePicker, Popover, Select } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import _isEqual from 'lodash/isEqual';
import _isFinite from 'lodash/isFinite';
import moment, { Moment } from 'moment';
import { getUid } from 'ol';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import SimpleButton from '../../Button/SimpleButton/SimpleButton';
import ToggleButton from '../../Button/ToggleButton/ToggleButton';
import TimeSlider from '../../Slider/TimeSlider/TimeSlider';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

export type Tooltips = {
  hours: string;
  days: string;
  weeks: string;
  months: string;
  years: string;
  setToMostRecent: string;
  dataRange: string;
};

export type PlaybackSpeedType = 'hours' | 'days' | 'weeks' | 'months' | 'years';

export type TimeLayerSliderPanelProps = {
  className?: string;
  onChange?: (arg: moment.Moment) => void;
  timeAwareLayers: WmsLayer[];
  value?: moment.Moment;
  dateFormat?: string;
  tooltips?: Tooltips;
  autoPlaySpeedOptions?: number[];
  initStartDate?: moment.Moment;
  initEndDate?: moment.Moment;
};

export type TimeLayerSliderPanelState = {
  value: moment.Moment;
  playbackSpeed: number | PlaybackSpeedType;
  autoPlayActive: boolean;
  startDate: moment.Moment;
  endDate: moment.Moment;
};

/**
 * The panel combining all time slider related parts.
 */
export const TimeLayerSliderPanel: React.FC<TimeLayerSliderPanelProps> = memo(
  ({
    className = '',
    onChange = () => {},
    timeAwareLayers = [],
    value = moment(moment.now()),
    dateFormat = 'YYYY-MM-DD HH:mm',
    tooltips = {
      setToMostRecent: 'Set to most recent date',
      hours: 'Hours',
      days: 'Days',
      weeks: 'Weeks',
      months: 'Months',
      years: 'Years',
      dataRange: 'Set data range'
    },
    autoPlaySpeedOptions = [0.5, 1, 2, 5, 10, 100, 300],
    initStartDate = moment(moment.now()),
    initEndDate = moment(moment.now()).add(1, 'days')
  }) => {
    const [currentValue, setCurrentValue] = useState<Moment>(value);
    const [playbackSpeed, setPlaybackSpeed] = useState<
      number | PlaybackSpeedType
    >(1);
    const [autoPlayActive, setAutoPlayActive] = useState(false);
    const [startDate, setStartDate] = useState<Moment>(initStartDate);
    const [endDate, setEndDate] = useState<Moment>(initEndDate);

    const wmsTimeLayersRef = useRef<TimeLayerAwareConfig[]>([]);
    const intervalRef = useRef<number | undefined>(1000);
    const prevPropsRef = useRef<TimeLayerSliderPanelProps>();

    const wrapTimeSlider = useCallback(() => {
      const wmsTimeLayers: TimeLayerAwareConfig[] = [];
      timeAwareLayers.forEach(l => {
        if (l.get('type') === 'WMSTime') {
          wmsTimeLayers.push({ layer: l });
        }
      });
      wmsTimeLayersRef.current = wmsTimeLayers;
    }, [timeAwareLayers]);

    const autoPlay = useCallback(() => {
      setAutoPlayActive(prevState => !prevState);
    }, []);

    const onTimeChanged = useCallback(
      (val: string | [string, string]) => {
        const newTime = moment(val);
        setCurrentValue(newTime);
        if (onChange) {
          onChange(newTime);
        }
        debouncedWmsTimeHandlerRef.current(val);
      },
      [onChange]
    );

    const updateDataRange = useCallback(([start, end]: [Moment, Moment]) => {
      setStartDate(start);
      setEndDate(end);
    }, []);

    const setSliderToMostRecent = useCallback(() => {
      setCurrentValue(initEndDate);
      setEndDate(initEndDate);
      wmsTimeHandler(initEndDate);
    }, [initEndDate]);

    const onPlaybackSpeedChange = useCallback(
      (val: number | PlaybackSpeedType) => {
        setPlaybackSpeed(val);
      },
      []
    );

    const wmsTimeHandler = (val: moment.Moment | string | [string, string]) => {
      wmsTimeLayersRef.current.forEach(config => {
        if (config.layer && config.layer.get('type') === 'WMSTime') {
          const params = config.layer.getSource()?.getParams();
          let time;
          if (Array.isArray(val)) {
            time = val[0];
          } else {
            time = val;
          }
          if (!moment.isMoment(time)) {
            time = moment(time);
          }
          const timeFormat = config.layer.get('timeFormat');
          if (
            timeFormat.toLowerCase().indexOf('hh') > 0 &&
            config.layer.get('roundToFullHours')
          ) {
            time.set('minute', 0);
            time.set('second', 0);
            params.TIME = time.toISOString();
          } else {
            params.TIME = time.format(timeFormat);
          }
          config.layer.getSource()?.updateParams(params);
        }
      });
    };

    const debouncedWmsTimeHandlerRef = useRef(
      debounce(val => wmsTimeHandler(val), 300)
    );

    useEffect(() => {
      const handler = debouncedWmsTimeHandlerRef.current;

      return () => {
        handler.cancel();
      };
    }, []);

    const timeSliderCustomHandler = useCallback(
      (val: any) => {
        const currentMoment = moment(val).milliseconds(0);
        if (!currentMoment.isSame(currentValue)) {
          const newValue = currentMoment.clone();
          if (onChange) {
            onChange(newValue);
          }
        }
      },
      [currentValue, onChange]
    );

    const findRangeForLayers = useCallback(() => {
      if (timeAwareLayers.length === 0) {
        return;
      }

      const startDatesFromLayers: moment.Moment[] = [];
      const endDatesFromLayers: moment.Moment[] = [];

      timeAwareLayers.forEach(l => {
        const layerType = l.get('type');
        if (layerType === 'WMSTime') {
          const layerStartDate = l.get('startDate');
          const layerEndDate = l.get('endDate');
          let sdm;
          let edm;
          if (layerStartDate) {
            sdm = moment(layerStartDate);
          }
          if (layerEndDate) {
            edm = moment(layerEndDate);
          }
          if (sdm) {
            startDatesFromLayers.push(sdm);
          }
          if (edm) {
            endDatesFromLayers.push(edm);
          }
        }
      });

      const newStartDate =
        startDatesFromLayers.length > 0
          ? moment.min(startDatesFromLayers)
          : startDate;
      const newEndDate =
        endDatesFromLayers.length > 0
          ? moment.max(endDatesFromLayers)
          : endDate;

      updateDataRange([newStartDate, newEndDate]);
    }, [timeAwareLayers, startDate, endDate, updateDataRange]);

    useEffect(() => {
      window.clearInterval(intervalRef.current);
      if (!autoPlayActive) {
        return;
      }

      intervalRef.current = window.setInterval(() => {
        if (currentValue >= endDate) {
          clearInterval(intervalRef.current);
          setAutoPlayActive(false);
          return;
        }
        const newValue: Moment = currentValue.clone();

        if (_isFinite(playbackSpeed)) {
          wmsTimeHandler(
            moment(newValue.clone().add(playbackSpeed, 'seconds').format())
          );
          setCurrentValue(
            moment(newValue.clone().add(playbackSpeed, 'seconds').format())
          );
        } else {
          const time = moment(
            newValue
              .clone()
              .add(1, playbackSpeed as moment.unitOfTime.DurationConstructor)
              .format()
          );
          wmsTimeHandler(time);
          setCurrentValue(time);
        }
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [autoPlayActive, currentValue, endDate, playbackSpeed]);

    useEffect(() => {
      wrapTimeSlider();
      return () => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
      };
    }, [wrapTimeSlider]);

    useEffect(() => {
      if (autoPlayActive) {
        autoPlay();
      }
      return () => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
      };
    }, [autoPlayActive, autoPlay]);

    useEffect(() => {
      setStartDate(initStartDate);
      setEndDate(initEndDate);
    }, [initStartDate, initEndDate]);

    useEffect(() => {
      const prevProps = prevPropsRef.current;
      if (prevProps && prevProps.timeAwareLayers) {
        prevProps.timeAwareLayers.forEach((pl, i) => {
          if (timeAwareLayers) {
            const tpl = timeAwareLayers[i];
            if (!_isEqual(getUid(pl), getUid(tpl))) {
              wrapTimeSlider();
              findRangeForLayers();
            }
          }
        });
      }

      prevPropsRef.current = { timeAwareLayers };
    }, [timeAwareLayers, findRangeForLayers, wrapTimeSlider]);

    useEffect(() => {
      timeSliderCustomHandler(value);
    }, [timeSliderCustomHandler, value]);

    useEffect(() => {
      setSliderToMostRecent();
    }, [setSliderToMostRecent]);

    useEffect(() => {
      if (autoPlayActive) {
        autoPlay();
      }
    }, [playbackSpeed, autoPlayActive, autoPlay]);

    const resetVisible = true;

    const startDateString = startDate.toISOString();
    const endDateString = endDate.toISOString();
    const valueString = currentValue.toISOString();
    const mid = startDate!.clone().add(endDate!.diff(startDate) / 2);
    const marks: { [k: string]: any } = {};
    const futureClass = moment().isBefore(value) ? ' timeslider-in-future' : '';
    const extraCls = className ? className : '';
    const disabledCls = timeAwareLayers.length < 1 ? 'no-layers-available' : '';

    marks[startDateString] = {
      label: startDate!.format(dateFormat)
    };
    marks[endDateString] = {
      label: endDate!.format(dateFormat),
      style: {
        left: 'unset',
        right: 0,
        transform: 'translate(50%)'
      }
    };
    marks[mid.toISOString()] = {
      label: mid.format(dateFormat)
    };

    const speedOptions = autoPlaySpeedOptions.map(function (val: number) {
      return (
        <Option
          key={val}
          value={val}
        >
          {val}
        </Option>
      );
    });

    return (
      <div className={`time-layer-slider ${disabledCls}`.trim()}>
        <Popover
          placement="topRight"
          title={tooltips.dataRange}
          trigger="click"
          content={
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              defaultValue={[
                dayjs(startDate.toISOString()),
                dayjs(endDate.toISOString())
              ]}
              onOk={range => {
                if (!range) {
                  return;
                }
                const [start, end] = range;
                if (!start || !end) {
                  return;
                }

                updateDataRange([
                  moment(start.toISOString()),
                  moment(end.toISOString())
                ]);
              }}
            />
          }
        >
          <SimpleButton
            className="change-datarange-button"
            icon={<FontAwesomeIcon icon={faCalendar} />}
          />
        </Popover>
        {resetVisible ? (
          <SimpleButton
            type="primary"
            icon={<FontAwesomeIcon icon={faSync} />}
            onClick={setSliderToMostRecent}
            tooltip={tooltips.setToMostRecent}
          />
        ) : null}
        <TimeSlider
          className={`${extraCls} timeslider ${futureClass}`.trim()}
          formatString={dateFormat}
          defaultValue={startDateString}
          min={startDateString}
          max={endDateString}
          value={valueString}
          marks={marks}
          onChange={onTimeChanged}
        />
        <div className="time-value">
          {currentValue.format(dateFormat || 'DD.MM.YYYY HH:mm:ss')}
        </div>
        <ToggleButton
          type="primary"
          icon={<FontAwesomeIcon icon={faPlayCircle} />}
          className={extraCls + ' playback'}
          pressed={autoPlayActive}
          onChange={autoPlay}
          tooltip={autoPlayActive ? 'Pause' : 'Autoplay'}
          aria-label={autoPlayActive ? 'Pause' : 'Autoplay'}
          pressedIcon={<FontAwesomeIcon icon={faPauseCircle} />}
        />
        <Select
          defaultValue={1}
          className={extraCls + ' speed-picker'}
          onChange={onPlaybackSpeedChange}
          popupMatchSelectWidth={false}
          dropdownStyle={{ minWidth: '100px' }}
        >
          {speedOptions}
          <Option value="hours">{tooltips.hours}</Option>
          <Option value="days">{tooltips.days}</Option>
          <Option value="weeks">{tooltips.weeks}</Option>
          <Option value="months">{tooltips.months}</Option>
          <Option value="years">{tooltips.years}</Option>
        </Select>
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (!_isEqual(prevProps.value, nextProps.value)) {
      return false;
    }
    if (!_isEqual(prevProps.timeAwareLayers, nextProps.timeAwareLayers)) {
      return false;
    }
    if (!_isEqual(prevProps.tooltips, nextProps.tooltips)) {
      return false;
    }
    return true;
  }
);

export default TimeLayerSliderPanel;

import './TimeLayerSliderPanel.less';

import {
  faCalendar,
  faPauseCircle,
  faPlayCircle,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WmsLayer } from '@terrestris/ol-util/dist/typeUtils/typeUtils';
import { DatePicker, Popover, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import _isFinite from 'lodash/isFinite';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import moment, { Moment } from 'moment';
import {ImageWMS, TileWMS} from 'ol/source';
import React, {useCallback, useEffect, useState} from 'react';

import SimpleButton from '../../Button/SimpleButton/SimpleButton';
import ToggleButton from '../../Button/ToggleButton/ToggleButton';
import TimeSlider from '../../Slider/TimeSlider/TimeSlider';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

export type TimeLayerSliderPanelTooltips = {
  dataRange: string;
  days: string;
  hours: string;
  months: string;
  setToMostRecent: string;
  weeks: string;
  years: string;
};

export type PlaybackSpeedType = 'hours' | 'days' | 'weeks' | 'months' | 'years';

export type TimeLayerSliderPanelProps = {
  autoPlaySpeedOptions?: number[];
  className?: string;
  dateFormat?: string;
  initEndDate?: moment.Moment;
  initStartDate?: moment.Moment;
  onChange?: (arg: moment.Moment) => void;
  timeAwareLayers: WmsLayer[];
  tooltips?: TimeLayerSliderPanelTooltips;
  value?: moment.Moment;
};

/**
 * The panel combining all time slider related parts.
 */
export const TimeLayerSliderPanel: React.FC<TimeLayerSliderPanelProps> = ({
  autoPlaySpeedOptions = [0.5, 1, 2, 5, 10, 100, 300],
  className = '',
  dateFormat = 'YYYY-MM-DD HH:mm',
  initEndDate = moment(moment.now()).add(1, 'days'),
  initStartDate = moment(moment.now()),
  onChange = () => {},
  timeAwareLayers = [],
  tooltips = {
    setToMostRecent: 'Set to most recent date',
    hours: 'Hours',
    days: 'Days',
    weeks: 'Weeks',
    months: 'Months',
    years: 'Years',
    dataRange: 'Set data range'
  },
  value = moment(moment.now())
}) => {

  const [playbackSpeed, setPlaybackSpeed] = useState<number | PlaybackSpeedType>(1);
  const [autoPlayActive, setAutoPlayActive] = useState(false);
  const [startDate, setStartDate] = useState<Moment>(initStartDate);
  const [endDate, setEndDate] = useState<Moment>(initEndDate);
  const [loadingCount, setLoadingCount] = useState(0);

  const isLoading = loadingCount > 0;

  const autoPlay = () => setAutoPlayActive(prevState => !prevState);

  const onTimeChanged = (val: string | [string, string]) => {
    const newTime = moment(val);
    if (_isFunction(onChange)) {
      onChange(newTime);
    }
  };

  const updateDataRange = ([start, end]: [Moment, Moment]) => {
    setStartDate(start);
    setEndDate(end);
  };

  const setSliderToMostRecent = () => {
    setEndDate(initEndDate);
    wmsTimeHandler(initEndDate);
    onChange(initEndDate);
  };

  const onPlaybackSpeedChange= (val: number | PlaybackSpeedType) => setPlaybackSpeed(val);

  const wmsTimeHandler = useCallback((val: moment.Moment | string | [string, string]) => {
    timeAwareLayers.forEach(layer => {
      if (!_isNil(layer) && layer.get('type') === 'WMSTime') {
        const source = layer.getSource();
        const params = source?.getParams();
        let time;
        if (Array.isArray(val)) {
          time = val[0];
        } else {
          time = val;
        }
        if (!moment.isMoment(time)) {
          time = moment(time);
        }
        const timeFormat = layer.get('timeFormat');
        let newTimeParam: string;
        if (
          timeFormat.toLowerCase().includes('hh') &&
            layer.get('roundToFullHours')
        ) {
          time.set('minute', 0);
          time.set('second', 0);
          newTimeParam = time.toISOString();
        } else {
          newTimeParam = time.format(timeFormat);
        }

        if (params.TIME !== newTimeParam) {
          params.TIME = newTimeParam;
          source?.updateParams(params);
          source?.refresh();
        }
      }
    });
  }, [timeAwareLayers]);

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
  }, [endDate, startDate, timeAwareLayers]);

  useEffect(() => {
    if (timeAwareLayers.length === 0) {
      return;
    }

    const handleTileLoadStart = () => {
      setLoadingCount(prevCount => prevCount + 1);
    };
    const handleTileLoadEnd = () => {
      setLoadingCount(prevCount => Math.max(prevCount - 1, 0));
    };
    const handleImageLoadStart = () => {
      setLoadingCount(prevCount => prevCount + 1);
    };
    const handleImageLoadEnd = () => {
      setLoadingCount(prevCount => Math.max(prevCount - 1, 0));
    };

    timeAwareLayers.forEach(layer => {
      if (layer.get('type') === 'WMSTime') {
        const source = layer.getSource();

        if (source instanceof TileWMS) {
          source.on('tileloadstart', handleTileLoadStart);
          source.on('tileloadend', handleTileLoadEnd);
          source.on('tileloaderror', handleTileLoadEnd);
        } else if (source instanceof ImageWMS) {
          source.on('imageloadstart', handleImageLoadStart);
          source.on('imageloadend', handleImageLoadEnd);
          source.on('imageloaderror', handleImageLoadEnd);
        }
      }
    });

    return () => {
      timeAwareLayers.forEach(layer => {
        if (layer.get('type') === 'WMSTime') {
          const source = layer.getSource();

          if (source instanceof TileWMS) {
            source.un('tileloadstart', handleTileLoadStart);
            source.un('tileloadend', handleTileLoadEnd);
            source.un('tileloaderror', handleTileLoadEnd);
          } else if (source instanceof ImageWMS) {
            source.un('imageloadstart', handleImageLoadStart);
            source.un('imageloadend', handleImageLoadEnd);
            source.un('imageloaderror', handleImageLoadEnd);
          }
        }
      });
    };
  }, [timeAwareLayers]);

  useEffect(() => {
    if (!autoPlayActive) {
      return;
    }

    const interval = window.setInterval(() => {
      if (value >= endDate) {
        clearInterval(interval);
        setAutoPlayActive(false);
        return;
      }
      const newValue: Moment = value.clone();

      if (_isFinite(playbackSpeed)) {
        wmsTimeHandler(
          moment(newValue.clone().add(playbackSpeed, 'hours').format())
        );
        onChange(
          moment(newValue.clone().add(playbackSpeed, 'hours').format())
        );
      } else {
        const time = moment(
          newValue
            .clone()
            .add(1, playbackSpeed as moment.unitOfTime.DurationConstructor)
            .format()
        );
        wmsTimeHandler(time);
        onChange(time);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoPlayActive, value, endDate, playbackSpeed, wmsTimeHandler, onChange]);

  useEffect(() => {
    setStartDate(initStartDate);
    setEndDate(initEndDate);
  }, [initStartDate, initEndDate]);

  useEffect(() => {
    if (!_isNil(timeAwareLayers)) {
      findRangeForLayers();
    }
  }, [timeAwareLayers, findRangeForLayers]);

  const resetVisible = true;

  const startDateString = startDate.toISOString();
  const endDateString = endDate.toISOString();
  const valueString = value?.toISOString();
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
      <div className="time-slider-container">
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
        <div className="spin-indicator">
          <Spin spinning={isLoading} size="small" />
        </div>
      </div>
      <div className="time-value">
        {value.format(dateFormat || 'DD.MM.YYYY HH:mm:ss')}
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
        defaultValue={'hours'}
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
};

export default TimeLayerSliderPanel;

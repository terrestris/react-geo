import './TimeLayerSliderPanel.less';

import {
  faCalendar,
  faPauseCircle,
  faPlayCircle,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logger from '@terrestris/base-util/dist/Logger';
import { WmsLayer } from '@terrestris/ol-util/dist/typeUtils/typeUtils';
import { DatePicker, Popover, Select, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import minmax from 'dayjs/plugin/minMax';
import _isFinite from 'lodash/isFinite';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import {ImageWMS, TileWMS} from 'ol/source';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import SimpleButton from '../../Button/SimpleButton/SimpleButton';
import ToggleButton from '../../Button/ToggleButton/ToggleButton';
import TimeSlider, {TimeSliderMark, TimeSliderProps} from '../../Slider/TimeSlider/TimeSlider';

dayjs.extend(minmax);

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

export type TimeLayerSliderPanelTooltips = {
  dataRange: string;
  days: string;
  hours: string;
  minutes: string;
  months: string;
  setToMostRecent: string;
  weeks: string;
  years: string;
};

export type PlaybackSpeedUnit = 'minute' | 'hours' | 'days' | 'weeks' | 'months' | 'years';

export type TimeLayerSliderPanelProps = {
  autoPlaySpeedOptions?: number[];
  timeAwareLayers: WmsLayer[];
  tooltips?: TimeLayerSliderPanelTooltips;
} & TimeSliderProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * The panel combining all time slider related parts.
 */
export const TimeLayerSliderPanel: React.FC<TimeLayerSliderPanelProps> = ({
  autoPlaySpeedOptions = [0.5, 1, 2, 5, 10, 100, 300],
  className,
  formatString = 'YYYY-MM-DD HH:mm',
  max = dayjs(),
  min = dayjs().add(1, 'days'),
  onChange,
  onChangeComplete,
  timeAwareLayers = [],
  tooltips = {
    setToMostRecent: 'Set to most recent date',
    minutes: 'Minutes',
    hours: 'Hours',
    days: 'Days',
    weeks: 'Weeks',
    months: 'Months',
    years: 'Years',
    dataRange: 'Set data range'
  },
  value = dayjs()
}) => {

  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [playbackSpeedUnit, setPlaybackSpeedUnit] = useState<PlaybackSpeedUnit>('hours');
  const [autoPlayActive, setAutoPlayActive] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs>(min);
  const [endDate, setEndDate] = useState<Dayjs>(max);
  const [loadingCount, setLoadingCount] = useState(0);

  const isLoading = loadingCount > 0;

  const autoPlay = () => setAutoPlayActive(prevState => !prevState);

  const onTimeChanged = useCallback((val: Dayjs | [Dayjs, Dayjs]) => {
    if (_isFunction(onChange)) {
      onChange(val);
    }
    if (_isFunction(onChangeComplete)) {
      onChangeComplete(val);
    }
  }, [onChange, onChangeComplete]);

  const updateDataRange = ([start, end]: [Dayjs, Dayjs]) => {
    setStartDate(start);
    setEndDate(end);
  };

  const setSliderToMostRecent = () => {
    setEndDate(max);
    wmsTimeHandler(max);
    onTimeChanged(max);
  };

  const onPlaybackSpeedChange= (val: number) => setPlaybackSpeed(val);

  const wmsTimeHandler = useCallback((val: Dayjs | [Dayjs, Dayjs]) => {
    timeAwareLayers.forEach(layer => {
      if (!_isNil(layer) && layer.get('type') === 'WMSTime') {
        const source = layer.getSource();
        const params = source?.getParams();
        let time: Dayjs;
        if (Array.isArray(val)) {
          time = val[0];
        } else {
          time = val;
        }

        if (!time.isValid()) {
          logger.warn(`Invalid time value: ${time}`);
          return;
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

    const startDatesFromLayers: Dayjs[] = [];
    const endDatesFromLayers: Dayjs[] = [];

    timeAwareLayers.forEach(l => {
      const layerType = l.get('type');
      if (layerType === 'WMSTime') {
        const layerStartDate = l.get('startDate');
        const layerEndDate = l.get('endDate');
        let sdm;
        let edm;
        if (layerStartDate) {
          sdm = dayjs(layerStartDate);
        }
        if (layerEndDate) {
          edm = dayjs(layerEndDate);
        }
        if (sdm) {
          startDatesFromLayers.push(sdm);
        }
        if (edm) {
          endDatesFromLayers.push(edm);
        }
      }
    });

    const newStartDate = startDatesFromLayers.length > 0 ? dayjs.min(startDatesFromLayers): startDate;
    const newEndDate = endDatesFromLayers.length > 0 ? dayjs.max(endDatesFromLayers) : endDate;
    if (!_isNil(newStartDate) && !_isNil(newEndDate)) {
      updateDataRange([newStartDate, newEndDate]);
    }
  }, [endDate, startDate, timeAwareLayers]);

  const onPlaybackUnitChange = (unit: PlaybackSpeedUnit) => setPlaybackSpeedUnit(unit);

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
    if (!autoPlayActive || Array.isArray(value)) {
      return;
    }

    const interval = window.setInterval(() => {
      if (value >= endDate) {
        clearInterval(interval);
        setAutoPlayActive(false);
        return;
      }
      const newValue = value.clone();

      if (_isFinite(playbackSpeed)) {
        wmsTimeHandler(newValue.clone().add(playbackSpeed, playbackSpeedUnit));
        onTimeChanged(newValue.clone().add(playbackSpeed, playbackSpeedUnit));
      } else {
        const time = dayjs(
          newValue
            .clone()
            .add(1, playbackSpeedUnit)
            .format()
        );
        wmsTimeHandler(time);
        onTimeChanged(time);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoPlayActive, value, endDate, playbackSpeed, wmsTimeHandler, onChange, playbackSpeedUnit, onTimeChanged]);

  useEffect(() => {
    setStartDate(min);
    setEndDate(max);
  }, [min, max]);

  useEffect(() => {
    if (!_isNil(timeAwareLayers)) {
      findRangeForLayers();
    }
  }, [timeAwareLayers, findRangeForLayers]);

  const futureClass = useMemo(() => {
    if (Array.isArray(value)) {
      return '';
    }
    return dayjs().isBefore(value) ? ' timeslider-in-future' : '';
  }, [value]);
  const extraCls = className ?? '';
  const disabledCls = useMemo(() => {
    return timeAwareLayers.length < 1 ? 'no-layers-available' : '';
  }, [timeAwareLayers]);

  const marks: TimeSliderMark[] = useMemo(() => {
    if (_isNil(startDate) || _isNil(endDate)) {
      return [];
    }
    const mid = startDate!.clone().add(endDate!.diff(startDate) / 2);
    return [{
      timestamp: startDate,
      markConfig: {
        label: startDate.format(formatString)
      }
    }, {
      timestamp: mid,
      markConfig: {
        label: mid.format(formatString)
      }
    },{
      timestamp: endDate,
      markConfig: {
        label: endDate.format(formatString),
        style: {
          left: 'unset',
          right: 0,
          transform: 'translate(50%)'
        }
      }
    }] satisfies TimeSliderMark[];
  }, [endDate, formatString, startDate]);

  const speedOptions = useMemo(() => autoPlaySpeedOptions.map(function (val: number) {
    return (
      <Option
        key={val}
        value={val}
      >
        {val}
      </Option>
    );
  }), [autoPlaySpeedOptions]);

  return (
    <div className={`time-layer-slider ${disabledCls}`.trim()}>
      <Popover
        placement="topRight"
        title={tooltips.dataRange}
        trigger="click"
        content={
          <RangePicker
            defaultValue={[startDate, endDate]}
            onOk={range => {
              if (!range) {
                return;
              }
              const [start, end] = range;
              if (!start || !end) {
                return;
              }

              updateDataRange([start, end]);
            }}
            showTime={{ format: 'HH:mm' }}
          />
        }
      >
        <SimpleButton
          className="change-datarange-button"
          icon={<FontAwesomeIcon icon={faCalendar} />}
        />
      </Popover>
      <SimpleButton
        icon={<FontAwesomeIcon icon={faSync} />}
        onClick={setSliderToMostRecent}
        tooltip={tooltips.setToMostRecent}
        type="primary"
      />
      <div className="time-slider-container">
        <TimeSlider
          className={`${extraCls} timeslider ${futureClass}`.trim()}
          defaultValue={startDate}
          formatString={formatString}
          marks={marks}
          max={endDate}
          min={startDate}
          onChangeComplete={onTimeChanged}
          value={value}
        />
        <div className="spin-indicator">
          <Spin spinning={isLoading} size="small" />
        </div>
      </div>
      {
        !Array.isArray(value) && (
          <div className="time-value">
            {value.format(formatString || 'DD.MM.YYYY HH:mm:ss')}
          </div>
        )
      }
      <ToggleButton
        aria-label={autoPlayActive ? 'Pause' : 'Autoplay'}
        className={extraCls + ' playback'}
        icon={<FontAwesomeIcon icon={faPlayCircle} />}
        onChange={autoPlay}
        pressed={autoPlayActive}
        pressedIcon={<FontAwesomeIcon icon={faPauseCircle} />}
        tooltip={autoPlayActive ? 'Pause' : 'Autoplay'}
        type="primary"
      />
      <Select<number>
        className={extraCls + ' speed-picker'}
        defaultValue={1}
        dropdownStyle={{ minWidth: '100px' }}
        onChange={onPlaybackSpeedChange}
        popupMatchSelectWidth={false}
        value={playbackSpeed}
      >
        {speedOptions}
      </Select>
      <span>x</span>
      <Select<PlaybackSpeedUnit>
        className={extraCls + ' speed-picker'}
        defaultValue={'minute'}
        dropdownStyle={{ minWidth: '100px' }}
        onChange={onPlaybackUnitChange}
        popupMatchSelectWidth={false}
        value={playbackSpeedUnit}
      >
        <Option value="minutes">{tooltips.minutes}</Option>
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

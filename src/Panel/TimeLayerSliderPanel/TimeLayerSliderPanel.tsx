import {
  DatePicker,
  Popover,
  Select} from 'antd';
import dayjs from 'dayjs';
import _isEqual from 'lodash/isEqual';
import _isFinite from 'lodash/isFinite';
import moment from 'moment';
import { getUid } from 'ol';
import OlLayer from 'ol/layer/Layer';
import OlMap from 'ol/Map';
import OlImageWMS from 'ol/source/ImageWMS';
import OlTileWMS from 'ol/source/TileWMS';
import * as React from 'react';
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

import './TimeLayerSliderPanel.less';

import { faCalendar, faPauseCircle, faPlayCircle, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  TimeLayerAwareConfig
} from '@terrestris/react-util/dist/Hooks/useTimeLayerAware/useTimeLayerAware';

import SimpleButton from '../../Button/SimpleButton/SimpleButton';
import ToggleButton from '../../Button/ToggleButton/ToggleButton';
import TimeSlider from '../../Slider/TimeSlider/TimeSlider';

export interface Tooltips {
  hours: string;
  days: string;
  weeks: string;
  months: string;
  years: string;
  setToNow: string;
  dataRange: string;
}

export type PlaybackSpeedType = 'hours' | 'days' | 'weeks' | 'months' | 'years';

export interface TimeLayerSliderPanelProps {
  className: string;
  onChange: (arg: moment.Moment) => void;
  timeAwareLayers: OlLayer<OlImageWMS|OlTileWMS, any>[];
  value: moment.Moment;
  dateFormat: string;
  tooltips: Tooltips;
  autoPlaySpeedOptions: number[];
  map: OlMap;
  initStartDate: moment.Moment;
  initEndDate: moment.Moment;
}

export interface TimeLayerSliderPanelState {
  value: moment.Moment;
  playbackSpeed: number | PlaybackSpeedType;
  autoPlayActive: boolean;
  startDate: moment.Moment;
  endDate: moment.Moment;
}

/**
 * The panel combining all time slider related parts.
 */
export class TimeLayerSliderPanel extends React.Component<TimeLayerSliderPanelProps, TimeLayerSliderPanelState> {

  /**
   * The default props of LayerSetBaseMapChooser
   *
   * @static
   * @memberof TimeLayerSliderPanel
   */
  public static defaultProps = {
    className: '',
    onChange: () => {},
    timeAwareLayers: [],
    value: moment(moment.now()),
    dateFormat: 'YYYY-MM-DD',
    tooltips: {
      setToNow: 'Set to now',
      hours: 'Hours',
      days: 'Days',
      weeks: 'Weeks',
      months: 'Months',
      years: 'Years',
      dataRange: 'Set data range'
    },
    autoPlaySpeedOptions: [ 0.5, 1, 2, 5, 10, 100, 300 ]
  };

  private _wmsTimeLayers: TimeLayerAwareConfig[] = [];
  private _interval: number;

  /**
   * Constructs time panel.
   */
  constructor(props: TimeLayerSliderPanelProps) {
    super(props);

    this.state = {
      value: moment().milliseconds(0),
      playbackSpeed: 1,
      autoPlayActive: false,
      startDate: moment().milliseconds(0),
      endDate: moment().milliseconds(0),
    };
    this._interval = 1000;

    this.wrapTimeSlider();

    // binds
    this.onTimeChanged = this.onTimeChanged.bind(this);
    this.autoPlay = this.autoPlay.bind(this);
    this.updateDataRange = this.updateDataRange.bind(this);
  }

  componentDidMount() {
    const {
      initStartDate,
      initEndDate
    } = this.props;

    this.setState({
      startDate: initStartDate,
      endDate: initEndDate
    });
  }

  componentDidUpdate(prevProps: TimeLayerSliderPanelProps) {
    prevProps.timeAwareLayers.forEach((pl, i: number) => {
      const tpl = this.props.timeAwareLayers[i];
      if (!(_isEqual(getUid(pl), getUid(tpl)))) {
        // update slider properties if layers were updated
        this.wrapTimeSlider();
        this.findRangeForLayers();
      }
    });
  }

  /**
   *
   * @param nextProps
   * @param nextState
   */
  shouldComponentUpdate(nextProps: TimeLayerSliderPanelProps, nextState: TimeLayerSliderPanelState) {
    const {
      value,
      autoPlayActive,
      startDate,
      endDate,
    } = this.state;
    const {
      timeAwareLayers,
      tooltips
    } = this.props;

    if (nextState.value !== value) {
      return true;
    }
    if (nextState.autoPlayActive !== autoPlayActive) {
      return true;
    }
    if (nextState.startDate !== startDate) {
      return true;
    }
    if (nextState.endDate !== endDate) {
      return true;
    }
    if (!(_isEqual(nextProps.timeAwareLayers, timeAwareLayers))) {
      return true;
    }

    return !(_isEqual(nextProps.tooltips, tooltips));
  }

  /**
   * Wraps the TimeSlider component in timeLayerAware.
   */
  wrapTimeSlider = () => {
    this._wmsTimeLayers = [];
    this.props.timeAwareLayers!.forEach((l: any) => {
      if (l.get('type') === 'WMSTime') {
        this._wmsTimeLayers.push({
          layer: l
        });
      }
    });

    // make sure an initial value is set
    this.wmsTimeHandler(this.state.value);
  };

  /**
   * Updates slider time range depending on chosen layer set.
   */
  findRangeForLayers = () => {
    const {
      timeAwareLayers
    } = this.props;
    const {
      startDate,
      endDate,
    } = this.state;

    if (timeAwareLayers.length === 0) {
      return;
    }

    const startDatesFromLayers: moment.Moment[] = [];
    const endDatesFromLayers: moment.Moment[] = [];

    this._wmsTimeLayers.forEach((l: any) => {
      const layerStartDate = l.layer.get('startDate');
      const layerEndDate = l.layer.get('endDate');
      let sdm;
      let edm;
      if (layerStartDate) {
        sdm = moment(l.layer.get('startDate'));
      }
      if (layerEndDate) {
        edm = moment(l.layer.get('endDate'));
      }
      if (sdm) {
        startDatesFromLayers.push(sdm);
      }
      if (edm) {
        endDatesFromLayers.push(edm);
      }
    });

    const newStartDate = startDatesFromLayers.length > 0 ? moment.min(startDatesFromLayers) : startDate;
    const newEndDate = endDatesFromLayers.length > 0 ? moment.max(endDatesFromLayers) : endDate;

    this.updateDataRange([newStartDate, newEndDate]);
  };

  /**
   * Handler for the time slider change behaviour
   */
  timeSliderCustomHandler = (value: any) => {
    const currentMoment = moment(value).milliseconds(0);
    const newValue = currentMoment.clone();
    this.setState({
      value: newValue
    });
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  };

  /**
   * makes sure that the appended time parameter in GetMap calls
   * is rounded to full hours to receive a valid response
   */
  wmsTimeHandler = (value?: any) => {
    this._wmsTimeLayers.forEach(config => {
      if (config.layer && config.layer.get('type') === 'WMSTime') {
        const params = config.layer.getSource()?.getParams();
        let time;
        if (Array.isArray(value)) {
          time = value[0];
        } else {
          time = value;
        }
        if (!moment.isMoment(time)) {
          time = moment(time);
        }
        const timeFormat = config.layer.get('timeFormat');
        if (timeFormat.toLowerCase().indexOf('hh') > 0 && config.layer.get('roundToFullHours')) {
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

  /**
   * start or stop auto playback
   * TODO: we should do the request for new features less aggresive,
   * e.g. a precache would be helpful
   */
  autoPlay() {
    this.setState({
      autoPlayActive: !this.state.autoPlayActive
    }, () => {
      window.clearInterval(this._interval);

      if (!this.state.autoPlayActive) {
        return;
      }

      this._interval = window.setInterval(() => {
        const {
          endDate
        } = this.state;
        const {
          value,
          playbackSpeed
        } = this.state;
        if (value >= endDate!) {
          window.clearInterval(this._interval);
          this.setState({
            autoPlayActive: false
          });
          return;
        }

        let newValue;
        if (_isFinite(playbackSpeed)) {
          newValue = value.clone().add(playbackSpeed, 'seconds');
        } else {
          newValue = value.clone().add(1, playbackSpeed as moment.DurationInputArg2);
        }
        this.timeSliderCustomHandler(newValue);
        this.wmsTimeHandler(newValue);
      }, 1000, this);
    });
  }

  /**
   * handle playback speed change
   */
  onPlaybackSpeedChange = (val: number | PlaybackSpeedType) => {
    this.setState({
      playbackSpeed: val
    }, () => {
      if (this.state.autoPlayActive) {
        this.autoPlay();
      }
    });
  };

  /**
   * Sets the slider to the current time of the user
   */
  setSliderToNow = () => {
    const now = moment().milliseconds(0);
    this.setState({
      value: now,
      endDate: now
    }, () => {
      this.timeSliderCustomHandler(now);
      this.wmsTimeHandler(now);
    });
  };

  /**
   *
   */
  updateDataRange([startDate, endDate]: [moment.Moment, moment.Moment]) {
    this.setState({
      startDate,
      endDate
    });
  }

  /**
   *
   * @param val
   */
  onTimeChanged(val: string | [string, string]) {
    this.setState({
      value: moment(val)
    }, () => {
      this.wmsTimeHandler(this.state.value);
    });
  }

  /**
   *
   *
   * @memberof TimeLayerSliderPanel
   */
  render = () => {
    const {
      className,
      timeAwareLayers,
      dateFormat,
      tooltips,
      autoPlaySpeedOptions
    } = this.props;
    const {
      autoPlayActive,
      value,
      startDate,
      endDate
    } = this.state;

    const resetVisible = true;

    const startDateString = startDate.toISOString();
    const endDateString = endDate.toISOString();
    const valueString = value.toISOString();
    const mid = startDate!.clone().add(endDate!.diff(startDate) / 2);
    const marks: {[k: string]: any} = {};
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

    const speedOptions = autoPlaySpeedOptions.map(function(val: number) {
      return <Option key={val} value={val}>{val}</Option>;
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
              defaultValue={[dayjs(startDate.toISOString()), dayjs(endDate.toISOString())]}
              onOk={range => {
                if (!range) {
                  return;
                }
                const [start, end] = range;
                if (!start || !end) {
                  return;
                }

                this.updateDataRange([moment(start.toISOString()), moment(end.toISOString())]);
              }}
            />
          }
        >
          <SimpleButton
            className="change-datarange-button"
            icon={
              <FontAwesomeIcon
                icon={faCalendar}
              />
            }
          />
        </Popover>
        {
          resetVisible ?
            <SimpleButton
              type="primary"
              icon={
                <FontAwesomeIcon
                  icon={faSync}
                />
              }
              onClick={this.setSliderToNow}
              tooltip={tooltips.setToNow}
            /> : null
        }
        <TimeSlider
          className={`${extraCls} timeslider ${futureClass}`.trim()}
          formatString={dateFormat}
          defaultValue={startDateString}
          min={startDateString}
          max={endDateString}
          value={valueString}
          marks={marks}
          onChange={this.onTimeChanged}
        />
        <div className="time-value">
          {value.format('DD.MM.YYYY HH:mm:ss')}
        </div>
        <ToggleButton
          type="primary"
          icon={
            <FontAwesomeIcon
              icon={faPlayCircle}
            />
          }
          className={extraCls + ' playback'}
          pressed={autoPlayActive}
          onChange={this.autoPlay}
          tooltip={autoPlayActive ? 'Pause' : 'Autoplay'}
          aria-label={autoPlayActive ? 'Pause' : 'Autoplay'}
          pressedIcon={
            <FontAwesomeIcon
              icon={faPauseCircle}
            />
          }
        />
        <Select
          defaultValue={1}
          className={extraCls + ' speed-picker'}
          onChange={this.onPlaybackSpeedChange}
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
}

export default TimeLayerSliderPanel;

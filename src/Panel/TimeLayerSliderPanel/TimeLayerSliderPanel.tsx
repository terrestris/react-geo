import * as React from 'react';

import moment from 'moment';
import OlLayer from 'ol/layer/Layer';
import OlMap from 'ol/Map';

const _isFinite = require('lodash/isFinite');
const _isEqual = require('lodash/isEqual');

import {
  TimeSlider,
  timeLayerAware,
  ToggleButton,
  SimpleButton
} from '../../index';

import {
  Select,
  DatePicker,
  Popover
} from 'antd';
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

import './TimeLayerSliderPanel.less';

type timeRange = [moment.Moment, moment.Moment];

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

export interface DefaultTimeLayerSliderPanelProps {
  className: string;
  onChange: (arg: moment.Moment) => void;
  timeAwareLayers: OlLayer[];
  value: moment.Moment;
  dateFormat: string;
  tooltips: Tooltips;
  autoPlaySpeedOptions: number[];
}

export interface TimeLayerSliderPanelProps extends Partial<DefaultTimeLayerSliderPanelProps> {
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

  private _TimeLayerAwareSlider: any;
  private _wmsTimeLayers: any[];
  private _interval: number;

  /**
   * The default props of LayerSetBaseMapChooser
   *
   * @static
   * @memberof LayerSetBaseMapChooser
   */
  public static defaultProps: DefaultTimeLayerSliderPanelProps = {
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
    prevProps.timeAwareLayers.forEach((pl: any, i: number) => {
      const tpl = this.props.timeAwareLayers[i];
      if (!(_isEqual(pl.ol_uid, tpl.ol_uid))) {
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
    if (!(_isEqual(nextProps.tooltips, tooltips))) {
      return true;
    }
    return false;
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
    this._TimeLayerAwareSlider = timeLayerAware(TimeSlider, this._wmsTimeLayers);
  }

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

    let newStartDate: moment.Moment;
    let newEndDate: moment.Moment;
    let startDatesFromLayers: moment.Moment[] = [];
    let endDatesFromLayers: moment.Moment[] = [];

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
    newStartDate = startDatesFromLayers.length > 0 ? moment.min(startDatesFromLayers) : startDate;
    newEndDate = endDatesFromLayers.length > 0 ? moment.max(endDatesFromLayers) : endDate;
    this.updateDataRange([newStartDate, newEndDate]);
  }

  /**
   * Handler for the time slider change behaviour
   */
  timeSliderCustomHandler = (value: object) => {
    const currentMoment = moment(value).milliseconds(0);
    const newValue = currentMoment.clone();
    this.setState({
      value: newValue
    });
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  }

  /**
   * makes sure that the appended time parameter in GetMap calls
   * is rounded to full hours to receive a valid response
   */
  wmsTimeHandler = (value?: any) => {
    this._wmsTimeLayers.forEach(config => {
      if (config.layer && config.layer.get('type') === 'WMSTime') {
        const params = config.layer.getSource().getParams();
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
        config.layer.getSource().updateParams(params);
      }
    });
  }

  /**
   * start or stop auto playback
   * TODO: we should do the request for new features less aggresive,
   * e.g. a precache would be helpful
   */
  autoPlay(pressed: boolean) {
    if (pressed) {
      window.clearInterval(this._interval);
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
        // value is handled in timeSliderCustomHandler
        this.setState({
          autoPlayActive: true
        });
      }, 1000, this);
    } else {
      window.clearInterval(this._interval);
      this.setState({
        autoPlayActive: false
      });
    }
  }

  /**
   * handle playback speed change
   */
  onPlaybackSpeedChange = (val: string) => {
    let valueToSet;
    if (_isFinite(parseFloat(val))) {
      valueToSet = parseFloat(val);
    } else {
      valueToSet = val;
    }
    this.setState({
      playbackSpeed: valueToSet
    }, () => {
      if (this.state.autoPlayActive) {
        this.autoPlay(true);
      }
    });
  }

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
  }

  /**
   *
   */
  updateDataRange([startDate, endDate]: timeRange) {
    this.setState({
      startDate,
      endDate
    });
  }

  /**
   *
   * @param val
   */
  onTimeChanged(val: string) {
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

    const startDateString = startDate ? startDate.toISOString() : undefined;
    const endDateString = endDate ? endDate.toISOString() : undefined;
    const valueString = value ? value.toISOString() : undefined;
    const mid = startDate!.clone().add(endDate!.diff(startDate) / 2);
    const marks = {};
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

    const TimeLayerAwareSlider = this._TimeLayerAwareSlider;

    return (
      <div className={`time-layer-slider ${disabledCls}`.trim()}>
        <Popover
          placement="topRight"
          title={tooltips.dataRange}
          trigger="click"
          content={
            <RangePicker
              showTime={{format: 'HH:mm'}}
              defaultValue={[startDate, endDate]}
              onOk={this.updateDataRange}
            />
          }
        >
          <SimpleButton
            className="change-datarange-button"
            icon="calendar-o"
          />
        </Popover>
        {
          resetVisible ?
            <SimpleButton
              type="primary"
              icon="refresh"
              onClick={this.setSliderToNow}
              tooltip={tooltips.setToNow}
            /> : null
        }
        <TimeLayerAwareSlider
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
          icon="play-circle-o"
          className={extraCls + ' playback'}
          pressed={autoPlayActive}
          onToggle={this.autoPlay}
          tooltip={autoPlayActive ? 'Pause' : 'Autoplay'}
          pressedIcon="pause-circle-o"
        />
        <Select
          defaultValue={'1'}
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
  }
}

export default TimeLayerSliderPanel;

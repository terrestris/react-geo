import moment from 'moment';

import TestUtil from '../../Util/TestUtil';
import TimeSlider from './TimeSlider';

describe('<TimeSlider />', () => {
  it('is defined', () => {
    expect(TimeSlider).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(TimeSlider, {});
    expect(wrapper).not.toBeUndefined();
  });

  it('converts time millis properly', () => {
    const slider = TestUtil.mountComponent(TimeSlider, {}).instance() as TimeSlider;
    const time = moment(1500000000000);
    const unix = slider.convert(time);
    expect(unix).toBe(1500000000);
    const interval = slider.convert([time, time]);
    expect(interval).toEqual([1500000000, 1500000000]);
  });

  it('#convertTimestamps', () => {
    const format = 'YYYY-MM-DD hh:mm:ss';
    const min = moment('2000-01-01 12:00:00', format);
    const max = moment('2020-01-01 12:00:00', format);
    const defaultValue = moment('2010-01-01 12:00:00', format);
    const props = {
      min, max, defaultValue
    };
    const expected = {
      min: min.unix(),
      max: max.unix(),
      defaultValue: defaultValue.unix()
    };
    const slider = TestUtil.mountComponent(TimeSlider, props).instance() as TimeSlider;
    const got = slider.convertTimestamps();
    expect(got).toEqual(expected);
  });

  it('#convert', () => {
    const format = 'YYYY-MM-DD hh:mm:ss';
    const val1 = moment('2000-01-01 12:00:00', format);
    const val2 = moment('2001-01-01 12:00:00', format);
    const expected1 = val1.unix();
    const expected2 = [expected1, val2.unix()];

    const slider = TestUtil.mountComponent(TimeSlider, {}).instance() as TimeSlider;
    const got1 = slider.convert(val1);
    const got2 = slider.convert([val1, val2]);

    expect(got1).toEqual(expected1);
    expect(got2).toEqual(expected2);
  });

  describe('convertMarks', () => {
    it('converts the Keys of the marks prop', () => {
      const format = 'YYYY-MM-DD hh:mm:ss';
      const val1 = moment('2000-01-01 12:00:00', format);
      const val2 = moment('2001-01-01 12:00:00', format);
      const marks: any = {};
      marks['2000-01-01 12:00:00'] = val1;
      marks['2001-01-01 12:00:00'] = val2;

      const expected1 = val1.unix();
      const expected2 = val2.unix();

      const slider = TestUtil.mountComponent(TimeSlider, {}).instance() as TimeSlider;
      const gotMarks = slider.convertMarks(marks);
      const gotKeys = Object.keys(gotMarks!);

      expect(gotKeys).toEqual(expect.arrayContaining([expected1.toString(), expected2.toString()]));
      expect(gotMarks![expected1]).toEqual(val1);
      expect(gotMarks![expected2]).toEqual(val2);
    });
  });

  it('#formatTimestamp', () => {
    const format = 'YYYY-MM-DD hh:mm:ss';
    const formatted = '2000-01-01 12:00:00';
    const val = moment(formatted, format).unix();

    const slider = TestUtil.mountComponent(TimeSlider, {formatString: format}).instance() as TimeSlider;

    const got = slider.formatTimestamp(val);
    expect(got).toEqual(formatted);
  });

  it('#valueUpdated', () => {
    const format = 'YYYY-MM-DD hh:mm:ss';
    const val1 = moment('2000-01-01 12:00:00', format);
    const val2 = moment('2001-01-01 12:00:00', format);
    const onChange = jest.fn();
    const expected1 = moment(val1.unix() * 1000).toISOString();
    const expected2 = [expected1, moment(val2.unix() * 1000).toISOString()];

    const slider = TestUtil.mountComponent(TimeSlider, {onChange}).instance() as TimeSlider;

    slider.valueUpdated(val1.unix());
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toEqual(expected1);

    slider.valueUpdated([val1.unix(), val2.unix()]);
    expect(onChange.mock.calls.length).toBe(2);
    expect(onChange.mock.calls[1][0]).toEqual(expected2);
  });

});

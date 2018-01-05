/*eslint-env jest*/

import TestUtil from '../Util/TestUtil';
import moment from 'moment';
import { TimeSlider } from '../index';

describe('<TimeSlider />', () => {
  it('is defined', () => {
    expect(TimeSlider).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(TimeSlider, {});
    expect(wrapper).not.toBeUndefined();
  });

  it('does not fail to convert on undefined', () => {
    const slider = TestUtil.mountComponent(TimeSlider, {}).instance();
    const undef = slider.convert();
    expect(undef).toBeUndefined();
  });

  it('converts time millis properly', () => {
    const slider = TestUtil.mountComponent(TimeSlider, {}).instance();
    const time = moment(1500000000000);
    const unix = slider.convert(time);
    expect(unix).toBe(1500000000);
    const interval = slider.convert([time, time]);
    expect(interval).toEqual([1500000000, 1500000000]);
  });
});

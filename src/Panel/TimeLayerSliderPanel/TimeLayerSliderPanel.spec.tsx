import TestUtil from '../../Util/TestUtil';
import moment from 'moment';
import TimeLayerSliderPanel from '../TimeLayerSliderPanel/TimeLayerSliderPanel';

describe('<TimeLayerSliderPanel />', () => {
  it('is defined', () => {
    expect(TimeLayerSliderPanel).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(TimeLayerSliderPanel, {
      initStartDate: moment().subtract(3, 'hours'),
      initEndDate: moment()
    });
    expect(wrapper).not.toBeUndefined();
  });
});

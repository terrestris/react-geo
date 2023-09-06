import TestUtil from '../../Util/TestUtil';
import MapComponent from './MapComponent';

describe('<MapComponent />', () => {
  let map;

  it('is defined', () => {
    expect(MapComponent).not.toBeUndefined();
  });

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(MapComponent, {map});
    expect(wrapper).not.toBeUndefined();
  });

  it('passes props', () => {
    const wrapper = TestUtil.mountComponent(MapComponent, {
      map: map,
      className: 'podolski',
      fc: 'koeln'
    });
    const div = wrapper.find('div').getElements()[0];
    expect(div.props.className).toContain('podolski');
    expect(div.props.fc).toBe('koeln');
  });

});

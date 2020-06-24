import TestUtil from '../Util/TestUtil';

import CoordinateInfo from '../CoordinateInfo/CoordinateInfo';

describe('<CoordinateInfo />', () => {
  let map;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  it('is defined', () => {
    expect(CoordinateInfo).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(CoordinateInfo, {map});
    expect(wrapper).not.toBeUndefined();
  });
});

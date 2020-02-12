/*eslint-env jest*/

import TestUtil from '../Util/TestUtil';

import CoordinateInfo from '../CoordinateInfo/CoordinateInfo';

describe('<CoordinateInfo />', () => {
  it('is defined', () => {
    expect(CoordinateInfo).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(CoordinateInfo);
    expect(wrapper).not.toBeUndefined();
  });
});

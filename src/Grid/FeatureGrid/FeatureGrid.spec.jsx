/*eslint-env jest*/

import TestUtil from '../../Util/TestUtil';

import { FeatureGrid } from '../../index';

describe('<FeatureGrid />', () => {

  it('is defined', () => {
    expect(FeatureGrid).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid);
    expect(wrapper).not.toBeUndefined();
  });

});

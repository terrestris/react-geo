import TestUtil from '../../Util/TestUtil';
import WfsSearchField from './WfsSearchField';

describe('<WfsSearchField />', () => {
  it('is defined', () => {
    expect(WfsSearchField).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(WfsSearchField);
    expect(wrapper).not.toBeUndefined();
  });

});

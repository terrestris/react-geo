/*eslint-env jest*/

import TestUtils from '../../Util/TestUtil';

import TimeLayerSliderPanel from './TimeLayerSliderPanel';

describe('<TimeLayerSliderPanel />', () => {
  let map;
  let wrapper: any;

  beforeEach(() => {
    map = TestUtils.createMap({});
    const defaultProps = {
      t: () => { },
      map: map,
      dispatch: jest.fn()
    };
    wrapper = TestUtils.shallowConnectedComponentRoot(TimeLayerSliderPanel, defaultProps, null);
  });

  afterEach(() => {
    wrapper.unmount();
    TestUtils.unmountMapDiv();
  });

  describe('Basics', () => {
    it('is defined', () => {
      expect(TimeLayerSliderPanel).not.toBe(undefined);
    });

    it('can be rendered', () => {
      expect(wrapper).not.toBe(undefined);
    });
  });
});

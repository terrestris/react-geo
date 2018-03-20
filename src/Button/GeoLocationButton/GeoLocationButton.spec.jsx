/*eslint-env jest*/
import TestUtil from '../../Util/TestUtil';

import { GeoLocationButton } from '../../index';

describe('<GeoLocationButton />', () => {

  let map;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  describe('#Basics', () => {

    it('is defined', () => {
      expect(GeoLocationButton).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const wrapper = TestUtil.mountComponent(GeoLocationButton, {
        map: map
      });
      expect(wrapper).not.toBeUndefined();
    });

  });
});

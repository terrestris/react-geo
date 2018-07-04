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

    it('creates the geolocation interaction on the fly', function() {
      const wrapper = TestUtil.mountComponent(GeoLocationButton, {
        map: map,
        showMarker: false
      });
      const instance = wrapper.instance();
      expect(instance.geolocationInteraction).toBeUndefined();
    });

    it('can be pressed', () => {
      const wrapper = TestUtil.mountComponent(GeoLocationButton, {
        map: map,
        showMarker: false
      });
      const instance = wrapper.instance();
      instance.onToggle(true);
      expect(instance._geoLocationInteraction).not.toBeUndefined();
    });

    it('can be pressed twice', () => {
      const wrapper = TestUtil.mountComponent(GeoLocationButton, {
        map: map,
        showMarker: false
      });
      const instance = wrapper.instance();
      instance.onToggle(true);
      instance.onToggle(false);
      expect(instance._geoLocationInteraction).toBeNull();
    });

    it('can use the geolocation interaction', () => {
      const onChange = jest.fn();
      const wrapper = TestUtil.mountComponent(GeoLocationButton, {
        map: map,
        showMarker: false,
        onGeolocationChange: onChange
      });
      const instance = wrapper.instance();
      instance.onToggle(true);

      const getPosition = jest.fn();
      getPosition.mockReturnValue([2, 3]);
      instance._geoLocationInteraction.getPosition = getPosition;

      instance.onGeolocationChange();
      expect(onChange).toHaveBeenCalledTimes(1);
    });

  });
});

import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import TestUtil from '../../Util/TestUtil';
import ScaleCombo from './ScaleCombo';

describe('<ScaleCombo />', () => {
  it('is defined', () => {
    expect(ScaleCombo).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const map = TestUtil.createMap();
    const wrapper = TestUtil.mountComponent(ScaleCombo, {
      map
    });
    expect(wrapper).not.toBeUndefined();
  });

  it('passes style prop', () => {
    const map = TestUtil.createMap();
    const props = {
      map,
      style: {
        backgroundColor: 'yellow'
      }
    };
    const wrapper = TestUtil.mountComponent(ScaleCombo, props);
    expect(wrapper.getDOMNode()).toHaveStyle('backgroundColor: yellow');

    TestUtil.removeMap(map);
  });

  describe('#getOptionsFromMap', () => {
    it('is defined', () => {
      const map = TestUtil.createMap();
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map
      });
      const instance = wrapper.instance() as ScaleCombo;
      expect(instance.getOptionsFromMap).not.toBeUndefined();
    });

    it('creates options array from resolutions set on the map', () => {
      const map = TestUtil.createMap();

      const getOptionsFromMapSpy = jest.spyOn(ScaleCombo.prototype, 'getOptionsFromMap');

      TestUtil.mountComponent(ScaleCombo, {
        map
      });

      expect(getOptionsFromMapSpy).toHaveBeenCalledTimes(1);
      getOptionsFromMapSpy.mockRestore();

      TestUtil.removeMap(map);
    });

    it('creates options array from given map without resolutions', () => {
      const map = TestUtil.createMap();
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        scales: [],
        map: map
      });

      // Reset the scales array, as getOptionsFromMap() will be called in
      // constructor.
      wrapper.setState({scales: []});
      const instance = wrapper.instance() as ScaleCombo;
      const scales = instance.getOptionsFromMap();
      expect(scales).toBeInstanceOf(Array);

      TestUtil.removeMap(map);
    });

    it('creates options array from given map with resolutions', () => {
      const testResolutions = [560, 280, 140, 70, 28];
      const map = TestUtil.createMap({
        resolutions: testResolutions
      });
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        scales: [],
        map: map
      });

      // Reset the scales array, as getOptionsFromMap() will be called in
      // constructor.
      wrapper.setState({scales: []});

      const instance = wrapper.instance() as ScaleCombo;
      const scales = instance.getOptionsFromMap();

      expect(scales).toBeInstanceOf(Array);
      expect(scales).toHaveLength(testResolutions.length);

      let testResolution = testResolutions[testResolutions.length - 1];
      const roundScale = (Math.round(MapUtil.getScaleForResolution(testResolution ,'m')!));

      expect(scales[0]).toBe(roundScale);

      TestUtil.removeMap(map);
    });

    it('creates options array from given map with filtered resolutions', () => {
      const testResolutions = [560, 280, 140, 70, 28, 19, 15, 14, 13, 9];
      const map = TestUtil.createMap({
        resolutions: testResolutions
      });

      // eslint-disable-next-line
      const resolutionsFilter = (res: number) => {
        return res >= 19 || res <= 13;
      };

      const expectedLength = testResolutions.filter(resolutionsFilter).length;

      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map: map,
        scales: [],
        resolutionsFilter
      });

      // Reset the scales array, as getOptionsFromMap() will be called in
      // constructor.
      wrapper.setState({scales: []});

      const instance = wrapper.instance() as ScaleCombo;
      const scales = instance.getOptionsFromMap();
      expect(scales).toBeInstanceOf(Array);
      expect(scales).toHaveLength(expectedLength);

      const roundScale = MapUtil.roundScale(MapUtil.getScaleForResolution(
        testResolutions[testResolutions.length - 2] ,'m')!);

      expect(scales[1]).toBe(roundScale);

      TestUtil.removeMap(map);
    });
  });

  describe('#determineOptionKeyForZoomLevel', () => {
    it('is defined', () => {
      const map = TestUtil.createMap();
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map
      });
      const instance = wrapper.instance() as ScaleCombo;
      expect(instance.determineOptionKeyForZoomLevel).not.toBeUndefined();
    });

    it('returns "undefied" for erronous zoom level or if exceeds number of valid zoom levels ', () => {
      const map = TestUtil.createMap();
      const scaleArray = [100, 200, 300];
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map,
        scales: scaleArray
      });

      let component = wrapper.instance() as ScaleCombo;
      expect(component.determineOptionKeyForZoomLevel(undefined)).toBeUndefined();
      expect(component.determineOptionKeyForZoomLevel(17.123)).toBeUndefined();
      expect(component.determineOptionKeyForZoomLevel(scaleArray.length)).toBeUndefined();

      TestUtil.removeMap(map);
    });

    it('returns matching key for zoom level', () => {
      const map = TestUtil.createMap();
      const scaleArray = [100, 200, 300];
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map,
        scales: scaleArray
      });
      const index = 1;
      let component = wrapper.instance() as ScaleCombo;
      expect(component.determineOptionKeyForZoomLevel(index)).toBe(scaleArray[index].toString());

      TestUtil.removeMap(map);
    });

  });

});

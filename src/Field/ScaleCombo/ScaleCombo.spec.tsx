import * as React from 'react';

import { Select } from 'antd';
const Option = Select.Option;

import TestUtil from '../../Util/TestUtil';

import ScaleCombo from './ScaleCombo';

import Logger from '@terrestris/base-util/dist/Logger';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

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
        'backgroundColor': 'yellow'
      }
    };
    const wrapper = TestUtil.mountComponent(ScaleCombo, props);
    expect(wrapper.props().style.backgroundColor).toBe('yellow');

    TestUtil.removeMap(map);
  });

  describe('#getOptionsFromMap', () => {
    it('is defined', () => {
      const map = TestUtil.createMap();
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map
      });
      expect(wrapper.instance().getOptionsFromMap).not.toBeUndefined();
    });

    it('creates options array from scaled primarily', () => {
      const map = TestUtil.createMap();

      const logSpy = jest.spyOn(Logger, 'debug');
      const scaleArray = [
        <Option key={'100'} value={'100'}>1:100</Option>
      ];
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map,
        scales: scaleArray
      });
      wrapper.instance().getOptionsFromMap();
      expect(logSpy).toHaveBeenCalled();
      logSpy.mockRestore();

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
      wrapper.setState({'scales': []});

      const scales = wrapper.instance().getOptionsFromMap();
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
      wrapper.setState({'scales': []});

      const scales = wrapper.instance().getOptionsFromMap();
      expect(scales).toBeInstanceOf(Array);
      expect(scales).toHaveLength(testResolutions.length);

      const roundScale = (Math.round(MapUtil.getScaleForResolution(
        testResolutions[testResolutions.length - 1] ,'m')));

      expect(scales[0]).toBe(roundScale);

      TestUtil.removeMap(map);
    });

    it('creates options array from given map with filtered resolutions', () => {
      const testResolutions = [560, 280, 140, 70, 28, 19, 15, 14, 13, 9];
      const map = TestUtil.createMap({
        resolutions: testResolutions
      });

      // eslint-disable-next-line
      const resolutionsFilter = res => {
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
      wrapper.setState({'scales': []});

      const scales = wrapper.instance().getOptionsFromMap();
      expect(scales).toBeInstanceOf(Array);
      expect(scales).toHaveLength(expectedLength);

      const roundScale = MapUtil.roundScale(MapUtil.getScaleForResolution(
        testResolutions[testResolutions.length - 2] ,'m'));

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
      expect(wrapper.instance().determineOptionKeyForZoomLevel).not.toBeUndefined();
    });

    it('returns "undefied" for erronous zoom level or if exceeds number of valid zoom levels ', () => {
      const map = TestUtil.createMap();
      const scaleArray = [100, 200, 300];
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map,
        scales: scaleArray
      });

      expect(wrapper.instance().determineOptionKeyForZoomLevel(undefined)).toBeUndefined();
      expect(wrapper.instance().determineOptionKeyForZoomLevel(null)).toBeUndefined();
      expect(wrapper.instance().determineOptionKeyForZoomLevel('foo')).toBeUndefined();
      expect(wrapper.instance().determineOptionKeyForZoomLevel(17.123)).toBeUndefined();
      expect(wrapper.instance().determineOptionKeyForZoomLevel(scaleArray.length)).toBeUndefined();

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
      expect(wrapper.instance().determineOptionKeyForZoomLevel(index)).toBe(scaleArray[index].toString());

      TestUtil.removeMap(map);
    });

  });

});

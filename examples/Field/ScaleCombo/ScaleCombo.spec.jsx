/*eslint-env mocha*/
import React from 'react';
import sinon from 'sinon';
import expect from 'expect.js';
import { Select } from 'antd';
const Option = Select.Option;

import TestUtil from '../../Util/TestUtil';

import {
  ScaleCombo,
  MapUtil,
  Logger
} from '../../index';

describe('<ScaleCombo />', () => {
  it('is defined', () => {
    expect(ScaleCombo).not.to.be(undefined);
  });

  it('can be rendered', () => {
    const map = TestUtil.createMap();
    const wrapper = TestUtil.mountComponent(ScaleCombo, {
      map
    });
    expect(wrapper).not.to.be(undefined);
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
    expect(wrapper.props().style.backgroundColor).to.be('yellow');

    TestUtil.removeMap(map);
  });

  describe('#getOptionsFromMap', () => {
    it('is defined', () => {
      const map = TestUtil.createMap();
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map
      });
      expect(wrapper.instance().getOptionsFromMap).not.to.be(undefined);
    });

    it('creates options array from scaled primarily', () => {
      const map = TestUtil.createMap();

      const logSpy = sinon.spy(Logger, 'debug');
      const scaleArray = [
        <Option key={'100'} value={'100'}>1:100</Option>
      ];
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map,
        scales: scaleArray
      });
      wrapper.instance().getOptionsFromMap();
      expect(logSpy).to.have.property('callCount', 1);
      Logger.debug.restore();

      TestUtil.removeMap(map);
    });

    it('creates options array from given map without resolutions and updates scales prop', () => {
      const map = TestUtil.createMap();
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        scales: [],
        map: map
      });
      wrapper.instance().getOptionsFromMap();
      expect(wrapper.props().scales).to.be.an('array');

      TestUtil.removeMap(map);
    });

    it('creates options array from given map with resolutions and updates scales prop', () => {
      const testResolutions = [560, 280, 140, 70, 28];
      const map = TestUtil.createMap({
        resolutions: testResolutions
      });
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        scales: [],
        map: map
      });
      wrapper.instance().getOptionsFromMap();
      expect(wrapper.props().scales).to.be.an('array');
      expect(wrapper.props().scales).to.have.length(testResolutions.length);

      let roundScale = (Math.round(MapUtil.getScaleForResolution(
        testResolutions[testResolutions.length - 1] ,'m')));

      expect(wrapper.props().scales[0]).to.be(roundScale);

      TestUtil.removeMap(map);
    });
  });

  describe('#determineOptionKeyForZoomLevel', () => {
    it('is defined', () => {
      const map = TestUtil.createMap();
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map
      });
      expect(wrapper.instance().determineOptionKeyForZoomLevel).not.to.be(undefined);
    });

    it('returns "undefied" for erronous zoom level or if exceeds number of valid zoom levels ', () => {
      const map = TestUtil.createMap();
      const scaleArray = [100, 200, 300];
      const wrapper = TestUtil.mountComponent(ScaleCombo, {
        map,
        scales: scaleArray
      });

      expect(wrapper.instance().determineOptionKeyForZoomLevel(undefined)).to.be(undefined);
      expect(wrapper.instance().determineOptionKeyForZoomLevel(null)).to.be(undefined);
      expect(wrapper.instance().determineOptionKeyForZoomLevel('foo')).to.be(undefined);
      expect(wrapper.instance().determineOptionKeyForZoomLevel(17.123)).to.be(undefined);
      expect(wrapper.instance().determineOptionKeyForZoomLevel(scaleArray.length)).to.be(undefined);

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
      expect(wrapper.instance().determineOptionKeyForZoomLevel(index)).to.be(scaleArray[index]);

      TestUtil.removeMap(map);
    });

  });

});

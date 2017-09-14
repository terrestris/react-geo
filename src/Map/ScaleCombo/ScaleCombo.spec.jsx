/*eslint-env mocha*/
import React from 'react';
import sinon from 'sinon';
import expect from 'expect.js';
import { Select } from 'antd';
const Option = Select.Option;

import TestUtils from '../../Util/TestUtils';

import {
  ScaleCombo,
  MapUtil,
  Logger
} from '../../index';

describe('<ScaleCombo />', () => {
  let wrapper;
  let map;

  beforeEach(() => {
    wrapper = TestUtils.mountComponent(ScaleCombo);
  });

  afterEach(function() {
    TestUtils.removeMap(map);
  });

  it('is defined', () => {
    expect(ScaleCombo).not.to.be(undefined);
  });

  it('can be rendered', () => {
    expect(wrapper).not.to.be(undefined);
  });

  it('passes style prop', () => {
    const props = {
      style: {
        'backgroundColor': 'yellow'
      }
    };
    const wrapper = TestUtils.mountComponent(ScaleCombo, props);
    expect(wrapper.find('div.scale-select').node.style.backgroundColor).to.be('yellow');
  });

  describe('#getOptionsFromMap', () => {
    it('is defined', () => {
      expect(wrapper.instance().getOptionsFromMap).not.to.be(undefined);
    });

    it('shows warning of map is not set', () => {
      const logSpy = sinon.spy(Logger, 'warn');
      wrapper.instance().getOptionsFromMap();
      expect(logSpy).to.have.property('callCount', 1);
      Logger.warn.restore();
    });

    it('creates options array from scaled primarily', () => {
      const logSpy = sinon.spy(Logger, 'debug');
      const scaleArray = [
        <Option key={'100'} value={'100'}>1:100</Option>
      ];
      wrapper = TestUtils.mountComponent(ScaleCombo, {
        scales: scaleArray
      });
      wrapper.instance().getOptionsFromMap();
      expect(logSpy).to.have.property('callCount', 1);
      Logger.debug.restore();
    });

    it('creates options array from given map without resolutions and updates scales prop', () => {
      map = TestUtils.createMap();
      wrapper = TestUtils.mountComponent(ScaleCombo, {
        scales: [],
        map: map
      });
      wrapper.instance().getOptionsFromMap();
      expect(wrapper.props().scales).to.be.an('array');
    });

    it('creates options array from given map with resolutions and updates scales prop', () => {
      const testResolutions = [560, 280, 140, 70, 28];
      map = TestUtils.createMap({
        resolutions: testResolutions
      });
      wrapper = TestUtils.mountComponent(ScaleCombo, {
        scales: [],
        map: map
      });
      wrapper.instance().getOptionsFromMap();
      expect(wrapper.props().scales).to.be.an('array');
      expect(wrapper.props().scales).to.have.length(testResolutions.length);

      let roundScale = (Math.round(MapUtil.getScaleForResolution(
        testResolutions[testResolutions.length - 1] ,'m'))).toString();
      expect(wrapper.props().scales[0].key).to.be(roundScale);
    });
  });

  describe('#determineOptionKeyForZoomLevel', () => {
    it('is defined', () => {
      expect(wrapper.instance().determineOptionKeyForZoomLevel).not.to.be(undefined);
    });

    it('returns "undefied" for erronous zoom level or if exceeds number of valid zoom levels ', () => {
      const scaleArray = [
        <Option key={'100'} value={'100'}>1:100</Option>,
        <Option key={'200'} value={'200'}>1:100</Option>,
        <Option key={'300'} value={'300'}>1:100</Option>
      ];
      wrapper = TestUtils.mountComponent(ScaleCombo, {
        scales: scaleArray
      });

      expect(wrapper.instance().determineOptionKeyForZoomLevel(undefined)).to.be(undefined);
      expect(wrapper.instance().determineOptionKeyForZoomLevel(null)).to.be(undefined);
      expect(wrapper.instance().determineOptionKeyForZoomLevel('foo')).to.be(undefined);

      expect(wrapper.instance().determineOptionKeyForZoomLevel(scaleArray.length)).to.be(undefined);
    });

    it('returns matching key for zoom level', () => {
      const scaleArray = [
        <Option key={'100'} value={'100'}>1:100</Option>,
        <Option key={'200'} value={'200'}>1:100</Option>,
        <Option key={'300'} value={'300'}>1:100</Option>
      ];
      wrapper = TestUtils.mountComponent(ScaleCombo, {
        scales: scaleArray
      });

      const index = 1;
      expect(wrapper.instance().determineOptionKeyForZoomLevel(index)).to.be(scaleArray[index].key);
    });

  });

  describe('#handleOnKeyDown', () => {
    it('is defined', () => {
      expect(wrapper.instance().handleOnKeyDown).not.to.be(undefined);
    });

    it('calls onZoomLevelSelect if ENTER key is pressed', () => {
      const onZoomLevelSelect = sinon.spy();
      wrapper = TestUtils.mountComponent(ScaleCombo, {
        onZoomLevelSelect: onZoomLevelSelect
      });

      const eventObj = {
        key: 'Enter',
        target: {
          value: 9
        }
      };

      wrapper.instance().handleOnKeyDown(eventObj);
      expect(onZoomLevelSelect).to.have.property('callCount', 1);
    });

  });

  describe('#getInputElement', () => {
    it('is defined', () => {
      expect(wrapper.instance().getInputElement).not.to.be(undefined);
    });

    it('returns input element with an reigstered onKeyDown event', () => {
      let inputElement = wrapper.instance().getInputElement();
      expect(inputElement.type).to.be('input');
      expect(inputElement.props.onKeyDown).to.be.ok();
      expect(inputElement.props.onKeyDown).to.be.a('function');
    });
  });

});

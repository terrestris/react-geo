/*eslint-env jest*/
import React from 'react';
import PropTypes from 'prop-types';

import { mount } from 'enzyme';

import { TestUtil } from '../../Util/TestUtil';

import {
  MapProvider,
  mappify
} from '../../index';

describe('MapProvider', () => {
  /* eslint-disable require-jsdoc */
  class MockComponent extends React.Component {
    static propTypes = {
      map: PropTypes.object.isRequired,
    }
    render() {
      return (
        <div>Mockety-mock</div>
      );
    }
  }
  /* eslint-enable require-jsdoc */
  const MappifiedMockComponent = mappify(MockComponent);

  describe('Basics', () => {
    it('is defined', () => {
      expect(MapProvider).not.toBeUndefined();
    });

    it('provides a given map to its children (ol.Map)', () => {
      const map = TestUtil.createMap();
      const wrapper = mount(
        <MapProvider map={map}>
          <MappifiedMockComponent />
        </MapProvider>
      );
      const isReady = wrapper.state('ready');
      expect(isReady).toBe(true);

      const mapFromMock = wrapper.find(MockComponent).prop('map');
      expect(mapFromMock).toBe(map);
    });

    it('provides a given map to its children (Promise)', () => {
      const map = TestUtil.createMap();
      const mapPromise = new Promise((resolve) => {
        resolve(map);
      });
      const wrapper = mount(
        <MapProvider map={mapPromise}>
          <MappifiedMockComponent />
        </MapProvider>
      );
      return mapPromise.then(() => {
        const isReady = wrapper.state('ready');
        expect(isReady).toBe(true);
        wrapper.update();
        const mapFromMock = wrapper.find(MockComponent).prop('map');
        expect(mapFromMock).toBe(map);
      });
    });
  });
});

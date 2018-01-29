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
      // We create the promise only to be able to return it below, we do not
      // actually use it to instantiate MapProvider
      const mapPromise = new Promise((resolve) => {
        resolve(map);
      });

      const wrapper = mount(
        <MapProvider map={map}> {/* See, we use the map, not the promise*/}
          <MappifiedMockComponent />
        </MapProvider>
      );

      // resolve our promise, so this async behaviour is testable.
      setTimeout(() => {
        mapPromise.resolve(map);
      }, 50);

      expect.assertions(2);
      return mapPromise.then(() => {
        const isReady = wrapper.state('ready');
        expect(isReady).toBe(true);
        wrapper.update();
        const mapFromMock = wrapper.find(MockComponent).prop('map');
        expect(mapFromMock).toBe(map);
      });

    });

    it('provides a given map to its children (Promise)', () => {
      const map = TestUtil.createMap();
      const mapPromise = new Promise((resolve) => {
        resolve(map);
      });
      const wrapper = mount(
        <MapProvider map={mapPromise}> {/* See, we now use the actual promise*/}
          <MappifiedMockComponent />
        </MapProvider>
      );
      expect.assertions(2);
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

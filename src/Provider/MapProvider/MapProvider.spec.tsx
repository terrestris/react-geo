import * as React from 'react';

import { mount } from 'enzyme';

import { TestUtil } from '../../Util/TestUtil';

import MapProvider from './MapProvider';
import { mappify } from '../../HigherOrderComponent/MappifiedComponent/MappifiedComponent';
import OlMap from 'ol/Map';

describe('MapProvider', () => {
  class MockComponent extends React.Component {
    render() {
      return (
        <div>Mockety-mock</div>
      );
    }
  }
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

      expect.assertions(2);
      return Promise.resolve()
        .then(() => {
          const isReady = wrapper.state('ready');
          expect(isReady).toBe(true);
          wrapper.update();
          const mapFromMock = wrapper.find(MockComponent).prop('map');
          expect(mapFromMock).toBe(map);
        });
    });

    it('provides a given map to its children (Promise)', () => {
      const map = TestUtil.createMap();
      const mapPromise = new Promise<OlMap>((resolve) => {
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

    it('Does not render on rejected promise', () => {
      const errMsg = 'Some message: Humpty';
      const failingPromise = new Promise<OlMap>((resolve, reject) => {
        reject(new Error(errMsg));
      });

      const wrapper = mount(
        <MapProvider map={failingPromise}> {/* use the failing promise*/}
          <MappifiedMockComponent />
        </MapProvider>
      );

      expect.assertions(3);
      return failingPromise.catch((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(errMsg);
        wrapper.update();
        const mapFromMock = wrapper.find(MockComponent);
        expect(mapFromMock.exists()).toBe(false);
      });
    });
  });
});

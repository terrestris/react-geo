/*eslint-env jest*/

import geoJson from '../../../assets/federal-states-ger.json';

import TestUtil from '../TestUtil';
import {
  FileUtil
} from '../../index';

describe('FileUtil', () => {
  const geoJsonFile = new File([JSON.stringify(geoJson)], 'geo.json', {
    type: 'application/json',
    lastModified: new Date()
  });

  let map;

  it('is defined', () => {
    expect(FileUtil).not.toBeUndefined();
  });

  describe('Static methods', () => {
    beforeEach(() => {
      map = TestUtil.createMap();
    });

    afterEach(() => {
      TestUtil.removeMap(map);
    });

    describe('#addGeojsonLayer', () => {
      it('adds a layer from a geojson string', () => {
        expect.assertions(2);
        return new Promise((resolve) => {
          const layers = map.getLayers();
          layers.on('add', (event) => {
            const layer = event.element;
            expect(layers.getLength()).toBe(2);
            expect(layer.getSource().getFeatures().length).toBe(16);
            resolve();
          });
          FileUtil.addGeojsonLayer(geoJson, map);
        });
      });
    });

    describe('#addGeojsonLayerFromFile', () => {
      it('reads the geojson file and adds a layer to the map', () => {
        expect.assertions(2);
        return new Promise((resolve) => {
          const layers = map.getLayers();
          layers.on('add', (event) => {
            const layer = event.element;
            expect(layers.getLength()).toBe(2);
            expect(layer.getSource().getFeatures().length).toBe(16);
            resolve();
          });
          FileUtil.addGeojsonLayerFromFile(geoJsonFile, map);
        });
      });
    });

  });
});

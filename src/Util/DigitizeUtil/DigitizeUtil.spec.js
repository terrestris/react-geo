/*eslint-env jest*/
import OlGeomPoint from 'ol/geom/point';
import OlFeature from 'ol/feature';
import OlStyleStyle from 'ol/style/style';

import DigitizeUtil from '../DigitizeUtil/DigitizeUtil';
import TestUtil from '../TestUtil';

describe('DigitizeUtil', () => {

  describe('Basics', () => {
    it('is defined', () => {
      expect(DigitizeUtil).toBeDefined();
    });
  });

  describe('Static methods', () => {

    describe('#moveFeature', () => {
      it('is defined', () => {
        expect(DigitizeUtil.moveFeature).toBeDefined();
      });
      it('registers postcompose listener on the map', () => {

        const geom = new OlGeomPoint([0, 0]);
        const featToMove = new OlFeature(geom);

        let map = TestUtil.createMap();

        expect(map.listeners_.postcompose).toBeUndefined();

        const expectedKey = DigitizeUtil.moveFeature(
          map, featToMove, 100, 50, new OlStyleStyle()
        );

        expect(typeof map.listeners_.postcompose).toBe('object');
        expect(typeof expectedKey).toBe('object');
        expect(expectedKey.type).toBe('postcompose');

        TestUtil.removeMap(map);
      });
    });
  });
});

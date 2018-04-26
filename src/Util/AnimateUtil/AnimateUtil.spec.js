/*eslint-env jest*/
import OlGeomPoint from 'ol/geom/Point';
import OlFeature from 'ol/Feature';
import OlStyleStyle from 'ol/style/Style';

import AnimateUtil from '../AnimateUtil/AnimateUtil';
import TestUtil from '../TestUtil';

describe('AnimateUtil', () => {

  describe('Basics', () => {
    it('is defined', () => {
      expect(AnimateUtil).toBeDefined();
    });
  });

  describe('Static methods', () => {

    describe('#moveFeature', () => {
      it('is defined', () => {
        expect(AnimateUtil.moveFeature).toBeDefined();
      });
      it('moves feature to the new position', () => {

        const coords = [0, 0];
        const geom = new OlGeomPoint(coords);
        const featToMove = new OlFeature(geom);

        let map = TestUtil.createMap();

        AnimateUtil.moveFeature(
          map, featToMove, 100, 50, new OlStyleStyle()
        ).then((feat) => {
          expect(feat.getGeometry().getCoordinates()).toEqual([50, 50]);
        });
        TestUtil.removeMap(map);
      });
    });
  });
});

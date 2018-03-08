/*eslint-env jest*/

import OlFormatGeoJSON from 'ol/format/geojson';
import OlFeature from 'ol/feature';
import OlGeomLineString from 'ol/geom/linestring';
import OlGeomPolygon from 'ol/geom/polygon';

import {
  GeometryUtil,
} from '../../index';

describe('FeatureUtil', () => {
  let poly;
  let format;

  beforeEach(() => {
    format = new OlFormatGeoJSON();

    poly = new OlFeature({
      geometry: new OlGeomPolygon([[
        [10, 40],
        [40, 40],
        [40, 10],
        [10, 10],
        [10, 40]
      ]])
    });
  });

  describe('Basics', () => {
    it('is defined', () => {
      expect(GeometryUtil).toBeDefined();
    });
  });

  describe('Static methods', () => {
    describe('#splitByLine', () => {
      /**
       *          +
       *          |
       *   +-------------+
       *   |      |      |
       *   |      |      |
       *   |      |      |
       *   |      |      |
       *   |      |      |
       *   |      |      |
       *   +-------------+
       *          |
       *          +
       */
      it('splits the given convex polygon geometry with a straight line', () => {
        const line = new OlFeature({
          geometry: new OlGeomLineString([
            [25, 50],
            [25, 0]
          ])
        });

        const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');

        const exp = [
          new OlFeature({
            geometry: new OlGeomPolygon([[
              [10, 40],
              [25, 40],
              [25, 10],
              [10, 10],
              [10, 40]
            ]])
          }),
          new OlFeature({
            geometry: new OlGeomPolygon([[
              [25, 40],
              [40, 40],
              [40, 10],
              [25, 10],
              [25, 40]
            ]])
          })
        ];

        expect(format.writeFeatures(got)).toEqual(format.writeFeatures(exp));
      });

      /**
       *          +
       *          |
       *   +-------------+
       *   |      |      |
       *   |      |      |
       *   |      |      |
       *   |      +---------+
       *   |             |
       *   |             |
       *   +-------------+
       */
      it('splits the given convex polygon geometry with a more complex line', () => {
        const line = new OlFeature({
          geometry: new OlGeomLineString([
            [25, 50],
            [25, 25],
            [50, 25]
          ])
        });

        const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');

        const exp = [
          new OlFeature({
            geometry: new OlGeomPolygon([[
              [10, 40],
              [25, 40],
              [25, 25],
              [40, 25],
              [40, 10],
              [10, 10],
              [10, 40]
            ]])
          }),
          new OlFeature({
            geometry: new OlGeomPolygon([[
              [25, 40],
              [40, 40],
              [40, 25],
              [25, 25],
              [25, 40]
            ]])
          })
        ];

        expect(format.writeFeatures(got)).toEqual(format.writeFeatures(exp));
      });

      /**
       *       +----+         +----+
       *       |    |         |    |
       *       |    |         |    |
       * +--------------------------------+
       *       |    |         |    |
       *       |    +---------+    |
       *       |                   |
       *       |                   |
       *       |                   |
       *       |                   |
       *       +-------------------+
       *
       */
      it('splits the given concave polygon geometry with a straight line', () => {
        poly = new OlFeature({
          geometry: new OlGeomPolygon([[
            [10, 40],
            [20, 40],
            [20, 30],
            [30, 30],
            [30, 40],
            [40, 40],
            [40, 10],
            [10, 10],
            [10, 40]
          ]])
        });

        const line = new OlFeature({
          geometry: new OlGeomLineString([
            [0, 35],
            [50, 35]
          ])
        });

        const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');

        const exp = [
          new OlFeature({
            geometry: new OlGeomPolygon([[
              [10, 40],
              [20, 40],
              [20, 35],
              [10, 35],
              [10, 40]
            ]])
          }),
          new OlFeature({
            geometry: new OlGeomPolygon([[
              [20, 35],
              [20, 30],
              [30, 30],
              [30, 35],
              [40, 35],
              [40, 10],
              [10, 10],
              [10, 35],
              [20, 35]
            ]])
          }),
          new OlFeature({
            geometry: new OlGeomPolygon([[
              [30, 35],
              [30, 40],
              [40, 40],
              [40, 35],
              [30, 35]
            ]])
          })
        ];

        expect(format.writeFeatures(got)).toEqual(format.writeFeatures(exp));
      });
    });
  });
});

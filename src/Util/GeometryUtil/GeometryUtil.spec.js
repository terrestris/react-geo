/*eslint-env jest*/

import OlFormatGeoJSON from 'ol/format/geojson';
import OlFeature from 'ol/feature';
import OlGeomGeometry from 'ol/geom/geometry';
import OlGeomPolygon from 'ol/geom/polygon';
import OlGeomMultiPolygon from 'ol/geom/multipolygon';
import OlGeomPoint from 'ol/geom/point';
import OlGeomMultiPoint from 'ol/geom/multipoint';
import OlGeomLineString from 'ol/geom/linestring';
import OlGeomMultiLineString from 'ol/geom/multilinestring';

import {
  GeometryUtil,
} from '../../index';

describe('GeometryUtil', () => {
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
      describe('with ol.Feature as params', () => {
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
      describe('with ol.geom.Geometry as params', () => {
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
          poly = new OlGeomPolygon([[
            [10, 40],
            [40, 40],
            [40, 10],
            [10, 10],
            [10, 40]
          ]]);
          const line = new OlGeomLineString([
            [25, 50],
            [25, 0]
          ]);

          const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');

          const exp = [
            new OlGeomPolygon([[
              [10, 40],
              [25, 40],
              [25, 10],
              [10, 10],
              [10, 40]
            ]]),
            new OlGeomPolygon([[
              [25, 40],
              [40, 40],
              [40, 10],
              [25, 10],
              [25, 40]
            ]])
          ];

          got.forEach((polygon, i) => {
            expect(polygon.getCoordinates()).toEqual(exp[i].getCoordinates());
          });
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
          poly = new OlGeomPolygon([[
            [10, 40],
            [40, 40],
            [40, 10],
            [10, 10],
            [10, 40]
          ]]);
          const line = new OlGeomLineString([
            [25, 50],
            [25, 25],
            [50, 25]
          ]);

          const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');

          const exp = [
            new OlGeomPolygon([[
              [10, 40],
              [25, 40],
              [25, 25],
              [40, 25],
              [40, 10],
              [10, 10],
              [10, 40]
            ]]),
            new OlGeomPolygon([[
              [25, 40],
              [40, 40],
              [40, 25],
              [25, 25],
              [25, 40]
            ]])
          ];

          got.forEach((polygon, i) => {
            expect(polygon.getCoordinates()).toEqual(exp[i].getCoordinates());
          });
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
          poly = new OlGeomPolygon([[
            [10, 40],
            [20, 40],
            [20, 30],
            [30, 30],
            [30, 40],
            [40, 40],
            [40, 10],
            [10, 10],
            [10, 40]
          ]]);

          const line = new OlGeomLineString([
            [0, 35],
            [50, 35]
          ]);

          const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');

          const exp = [
            new OlGeomPolygon([[
              [10, 40],
              [20, 40],
              [20, 35],
              [10, 35],
              [10, 40]
            ]]),
            new OlGeomPolygon([[
              [20, 35],
              [20, 30],
              [30, 30],
              [30, 35],
              [40, 35],
              [40, 10],
              [10, 10],
              [10, 35],
              [20, 35]
            ]]),
            new OlGeomPolygon([[
              [30, 35],
              [30, 40],
              [40, 40],
              [40, 35],
              [30, 35]
            ]])
          ];

          got.forEach((polygon, i) => {
            expect(polygon.getCoordinates()).toEqual(exp[i].getCoordinates());
          });
        });
      });
    });

    describe('#addBuffer', () => {
      describe('with ol.Feature as params', () => {
        it('adds a buffer to an ol.geom.Point', () => {
          const testPoint = new OlFeature({
            geometry: new OlGeomPoint([13, 37])
          });
          const bufferedPoint = GeometryUtil.addBuffer(testPoint, 200, 'EPSG:4326');
          expect(bufferedPoint instanceof OlFeature).toBe(true);
        });
        it('adds a buffer to an ol.geom.Polygon', () => {
          const testPolygon = new OlFeature({
            geometry: new OlGeomPolygon([[
              [10, 10],
              [11, 11],
              [10, 11],
              [10, 10]
            ]])
          });
          const bufferedPolygon = GeometryUtil.addBuffer(testPolygon, 200, 'EPSG:4326');
          expect(bufferedPolygon instanceof OlFeature).toBe(true);
        });
        it('adds a buffer to an ol.geom.Linestring', () => {
          const testLineString = new OlFeature({
            geometry: new OlGeomLineString([ [10, 10], [11, 11] ])
          });
          const bufferedPolygon = GeometryUtil.addBuffer(testLineString, 200, 'EPSG:4326');
          expect(bufferedPolygon instanceof OlFeature).toBe(true);
        });
      });
      describe('with ol.geom.Geomtry as params', () => {
        it('adds a buffer to an ol.geom.Point', () => {
          const testPoint = new OlGeomPoint([13, 37]);
          const bufferedPoint = GeometryUtil.addBuffer(testPoint, 200, 'EPSG:4326');
          expect(bufferedPoint instanceof OlGeomPolygon).toBe(true);
        });
        it('adds a buffer to an ol.geom.Polygon', () => {
          const testPolygon = new OlGeomPolygon([[
            [10, 10],
            [11, 11],
            [10, 11],
            [10, 10]
          ]]);
          const bufferedPolygon = GeometryUtil.addBuffer(testPolygon, 200, 'EPSG:4326');
          expect(bufferedPolygon instanceof OlGeomPolygon).toBe(true);
        });
        it('adds a buffer to an ol.geom.Linestring', () => {
          const testLineString = new OlGeomLineString([ [10, 10], [11, 11] ]);
          const bufferedPolygon = GeometryUtil.addBuffer(testLineString, 200, 'EPSG:4326');
          expect(bufferedPolygon instanceof OlGeomPolygon).toBe(true);
        });
      });
    });

    describe('#mergeGeometries', () => {
      it('merges multiple instances of ol.geom.Point into ol.geom.MultiPoint', () => {
        const testPoint1 = new OlGeomPoint([13, 37]);
        const testPoint2 = new OlGeomPoint([37, 13]);
        const mergedPoint = GeometryUtil.mergeGeometries([testPoint1, testPoint2]);
        const mergedPointCoordinates = [
          [13, 37],
          [37, 13]
        ];
        expect(mergedPoint instanceof OlGeomMultiPoint).toBe(true);
        expect(mergedPoint.getCoordinates()).toEqual(mergedPointCoordinates);
      });
      it('merges multiple instances of ol.geom.Polygon into ol.geom.MultiPolygon', () => {
        const testPolygon1 = new OlGeomPolygon([[
          [10, 10],
          [11, 11],
          [10, 11],
          [10, 10]
        ]]);
        const testPolygon2 = new OlGeomPolygon([[
          [100, 100],
          [110, 110],
          [100, 110],
          [100, 100]
        ]]);
        const mergedPolygon = GeometryUtil.mergeGeometries([testPolygon1, testPolygon2]);
        const mergedPolygonCoordinates = [
          [[
            [10, 10],
            [11, 11],
            [10, 11],
            [10, 10]
          ]],
          [[
            [100, 100],
            [110, 110],
            [100, 110],
            [100, 100]
          ]]
        ];
        expect(mergedPolygon instanceof OlGeomMultiPolygon).toBe(true);
        expect(mergedPolygon.getCoordinates()).toEqual(mergedPolygonCoordinates);
      });
      it('merges multiple instances of ol.geom.LineString into ol.geom.MultiLineString', () => {
        const testLineString1 = new OlGeomLineString([ [10, 10], [11, 11] ]);
        const testLineString2 = new OlGeomLineString([ [12, 12], [13, 13] ]);
        const mergedLineString = GeometryUtil.mergeGeometries([testLineString1, testLineString2]);
        const mergedLineStringCoordinates = [
          [[ 10, 10 ],[ 11, 11 ]],
          [[ 12, 12 ],[ 13, 13 ]]
        ];
        expect(mergedLineString instanceof OlGeomMultiLineString).toBe(true);
        expect(mergedLineString.getCoordinates()).toEqual(mergedLineStringCoordinates);
      });
    });

    describe('#union', () => {
      describe('with ol.Feature as params', () => {
        it('unions multiple instances of ol.geom.Polygon into one ol.geom.MultiPolygon', () => {
          const poly1 = new OlFeature({
            geometry: new OlGeomPolygon([[
              [10, 10],
              [11, 11],
              [10, 11],
              [10, 10]
            ]])
          });
          const poly2 = new OlFeature({
            geometry: new OlGeomPolygon([[
              [10.5, 10],
              [11.5, 11],
              [10.5, 11],
              [10.5, 10]
            ]])
          });
          const unionedFeature = GeometryUtil.union([poly1, poly2], 'EPSG:4326');
          const unionCoordinates = [[
            [10.5, 10.5],
            [10, 10],
            [10, 11],
            [10.5, 11],
            [11, 11],
            [11.5, 11],
            [10.5, 10],
            [10.5, 10.5]
          ]];
          expect(unionedFeature instanceof OlFeature).toBe(true);
          expect(unionedFeature.getGeometry().getCoordinates()).toEqual(unionCoordinates);
        });
      });
      describe('with ol.geom.Geometry as params', () => {
        it('unions multiple instances of ol.geom.Polygon into one ol.geom.MultiPolygon', () => {
          const poly1 = new OlGeomPolygon([[
            [10, 10],
            [11, 11],
            [10, 11],
            [10, 10]
          ]]);
          const poly2 = new OlGeomPolygon([[
            [10.5, 10],
            [11.5, 11],
            [10.5, 11],
            [10.5, 10]
          ]]);
          const unionedFeature = GeometryUtil.union([poly1, poly2], 'EPSG:4326');
          const unionCoordinates = [[
            [10.5, 10.5],
            [10, 10],
            [10, 11],
            [10.5, 11],
            [11, 11],
            [11.5, 11],
            [10.5, 10],
            [10.5, 10.5]
          ]];
          expect(unionedFeature instanceof OlGeomGeometry).toBe(true);
          expect(unionedFeature.getCoordinates()).toEqual(unionCoordinates);
        });
      });
    });

    describe('#intersection', () => {
      describe('with ol.Feature as params', () => {
        it('returns the intersection of two instances of ol.geom.Polygon', () => {
          const poly1 = new OlFeature({
            geometry: new OlGeomPolygon([[
              [10, 10],
              [11, 11],
              [10, 11],
              [10, 10]
            ]])
          });
          const poly2 = new OlFeature({
            geometry: new OlGeomPolygon([[
              [10.5, 10],
              [11.5, 11],
              [10.5, 11],
              [10.5, 10]
            ]])
          });
          const intersectionFeature = GeometryUtil.intersection(poly1, poly2, 'EPSG:4326');
          const intersectionCoordinates = [[
            [11, 11],
            [10.5, 10.5],
            [10.5, 11],
            [11, 11]
          ]];
          expect(intersectionFeature instanceof OlFeature).toBe(true);
          expect(intersectionFeature.getGeometry().getCoordinates()).toEqual(intersectionCoordinates);
        });
        it('returns null if no intersection is found', () => {
          const poly1 = new OlFeature({
            geometry: new OlGeomPolygon([[
              [10, 10],
              [11, 11],
              [10, 11],
              [10, 10]
            ]])
          });
          const poly2 = new OlFeature({
            geometry: new OlGeomPolygon([[
              [20, 20],
              [21, 21],
              [20, 21],
              [20, 20]
            ]])
          });
          const intersectionGeometry = GeometryUtil.intersection(poly1, poly2, 'EPSG:4326');
          expect(intersectionGeometry).toBe(null);
      });
      });
      describe('with ol.geom.Geometry as params', () => {
        it('returns the intersection of two instances of ol.geom.Polygon', () => {
          const poly1 = new OlGeomPolygon([[
            [10, 10],
            [11, 11],
            [10, 11],
            [10, 10]
          ]]);
          const poly2 = new OlGeomPolygon([[
            [10.5, 10],
            [11.5, 11],
            [10.5, 11],
            [10.5, 10]
          ]]);
          const intersectionGeometry = GeometryUtil.intersection(poly1, poly2, 'EPSG:4326');
          const intersectionCoordinates = [[
            [11, 11],
            [10.5, 10.5],
            [10.5, 11],
            [11, 11]
          ]];
          expect(intersectionGeometry instanceof OlGeomGeometry).toBe(true);
          expect(intersectionGeometry.getCoordinates()).toEqual(intersectionCoordinates);
        });
        it('returns null if no intersection is found', () => {
          const poly1 = new OlGeomPolygon([[
            [10, 10],
            [11, 11],
            [10, 11],
            [10, 10]
          ]]);
          const poly2 = new OlGeomPolygon([[
            [20, 20],
            [21, 21],
            [20, 21],
            [20, 20]
          ]]);
          const intersectionGeometry = GeometryUtil.intersection(poly1, poly2, 'EPSG:4326');
          expect(intersectionGeometry).toBe(null);
        });
      });
    });
  });
});

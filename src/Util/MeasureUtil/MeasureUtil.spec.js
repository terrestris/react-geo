/*eslint-env jest*/

import OlGeomLineString from 'ol/geom/LineString';
import OlGeomPolygon from 'ol/geom/Polygon';

import {
  MeasureUtil,
} from '../../index';

import TestUtil from '../TestUtil';

describe('MeasureUtil', () => {

  let map;

  describe('Basics', () => {
    it('is defined', () => {
      expect(MeasureUtil).toBeDefined();
    });
  });

  describe('Static methods', () => {

    describe('#formatLength', () => {
      it('is defined', () => {
        expect(MeasureUtil.formatLength).toBeDefined();
      });
      it('formats the length of a multiline as expected', () => {
        const start = [0, 0];
        const end = [0, 100];
        const end2 = [0, 100550];

        const shortLine = new OlGeomLineString([start, end]);
        const longLine = new OlGeomLineString([start, end2]);

        map = TestUtil.createMap();

        const expectedShortLength = MeasureUtil.formatLength(shortLine, map, 0);
        const expectedLongLength = MeasureUtil.formatLength(longLine, map, 0);

        expect(expectedShortLength).toBe('100 m');
        expect(expectedLongLength).toBe('100 km');

        TestUtil.removeMap(map);
      });
    });



    describe('#formatArea', () => {
      it('is defined', () => {
        expect(MeasureUtil.formatArea).toBeDefined();
      });
      it('formats the length of a multiline as expected', () => {
        const smallPolyCoords = [
          [0, 0],
          [0, 10],
          [10, 10],
          [10, 0],
          [0, 0]
        ];
        const bigPolyCoords = smallPolyCoords.map(coord => [coord[0] * 100, coord[1] * 100]);

        const smallPoly = new OlGeomPolygon([smallPolyCoords]);
        const bigPoly = new OlGeomPolygon([bigPolyCoords]);

        map = TestUtil.createMap();

        const expectedSmallArea = MeasureUtil.formatArea(smallPoly, map, 0);
        const expectedBigArea = MeasureUtil.formatArea(bigPoly, map, 0);

        expect(expectedSmallArea).toBe('100 m<sup>2</sup>');
        expect(expectedBigArea).toBe('1 km<sup>2</sup>');

        TestUtil.removeMap(map);
      });
    });

    describe('#angle', () => {
      it('is defined', () => {
        expect(MeasureUtil.formatArea).toBeDefined();
      });
      it('calculates the angle in deegrees', function() {
        const start = [0, 0];
        const ends = [
          [1, 0], // east, 3 o'clock
          [1, -1], // south-east, between 4 and 5 o'clock
          [0, -1], // south, 6 o'clock
          [-1, -1], // south-west, between 7 and 8 o'clock
          [-1, 0], // west, 9 o'clock
          [-1, 1], // north-west, between 10 and 11 o'clock
          [0, 1], // north, 12 o'clock
          [1, 1] // north-east, between 1 and 2 o'clock
        ];
        const expectedAngles = [
          180,
          135,
          90,
          45,
          0,
          -45,
          -90,
          -135
        ];

        expect(ends.length).toBe(expectedAngles.length);

        ends.forEach((end, index) => {
          const got = MeasureUtil.angle(start, end);
          expect(got).toBe(expectedAngles[index]);
        });
      });
    });

    describe('#angle360', () => {
      it('is defined', () => {
        expect(MeasureUtil.formatArea).toBeDefined();
      });
      it('calculates the angle in deegrees ranged from 0° and 360°', function() {
        const start = [0, 0];
        const ends = [
          [1, 0], // east, 3 o'clock
          [1, -1], // south-east, between 4 and 5 o'clock
          [0, -1], // south, 6 o'clock
          [-1, -1], // south-west, between 7 and 8 o'clock
          [-1, 0], // west, 9 o'clock
          [-1, 1], // north-west, between 10 and 11 o'clock
          [0, 1], // north, 12 o'clock
          [1, 1] // north-east, between 1 and 2 o'clock
        ];
        const expectedAngles = [
          180,
          135,
          90,
          45,
          0,
          315,
          270,
          225
        ];

        expect(ends.length).toBe(expectedAngles.length);

        ends.forEach((end, index) => {
          const got = MeasureUtil.angle360(start, end);
          expect(got).toBe(expectedAngles[index]);
        });
      });
    });

    describe('#makeClockwise', () => {
      it('is defined', () => {
        expect(MeasureUtil.formatArea).toBeDefined();
      });
      it('returns a clockwised version of an angle', function() {
        expect(MeasureUtil.makeClockwise(0)).toBe(360);
        expect(MeasureUtil.makeClockwise(45)).toBe(315);
        expect(MeasureUtil.makeClockwise(90)).toBe(270);
        expect(MeasureUtil.makeClockwise(135)).toBe(225);
        expect(MeasureUtil.makeClockwise(180)).toBe(180);
        expect(MeasureUtil.makeClockwise(225)).toBe(135);
        expect(MeasureUtil.makeClockwise(270)).toBe(90);
        expect(MeasureUtil.makeClockwise(315)).toBe(45);
        expect(MeasureUtil.makeClockwise(360)).toBe(0);
      });
    });

    describe('#makeZeroDegreesAtNorth', () => {
      it('is defined', () => {
        expect(MeasureUtil.formatArea).toBeDefined();
      });
      it('shifts a calculates the angle so 0° is in the north', function() {
        const start = [0, 0];
        const ends = [
          [1, 0], // east, 3 o'clock
          [1, -1], // south-east, between 4 and 5 o'clock
          [0, -1], // south, 6 o'clock
          [-1, -1], // south-west, between 7 and 8 o'clock
          [-1, 0], // west, 9 o'clock
          [-1, 1], // north-west, between 10 and 11 o'clock
          [0, 1], // north, 12 o'clock
          [1, 1] // north-east, between 1 and 2 o'clock
        ];
        const expectedAngles = [
          270,
          225,
          180,
          135,
          90,
          45,
          360, // also 0
          315
        ];

        expect(ends.length).toBe(expectedAngles.length);

        ends.forEach((end, index) => {
          const angle = MeasureUtil.angle360(start, end);
          const got = MeasureUtil.makeZeroDegreesAtNorth(angle);
          expect(got).toBe(expectedAngles[index]);
        });
      });
    });

    describe('#formatAngle', () => {
      it('is defined', () => {
        expect(MeasureUtil.formatAngle).toBeDefined();
      });
      it('formats the angle of a multiline as expected', () => {
        const start = [0, 0];
        const ends = [
          [1, 0], // east, 3 o'clock
          [1, -1], // south-east, between 4 and 5 o'clock
          [0, -1], // south, 6 o'clock
          [-1, -1], // south-west, between 7 and 8 o'clock
          [-1, 0], // west, 9 o'clock
          [-1, 1], // north-west, between 10 and 11 o'clock
          [0, 1], // north, 12 o'clock
          [1, 1] // north-east, between 1 and 2 o'clock
        ];

        const lines = ends.map(end => new OlGeomLineString([start, end]));

        const expectedAngles = [
          '90.00°',
          '135.00°',
          '180.00°',
          '225.00°',
          '270.00°',
          '315.00°',
          '0.00°', // also 0°
          '45.00°'
        ];
        expect(ends.length).toBe(expectedAngles.length);
        expect(lines.length).toBe(expectedAngles.length);

        lines.forEach((line, index) => {
          const angle = MeasureUtil.formatAngle(line);
          expect(angle).toBe(expectedAngles[index]);
        });
      });
    });
  });

});

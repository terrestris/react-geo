/*eslint-env jest*/

import {
  MathUtil,
} from '../../index';

describe('MathUtil', () => {

  describe('Basics', () => {
    it('is defined', () => {
      expect(MathUtil).toBeDefined();
    });
  });

  describe('Static methods', () => {
    describe('#mod', () => {
      it('properly handles negative values', () => {
        expect(MathUtil.mod(-1.4)).toBeCloseTo(4.883185307179);
      });
    });

    describe('#radToDeg', () => {
      it('converts radians to degrees', () => {
        expect(MathUtil.radToDeg(Math.PI)).toBeCloseTo(180);
      });
    });

    describe('#degToRad', () => {
      it('converts degrees to radians', () => {
        expect(MathUtil.degToRad(180)).toBeCloseTo(Math.PI);
      });
    });
  });
});

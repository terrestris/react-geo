/**
 * Helper Class for various calculations.
 *
 * @class MathUtil
 */
class MathUtil {

  // convert radians to degrees
  static radToDeg = (rad) => rad * 360 / (Math.PI * 2);

  // convert degrees to radians
  static degToRad = (deg) => deg * Math.PI * 2 / 360;

  // modulo for negative values
  static mod = (n) => ((n % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);

}

export default MathUtil;

import { OlSphere } from 'ol/sphere';
import { OlProjTransform } from 'ol/proj/transform';

/**
 * This class provides some static methods which might be helpful when working
 * with measurements.
 *
 * @class MeasureUtil
 */
class MeasureUtil {
    /**
     * Format length output for the tooltip.
     *
     * @param {OlGeomMultilinestring} line The drawn line.
     * @param {OlMap} map An OlMap
     * @param {Boolean} geodesic Is the measurement geodesic
     * @return {String} The formatted length of the line.
     */
    static formatLength = (line, map, geodesic = true) => {
      var decimalHelper = Math.pow(10, 2);
      var length;

      if (geodesic) {
        const wgs84Sphere = new OlSphere(6378137);
        const coordinates = line.getCoordinates();
        length = 0;
        const sourceProj = map.getView().getProjection();
        coordinates.forEach((coordinate, idx) => {
          const c1 = OlProjTransform(
            coordinate, sourceProj, 'EPSG:4326');
          const c2 = OlProjTransform(
            coordinates[idx + 1], sourceProj, 'EPSG:4326');
          length += wgs84Sphere.haversineDistance(c1, c2);
        });
      } else {
        length = Math.round(line.getLength() * 100) / 100;
      }
      let output;
      if (length > 1000) {
        output = (Math.round(length / 1000 * decimalHelper) /
                decimalHelper) + ' ' + 'km';
      } else {
        output = (Math.round(length * decimalHelper) / decimalHelper) +
                ' m';
      }
      return output;
    }

    /**
     * Format length output for the tooltip.
     *
     * @param {OlGeomPolygon} polygon The drawn polygon.
     * @param {OlMap} map An OlMap
     * @param {Boolean} geodesic Is the measurement geodesic
     * @return {String} The formatted area of the polygon.
     */
    static formatArea = (polygon, map, geodesic = true) => {
      const decimalHelper = Math.pow(10, 2);
      let area;

      if (geodesic) {
        const wgs84Sphere = new OlSphere(6378137);
        const sourceProj = map.getView().getProjection();
        const geom = (polygon.clone().transform(
          sourceProj, 'EPSG:4326'));
        const coordinates = geom.getLinearRing(0).getCoordinates();
        area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
      } else {
        area = polygon.getArea();
      }

      let output;
      if (area > 10000) {
        output = (Math.round(area / 1000000 * decimalHelper) /
                decimalHelper) + ' km<sup>2</sup>';
      } else {
        output = (Math.round(area * decimalHelper) / decimalHelper) +
                ' ' + 'm<sup>2</sup>';
      }
      return output;
    }

    /**
     * Determine the angle between two coordinates. The angle will be between
     * -180° and 180°, with 0° being in the east. The angle will increase
     * counter-clockwise.
     *
     * Inspired by http://stackoverflow.com/a/31136507
     *
     * @param {Array<Number>} start The start coordinates of the line with the
     *     x-coordinate being at index `0` and y-coordinate being at index `1`.
     * @param {Array<Number>} end The end coordinates of the line with the
     *     x-coordinate being at index `0` and y-coordinate being at index `1`.
     * @return {Number} the angle in degreees, ranging from -180° to 180°.
     */
    static angle = (start, end) => {
      const dx = start[0] - end[0];
      const dy = start[1] - end[1];
      // range (-PI, PI]
      let theta = Math.atan2(dy, dx);
      // rads to degs, range (-180, 180]
      theta *= 180 / Math.PI;
      return theta;
    }

    /**
     * Determine the angle between two coordinates. The angle will be between
     * 0° and 360°, with 0° being in the east. The angle will increase
     * counter-clockwise.
     *
     * Inspired by http://stackoverflow.com/a/31136507
     *
     * @param {Array<Number>} start The start coordinates of the line with the
     *     x-coordinate being at index `0` and y-coordinate being at index `1`.
     * @param {Array<Number>} end The end coordinates of the line with the
     *     x-coordinate being at index `0` and y-coordinate being at index `1`.
     * @return {Number} the angle in degreees, ranging from 0° and 360°.
     */
    static angle360 = (start, end) => {
      // range (-180, 180]
      let theta = this.angle(start, end);
      if (theta < 0) {
        // range [0, 360)
        theta = 360 + theta;
      }
      return theta;
    }

    /**
     * Given an angle between 0° and 360° this angle returns the exact opposite
     * of the angle, e.g. for 90° you'll get back 270°. This effectively turns
     * the direction of the angle from counter-clockwise to clockwise.
     *
     * @param {Number} angle360 The input angle obtained counter-clockwise.
     * @return {Number} The clockwise angle.
     */
    static makeClockwise = (angle360) => {
      return 360 - angle360;
    }

    /**
     * This methods adds an offset of 90° to an counter-clockwise increasing
     * angle of a line so that the origin (0°) lies at the top (in the north).
     *
     * @param {Number} angle360 The input angle obtained counter-clockwise, with
     *     0° degrees being in the east.
     * @return {Number} The adjusted angle, with 0° being in the north.
     */
    static makeZeroDegreesAtNorth = (angle360) => {
      let corrected = angle360 + 90;
      if (corrected > 360) {
        corrected = corrected - 360;
      }
      return corrected;
    }

    /**
     * Returns the angle of the passed linestring in degrees, with 'N' being the
     * 0°-line and the angle increases in clockwise direction.
     *
     * TODO The angle calculation assumes an unrotated view. We should enhance
     *    this method to (optionally) correct the determined angle by the
     *    rotation of the map.
     *
     * @param {ol.geom.LineString} line The linestring to get the
     *     angle from. As this line is comming from our internal draw
     *     interaction, we know that it will only consist of two points.
     * @return {String} The formatted angle of the line.
     */
    static formatAngle = (line) => {
      let coords = line.getCoordinates();
      const numCoords = coords.length;
      if (numCoords < 2) {
        return '';
      }

      const lastPoint = coords[numCoords - 1];
      const prevPoint = coords[numCoords - 2];
      let angle = MeasureUtil.angle360(prevPoint, lastPoint);

      angle = MeasureUtil.makeZeroDegreesAtNorth(angle);
      angle = MeasureUtil.makeClockwise(angle);
      angle = angle.toFixed(2);

      return angle + '°';
    }

}

export default MeasureUtil;

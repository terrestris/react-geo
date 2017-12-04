'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sphere = require('ol/sphere');

var _sphere2 = _interopRequireDefault(_sphere);

var _proj = require('ol/proj');

var _proj2 = _interopRequireDefault(_proj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class provides some static methods which might be helpful when working
 * with measurements.
 *
 * @class MeasureUtil
 */
var MeasureUtil = function MeasureUtil() {
  _classCallCheck(this, MeasureUtil);
};

MeasureUtil.formatLength = function (line, map, decimalPlacesInToolTips) {
  var geodesic = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var decimalHelper = Math.pow(10, decimalPlacesInToolTips);
  var length = void 0;

  if (geodesic) {
    var wgs84Sphere = new _sphere2.default(6378137);
    var coordinates = line.getCoordinates();
    length = 0;
    var sourceProj = map.getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
      var c1 = _proj2.default.transform(coordinates[i], sourceProj, 'EPSG:4326');
      var c2 = _proj2.default.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
      length += wgs84Sphere.haversineDistance(c1, c2);
    }
  } else {
    length = Math.round(line.getLength() * 100) / 100;
  }

  var output = void 0;
  if (length > 1000) {
    output = Math.round(length / 1000 * decimalHelper) / decimalHelper + ' ' + 'km';
  } else {
    output = Math.round(length * decimalHelper) / decimalHelper + ' m';
  }
  return output;
};

MeasureUtil.formatArea = function (polygon, map, decimalPlacesInToolTips) {
  var geodesic = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var decimalHelper = Math.pow(10, decimalPlacesInToolTips);
  var area = void 0;

  if (geodesic) {
    var wgs84Sphere = new _sphere2.default(6378137);
    var sourceProj = map.getView().getProjection();
    var geom = polygon.clone().transform(sourceProj, 'EPSG:4326');
    var coordinates = geom.getLinearRing(0).getCoordinates();
    area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
  } else {
    area = polygon.getArea();
  }

  var output = void 0;
  if (area > 10000) {
    output = Math.round(area / 1000000 * decimalHelper) / decimalHelper + ' km<sup>2</sup>';
  } else {
    output = Math.round(area * decimalHelper) / decimalHelper + ' ' + 'm<sup>2</sup>';
  }
  return output;
};

MeasureUtil.angle = function (start, end) {
  var dx = start[0] - end[0];
  var dy = start[1] - end[1];
  // range (-PI, PI]
  var theta = Math.atan2(dy, dx);
  // rads to degs, range (-180, 180]
  theta *= 180 / Math.PI;
  return theta;
};

MeasureUtil.angle360 = function (start, end) {
  // range (-180, 180]
  var theta = MeasureUtil.angle(start, end);
  if (theta < 0) {
    // range [0, 360)
    theta = 360 + theta;
  }
  return theta;
};

MeasureUtil.makeClockwise = function (angle360) {
  return 360 - angle360;
};

MeasureUtil.makeZeroDegreesAtNorth = function (angle360) {
  var corrected = angle360 + 90;
  if (corrected > 360) {
    corrected = corrected - 360;
  }
  return corrected;
};

MeasureUtil.formatAngle = function (line) {
  var decimalPlacesInToolTips = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  var coords = line.getCoordinates();
  var numCoords = coords.length;
  if (numCoords < 2) {
    return '';
  }

  var lastPoint = coords[numCoords - 1];
  var prevPoint = coords[numCoords - 2];
  var angle = MeasureUtil.angle360(prevPoint, lastPoint);

  angle = MeasureUtil.makeZeroDegreesAtNorth(angle);
  angle = MeasureUtil.makeClockwise(angle);
  angle = angle.toFixed(decimalPlacesInToolTips);

  return angle + '°';
};

exports.default = MeasureUtil;
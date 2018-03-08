import OlFormatGeoJSON from 'ol/format/geojson';
import {
  polygonToLine,
  union,
  polygonize,
  centroid,
  booleanPointInPolygon,
  buffer,
  segmentEach,
  multiLineString,
  getCoords
} from '@turf/turf';

/**
 * Helper Class for the geospatial analysis.
 *
 * @class GeometryUtil
 */
class GeometryUtil {

  /**
   *
   * @param {ol.Feature} polygonFeat The feature with a polygon geometry to split.
   * @param {ol.Feature} lineFeat The feature with a line geometry to split the
   *                              polygon geometry with.
   * @param {ol.ProjectionLike} epsg The EPSG code of the input features. Default
   *                                  is to EPSG:3857.
   * @param {Number} tolerance The tolerance (in meters) used to find if a line
   *                           vertex is inside the polygon geometry. Default is
   *                           to 10.
   *
   * @return {ol.Feature[]}
   */
  static splitByLine(polygonFeat, lineFeat, epsg = 'EPSG:3857', tolerance = 10) {
    const format = new OlFormatGeoJSON();
    const formatOptions = {
      dataProjection: 'EPSG:4326',
      featureProjection: epsg
    };

    // Convert the input features to turf.js/GeoJSON features while
    // reprojecting them to the internal turf.js projection 'EPSG:4326'.
    const turfPolygon = format.writeFeatureObject(polygonFeat, formatOptions);
    const turfLine = format.writeFeatureObject(lineFeat, formatOptions);

    // Union both geometries to a set of MultiLineStrings.
    const unionGeom = union(polygonToLine(turfPolygon), turfLine);

    // Buffer the input polygon to take great circle (un-)precision
    // into account.
    const bufferedTurfPolygon = buffer(turfPolygon, tolerance, {
      units: 'meters'
    });

    let filteredSegments = [];

    // Iterate over each segment and remove any segment that is not covered by
    // the (buffered) input polygon.
    segmentEach(unionGeom, (currentSegment, featureIndex, multiFeatureIndex) => {
      const segmentCenter = centroid(currentSegment);
      const isSegmentInPolygon = booleanPointInPolygon(segmentCenter, bufferedTurfPolygon);

      if (isSegmentInPolygon) {
        if (!filteredSegments[multiFeatureIndex]) {
          filteredSegments[multiFeatureIndex] = [];
        }

        if (filteredSegments[multiFeatureIndex].length === 0) {
          filteredSegments[multiFeatureIndex].push(
            getCoords(currentSegment)[0],
            getCoords(currentSegment)[1]
          );
        } else {
          filteredSegments[multiFeatureIndex].push(
            getCoords(currentSegment)[1]
          );
        }
      }
    });

    // Rebuild the unioned geometry based in the filtered segments.
    const filteredUnionGeom = multiLineString(filteredSegments);

    // Polygonize the lines.
    const polygonizedUnionGeom = polygonize(filteredUnionGeom);

    // Return as Array of ol.Features.
    return format.readFeatures(polygonizedUnionGeom, formatOptions);
  }

}

export default GeometryUtil;

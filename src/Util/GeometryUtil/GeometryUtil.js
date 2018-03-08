import OlFeature from 'ol/feature';
import OlGeomMultiPolygon from 'ol/geom/multipolygon';
import OlGeomMultiPoint from 'ol/geom/multipoint';
import OlGeomMultiLineString from 'ol/geom/multilinestring';
import OlFormatGeoJSON from 'ol/format/geojson';

import {
  booleanPointInPolygon,
  buffer,
  centroid,
  difference,
  getCoords,
  intersect,
  multiLineString,
  polygonize,
  polygonToLine,
  segmentEach,
  union
} from '@turf/turf';

/**
 * Helper Class for the geospatial analysis.
 *
 * @class GeometryUtil
 */
class GeometryUtil {

  /**
   *
   * @param {ol.feature | ol.geom.Polygon} polygon The polygon geometry to split.
   * @param {ol.feature | ol.geom.LineString} lineFeat The line geometry to split the polygon
   *  geometry with.
   * @param {ol.ProjectionLike} projection The EPSG code of the input features.
   *  Default is to EPSG:3857.
   * @param {Number} tolerance The tolerance (in meters) used to find if a line
   *  vertex is inside the polygon geometry. Default is to 10.
   *
   * @return {ol.Feature[] | ol.geom.Polygon[]}
   */
  static splitByLine(polygon, line, projection = 'EPSG:3857', tolerance = 10) {
    const geoJsonFormat = new OlFormatGeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: projection
    });
    const polygonFeat = polygon instanceof OlFeature ? polygon
      : new OlFeature({
        geometry: polygon
      });
    const lineFeat = line instanceof OlFeature ? line
      : new OlFeature({
        geometry: line
      });

    // Convert the input features to turf.js/GeoJSON features while
    // reprojecting them to the internal turf.js projection 'EPSG:4326'.
    const turfPolygon = geoJsonFormat.writeFeatureObject(polygonFeat);
    const turfLine = geoJsonFormat.writeFeatureObject(lineFeat);

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
    const features = geoJsonFormat.readFeatures(polygonizedUnionGeom);
    if (polygon instanceof OlFeature && line instanceof OlFeature) {
      return features;
    } else {
      return features.map(f => f.getGeometry());
    }
  }

  /**
   * Adds a buffer to a given geometry.
   *
   * @param {ol.geom.Geometry | ol.Feature} geometry The geometry.
   * @param {Integer} buffer The buffer to add in meters.
   * @param {String} projection A projection as EPSG code.
   *
   * @returns {ol.geom.Geometry | ol.Feature} The geometry or feature with the added buffer.
   */
  static addBuffer (geometry, radius = 0, projection = 'EPSG:3857') {
    if (radius === 0) {
      return geometry;
    }
    const geoJsonFormat = new OlFormatGeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: projection
    });
    const geoJson = geometry instanceof OlFeature
      ? geoJsonFormat.writeFeatureObject(geometry)
      : geoJsonFormat.writeGeometryObject(geometry);
    const buffered = buffer(geoJson, radius, {
      units: 'meters'
    });
    if (geometry instanceof OlFeature) {
      return geoJsonFormat.readFeature(buffered);
    } else {
      return geoJsonFormat.readGeometry(buffered.geometry);
    }
  }

  /**
   *
   * @param {ol.geom.Geometry[]} geometries An array of ol.geom.geometries;
   */
  static mergeGeometries(geometries) {
    const geomType = geometries[0].getType();
    let mixedGeometryTypes = false;
    geometries.forEach(geometry => {
      if (geomType !== geometry.getType()) {
        mixedGeometryTypes = true;
      }
    });
    if (mixedGeometryTypes) {
      // Logger.warn('Can not merge mixed geometries into one multigeometry.');
      return undefined;
    }
    let multiGeom;
    let append;
    switch (geomType) {
      case 'Polygon':
        multiGeom = new OlGeomMultiPolygon();
        append = multiGeom.appendPolygon.bind(multiGeom);
        break;
      case 'Point':
        multiGeom = new OlGeomMultiPoint();
        append = multiGeom.appendPoint.bind(multiGeom);
        break;
      case 'LineString':
        multiGeom = new OlGeomMultiLineString();
        append = multiGeom.appendLineString.bind(multiGeom);
        break;
      default:
        return undefined;
    }
    geometries.forEach(geom => append(geom));
    return multiGeom;
  }

  /**
   * Takes two or more polygons and returns a combined polygon.
   *
   * @param {ol.geom.Geometry[] | ol.Feature[]} polygons An array of ol.Feature
   *  or ol.geom.Geomerty instances of type polygon.
   * @param {String} projection A projection as EPSG code.
   * @returns {ol.geom.Geometry | ol.Feature} A Feature or Geometry with the
   * combined area of the polygons.
   */
  static union(polygons, projection = 'EPSG:3857') {
    const geoJsonFormat = new OlFormatGeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: projection
    });
    let invalid = false;
    const geoJsonsFeatures = polygons.map((geometry) => {
      const feature = geometry instanceof OlFeature
        ? geometry
        : new OlFeature({geometry});
      if (feature.getGeometry().getType() !== 'Polygon') {
        invalid = true;
      }
      return geoJsonFormat.writeFeatureObject(feature);
    });
    if (invalid) {
      // Logger.warn('Can only create union of polygons.');
      return undefined;
    }
    const unioned = union(...geoJsonsFeatures);
    const feature = geoJsonFormat.readFeature(unioned);
    if (polygons[0] instanceof OlFeature) {
      return feature;
    } else {
      return feature.getGeometry();
    }
  }

  /**
   * Finds the difference between two polygons by clipping the second polygon from the first.
   *
   * @param {ol.geom.Geometry | ol.Feature} feature An ol.geom.Geoemtry or ol.Feature
   * @param {ol.geom.Geometry | ol.Feature} feature An ol.geom.Geoemtry or ol.Feature
   * @param {String} projection A projection as EPSG code.
   *
   * @returns {ol.geom.Geometry | ol.Feature} A Feature or Geometry with the area
   *  of polygon1 excluding the area of polygon2.
   */
  static difference(polygon1, polygon2, projection = 'EPSG:3857') {
    const geoJsonFormat = new OlFormatGeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: projection
    });
    const feat1 = polygon1 instanceof OlFeature ? polygon1
      : new OlFeature({
        geometry: polygon1
      });
    const feat2 = polygon2 instanceof OlFeature ? polygon2
      : new OlFeature({
        geometry: polygon2
      });
    const geojson1 = geoJsonFormat.writeFeatureObject(feat1);
    const geojson2 = geoJsonFormat.writeFeatureObject(feat2);
    const intersection = difference(geojson1, geojson2);
    const feature = geoJsonFormat.readFeature(intersection);
    if (polygon1 instanceof OlFeature && polygon2 instanceof OlFeature) {
      return feature;
    } else {
      return feature.getGeometry();
    }
  }

  /**
   * Takes two polygons and finds their intersection.
   *
   * @param {ol.geom.Geometry | ol.Feature} feature An ol.geom.Geoemtry or ol.Feature
   * @param {ol.geom.Geometry | ol.Feature} feature An ol.geom.Geoemtry or ol.Feature
   * @param {String} projection A projection as EPSG code.
   *
   * @returns {ol.geom.Geometry | ol.Feature} A Feature or Geometry with the
   * shared area of the two polygons or null if the polygons don't intersect.
   */
  static intersection(polygon1, polygon2, projection = 'EPSG:3857') {
    const geoJsonFormat = new OlFormatGeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: projection
    });
    const feat1 = polygon1 instanceof OlFeature ? polygon1
      : new OlFeature({
        geometry: polygon1
      });
    const feat2 = polygon2 instanceof OlFeature ? polygon2
      : new OlFeature({
        geometry: polygon2
      });
    const geojson1 = geoJsonFormat.writeFeatureObject(feat1);
    const geojson2 = geoJsonFormat.writeFeatureObject(feat2);
    const intersection = intersect(geojson1, geojson2);
    if (!intersection) {
      return null;
    }
    const feature = geoJsonFormat.readFeature(intersection);
    if (polygon1 instanceof OlFeature && polygon2 instanceof OlFeature) {
      return feature;
    } else {
      return feature.getGeometry();
    }
  }

}

export default GeometryUtil;

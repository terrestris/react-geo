import proj4 from 'proj4';
import OlProjection from 'ol/proj';

/**
 * Helper class for ol/proj4 projection handling.
 *
 * @class
 */
export class ProjectionUtil {

  /**
   * Returns an object of (custom) proj4 definitions.
   *
   * @return {Object} The (custom) proj4 definition strings.
   */
  static proj4CrsDefinitions() {
    return {
      'EPSG:25832': '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    };
  }

  /**
   * FeatureCollections returned by the GeoServer may be associated with
   * crs identifiers (e.g. "urn:ogc:def:crs:EPSG::25832") that aren't
   * supported by proj4 and/or ol3 per default. Add appropriate
   * mappings to allow automatic crs detection by ol3 here.
   *
   * @return {Object} The crs mappings.
   */
  static proj4CrsMappings() {
    return {
      'urn:ogc:def:crs:EPSG::3857': 'EPSG:3857',
      'urn:ogc:def:crs:EPSG::25832': 'EPSG:25832'
    };
  }

  /**
   * Registers custom crs definitions to the application.
   */
  static initProj4Definitions() {
    let proj4CrsDefinitions = ProjectionUtil.proj4CrsDefinitions();
    for (let [projCode, projDefinition] of Object.entries(proj4CrsDefinitions)) {
      proj4.defs(projCode, projDefinition);
    }
    OlProjection.setProj4(proj4);
  }

  /**
   * Registers custom crs mappings to allow automatic crs detection by ol3.
   */
  static initProj4DefinitionMappings() {
    let proj4CrsMappings = ProjectionUtil.proj4CrsMappings();
    for (let [aliasProjCode, projCode] of Object.entries(proj4CrsMappings)) {
      proj4.defs(aliasProjCode, proj4.defs(projCode));
    }
  }

}

export default ProjectionUtil;

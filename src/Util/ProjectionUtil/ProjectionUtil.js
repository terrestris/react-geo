import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';

/**
 * Helper class for ol/proj4 projection handling.
 *
 * @class
 */
export class ProjectionUtil {

  /**
   * Registers custom crs definitions to the application.
   *
   * @param {Object} proj4CrsDefinitions The (custom) proj4 definition strings.
   */
  static initProj4Definitions(proj4CrsDefinitions) {
    for (let [projCode, projDefinition] of Object.entries(proj4CrsDefinitions)) {
      proj4.defs(projCode, projDefinition);
    }
    register(proj4);
  }

  /**
   * Registers custom crs mappings to allow automatic crs detection. Sometimes
   * FeatureCollections returned by the GeoServer may be associated with
   * crs identifiers (e.g. "urn:ogc:def:crs:EPSG::25832") that aren't
   * supported by proj4 and/or ol per default. Add appropriate
   * mappings to allow automatic crs detection by ol here.
   *
   * @param {Object} proj4CrsMappings The crs mappings.
   */
  static initProj4DefinitionMappings(proj4CrsMappings) {
    for (let [aliasProjCode, projCode] of Object.entries(proj4CrsMappings)) {
      proj4.defs(aliasProjCode, proj4.defs(projCode));
    }
  }

}

export default ProjectionUtil;

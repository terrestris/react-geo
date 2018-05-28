import OlFormatFilter from 'ol/format/filter';

/**
 * Helper Class for building filters to be used with WFS GetFeature requests.
 *
 * @class WfsFilterUtil
 */
class WfsFilterUtil {

  /**
   * Creates a filter for a given feature type considering configured
   * search attributes, mapped features types to an array of attribute details and the
   * current search term.
   * Currently supports EQUALTO and LIKE filters only, which can be combined with
   * OR filter if searchAttributes array contains multiple values though.
   *
   * @param {String} featureType Name of feature type to be used in filter.
   * @param {String} searchTerm Search value.
   * @param {Object} searchAttributes An object mapping feature types to an array of
   *   attributes that should be searched through.
   * @param {Object} attributeDetails An object mapping feature types to an
   *   array of attribute details.
   * @return {OlFormatFilter} Filter to be used with WFS GetFeature requests.
   * @private
   */
  static createWfsFilter(featureType, searchTerm, searchAttributes, attributeDetails) {

    const attributes = searchAttributes && searchAttributes[featureType];

    if (!attributes) {
      return null;
    }

    const details = attributeDetails && attributeDetails[featureType];
    const propertyFilters = attributes.map(attribute => {
      if (details && details[attribute]) {
        const type = details[attribute].type;
        if (type && (type === 'int' || type === 'number') && searchTerm.match(/[^.\d]/)) {
          return undefined;
        }
        if (details[attribute].exactSearch) {
          return OlFormatFilter.equalTo(attribute, searchTerm, details[attribute].exactSearch);
        } else {
          return OlFormatFilter.like(attribute, `*${searchTerm}*`, '*', '.', '!', details[attribute].matchCase || false);
        }
      } else {
        return OlFormatFilter.like(attribute, `*${searchTerm}*`, '*', '.', '!', false);
      }
    })
      .filter(filter => filter !== undefined);
    if (attributes.length > 1 && Object.keys(propertyFilters).length > 1) {
      return OlFormatFilter.or(...propertyFilters);
    } else {
      return propertyFilters[0];
    }
  }
}

export default WfsFilterUtil;

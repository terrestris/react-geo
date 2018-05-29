import isString from 'lodash/isString.js';

import StringUtil from '../StringUtil/StringUtil';

/**
 * Helper Class for the ol features.
 *
 * @class FeatureUtil
 */
class FeatureUtil {

  /**
   * Returns the featureType name out of a given feature. It assumes that
   * the feature has an ID in the following structure FEATURETYPE.FEATUREID.
   *
   * @param {ol.Feature} feature The feature to obtain the featureType
   *                             name from.
   * @return {String} The (unqualified) name of the featureType or undefined if
   *                  the name could not be picked.
   */
  static getFeatureTypeName(feature) {
    let featureId = feature.getId();
    let featureIdParts = featureId ? featureId.split('.') : featureId;

    return Array.isArray(featureIdParts) ? featureIdParts[0] : undefined;
  }

  /**
   * Resolves the given template string with the given feature attributes, e.g.
   * the template "Size of area is {{AREA_SIZE}} km²" would be to resolved
   * to "Size of area is 1909 km²" (assuming the feature's attribute AREA_SIZE
   * really exists).
   *
   * @param {ol.Feature} feature The feature to get the attributes from.
   * @param {String} template The template string to resolve.
   * @param {String} noValueFoundText The text to apply, if the templated value
   *                                  could not be found, default is to 'n.v.'.
   * @return {String} The resolved template string.
   */
  static resolveAttributeTemplate(feature, template, noValueFoundText = 'n.v.') {
    let attributeTemplatePrefix = '\\{\\{';
    let attributeTemplateSuffix = '\\}\\}';
    let resolved = '';

    // Find any character between two braces (including the braces in the result)
    let regExp = new RegExp(attributeTemplatePrefix + '(.*?)' + attributeTemplateSuffix, 'g');
    let regExpRes = isString(template) ? template.match(regExp) : null;

    // If we have a regex result, it means we found a placeholder in the
    // template and have to replace the placeholder with its appropriate value.
    if (regExpRes) {
      // Iterate over all regex match results and find the proper attribute
      // for the given placeholder, finally set the desired value to the hover.
      // field text
      regExpRes.forEach((res) => {
        // We count every non matching candidate. If this count is equal to
        // the objects length, we assume that there is no match at all and
        // set the output value to the value of "noValueFoundText".
        let noMatchCnt = 0;

        for (let [key, value] of Object.entries(feature.getProperties())) {
          // Remove the suffixes and find the matching attribute column.
          let attributeName = res.slice(2, res.length - 2);

          if (attributeName.toLowerCase() === key.toLowerCase()) {
            template = template.replace(res, value);
            break;
          } else {
            noMatchCnt++;
          }
        }

        // No key match found for this feature (e.g. if key not
        // present or value is null).
        if (noMatchCnt === Object.keys(feature.getProperties()).length) {
          template = template.replace(res, noValueFoundText);
        }
      });
    }

    resolved = template;

    // Fallback if no feature attribute is found.
    if (!resolved) {
      resolved = feature.getId();
    }

    // Replace any HTTP url with an <a> element.
    resolved = StringUtil.urlify(resolved);

    // Replace all newline breaks with a html <br> tag.
    resolved = resolved.replace(/\n/g, '<br>');

    return resolved;
  }
}

export default FeatureUtil;

/**
 * Helper Class for Strings
 */
class StringUtil {

  /**
   * Replaces any occurence of a link-like text with <a> tag.
   *
   * @param {String} text The string context to replace.
   * @return {String} The urlified string.
   */
  static urlify(text) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, `<a href="$1" target="_blank">$1</a>`);
  }

  /**
   * This coerces the value of a string by casting it to the most plausible
   * datatype, guessed by the value itself.
   *
   * @param {String} string The input string to coerce.
   * @return {*} The coerced value.
   */
  static coerce(string) {
    if (!(string instanceof String || typeof string === 'string')) {
      return string;
    }

    const isFloatRegex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;

    if (string.toLowerCase() === 'true') {
      return true;
    } else if (string.toLowerCase() === 'false') {
      return false;
    } else if (isFloatRegex.test(string)) {
      return parseFloat(string);
    } else if (string.startsWith('[')) {
      return JSON.parse(string).map(a => StringUtil.coerce(a));
    } else if (string.startsWith('{')) {
      const parsedObj = JSON.parse(string);
      let coercedObj = {};
      Object.keys(parsedObj).forEach(key => {
        coercedObj[key] = StringUtil.coerce(parsedObj[key]);
      });
      return coercedObj;
    } else {
      return string;
    }
  }

}

export default StringUtil;

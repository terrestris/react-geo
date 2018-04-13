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

  /**
   * Returns a string that is wrapped: every ~`width` chars a space is
   * replaced with the passed `spaceReplacer`.
   *
   * See https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
   *
   * @param {String} str The string to wrap.
   * @param {Number} width The width of a line (number of characters).
   * @param {String} spaceReplacer The string to replace spaces with.
   * @return {String} The 'wrapped' string.
   */
  static stringDivider(str, width, spaceReplacer) {

    let startIndex = 0;
    let stopIndex = width;

    if (str.length > width) {
      let p = width;
      let left;
      let right;
      while (p > 0 && (str[p] !== ' ' && str[p] !== '-')) {
        p--;
      }
      if (p > 0) {
        if (str.substring(p, p + 1) === '-') {
          left = str.substring(0, p + 1);
        } else {
          left = str.substring(0, p);
        }
        right = str.substring(p + 1);
        return left + spaceReplacer + StringUtil.stringDivider(
          right, width, spaceReplacer);
      } else {
        // no whitespace or - found,
        // splitting hard on the width length
        left = str.substring(startIndex, stopIndex + 1) + '-';
        right = str.substring(stopIndex + 1);
        startIndex = stopIndex;
        stopIndex += width;
        return left + spaceReplacer + StringUtil.stringDivider(
          right, width, spaceReplacer);
      }
    }
    return str;
  }

  /**
   * Returns the displayed text of an string with html text.
   *
   * @param {string} htmlString A string containing html.
   * @return {string} The stripped Text.
   */
  static stripHTMLTags(htmlString) {
    let stripped;
    if (DOMParser) {
      // Inspired by https://stackoverflow.com/a/47140708
      const doc = (new DOMParser()).parseFromString(htmlString, 'text/html');
      stripped = doc.body.textContent || '';
    }
    return stripped;
  }
}

export default StringUtil;

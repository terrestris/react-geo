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
}

export default StringUtil;

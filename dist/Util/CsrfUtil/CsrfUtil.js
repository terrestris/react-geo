'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * CSRF Utility methods.
 *
 * Some methods to access the csrf-token information served by spring security.
 *
 * The methods herein assume a certain HTML structure, which is easiest achieved
 * by including a markup like the following in your base HTML file:
 *
 * <meta name="_csrf" content="${_csrf.token}" />
 * <meta name="_csrf_header" content="${_csrf.headerName}" />
 * <meta name="_csrf_parameter_name" content="${_csrf.parameterName}" />
 *
 * @class
 **/
var CsrfUtil = function () {
  function CsrfUtil() {
    _classCallCheck(this, CsrfUtil);
  }

  _createClass(CsrfUtil, null, [{
    key: 'getContentFromMetaTagByName',


    /**
     * @static getContentFromMetaTagByName - Description
     *
     * @param {type} name Description
     *
     * @return {type} Description
     */
    value: function getContentFromMetaTagByName(name) {
      var compiledSelector = (0, _lodash.template)('meta[name="<%= metaTagName %>"]');
      var element = document.querySelector(compiledSelector({ 'metaTagName': name }));
      var content = void 0;
      if (element) {
        content = element.content || '';
      } else {
        var warnTpl = (0, _lodash.template)('Failed to find tag <meta name=<%= metaTagName %> />. Is it ' + ' present in the page DOM?');
        _Logger2.default.warn(warnTpl({ 'metaTagName': name }));
        content = '';
      }
      return content;
    }

    /**
     * Get the CSRF token value.
     *
     * In order for this method to produce reliable output, your base HTML
     * page should contain a `<meta>`-tag in the `<head>` with name
     * `_csrf`. The `content` attribute is best filled from Spring by
     * using this variable: `${_csrf.token}`.
     *
     * @return {String} - the key value, e.g. "741a3b1-221f-4d1d-..." or the
     *     empty string if the meta tag cannot be found.
     */

  }, {
    key: 'getCsrfValue',
    value: function getCsrfValue() {
      var metaName = '_csrf';
      return CsrfUtil.getContentFromMetaTagByName(metaName);
    }

    /**
     * Get the CSRF token key. This can be used if you want to send CSRF
     * tokens as header. If you want to send it using a form parameter, use
     * the method #getParamName instead.
     *
     * In order for this method to produce reliable output, your base HTML
     * page should contain a `<meta>`-tag in the `<head>` with name
     * `_csrf_header`. The `content` attribute is best filled from Spring by
     * using this variable: `${_csrf.headerName}`.
     *
     * @return {String} - the key string, e.g. "X-CSRF-TOKEN" ort the empty
     *     string if the meta tag cannot be found.
     */

  }, {
    key: 'getCsrfHeaderName',
    value: function getCsrfHeaderName() {
      var metaName = '_csrf_header';
      return CsrfUtil.getContentFromMetaTagByName(metaName);
    }

    /**
     * Get the name of the parameter to send when you want to pass CSRF
     * tokens via a form. Alternatively you can use #getKey to get the name
     * of the header to send for CSRF-protection.
     *
     * In order for this method to produce reliable output, your base HTML
     * page should contain a `<meta>`-tag in the `<head>` with name
     * `_csrf_parameter_name`. The `content` attribute is best filled from
     * Spring by using this variable: `${_csrf.parameterName}`.
     *
     * @return {String} The name of the parameter to send when sending CSRF
     *     tokens via forms, e.g. "_csrf" or the empty string if the meta
     *     tag cannot be found.
     */

  }, {
    key: 'getCsrfParameterName',
    value: function getCsrfParameterName() {
      var metaName = '_csrf_parameter_name';
      return CsrfUtil.getContentFromMetaTagByName(metaName);
    }

    /**
     * Get the full CSRF token header object. Can directly be used in fetch, e.g.
     * in the following way:
     *
     * let csrfHeader = CsrfUtil.getHeader();
     *
     * fetch(targetUrl, {
     *   method: 'POST',
     *   headers: csrfHeader
     * })
     *
     * @return {Header} header - the header containing the CSRF key and
     *     value or an empty object if any of the required meta fields
     *     cannot be found.
     */

  }, {
    key: 'getHeader',
    value: function getHeader() {
      var headerObj = new Headers();
      var csrfValue = CsrfUtil.getCsrfValue();
      var csrfHeaderName = CsrfUtil.getCsrfHeaderName();
      if (csrfValue !== '' && csrfHeaderName !== '') {
        headerObj.append(csrfHeaderName, csrfValue);
      }
      return headerObj;
    }

    /**
     * Returns a simple object containing CSRF header name as key and CSRF value
     * as field value
     *
     * @return {Object} Simple object containing the CSRF key and
     *     value or an empty object if any of the required meta fields
     *     cannot be found.
     */

  }, {
    key: 'getHeaderObject',
    value: function getHeaderObject() {
      var headerObj = {};
      var csrfValue = CsrfUtil.getCsrfValue();
      var csrfHeaderName = CsrfUtil.getCsrfHeaderName();
      if (csrfValue !== '' && csrfHeaderName !== '') {
        headerObj[csrfHeaderName] = csrfValue;
      }
      return headerObj;
    }
  }]);

  return CsrfUtil;
}();

exports.default = CsrfUtil;
'use strict';

var _expect = require('expect.js');

var _expect2 = _interopRequireDefault(_expect);

var _lodash = require('lodash');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _CsrfUtil = require('./CsrfUtil');

var _CsrfUtil2 = _interopRequireDefault(_CsrfUtil);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tokenValue = 'my-csrf-token-value'; /*eslint-env mocha*/

var headerName = 'my-csrf-header-name';
var paramName = 'my-csrf-param-name';
var specs = [{
  tag: 'meta',
  name: '_csrf',
  content: tokenValue
}, {
  tag: 'meta',
  name: '_csrf_header',
  content: headerName
}, {
  tag: 'meta',
  name: '_csrf_parameter_name',
  content: paramName
}, {
  tag: 'meta',
  name: 'manta',
  content: 'jurgensohn'
}];

describe('CsrfUtil', function () {
  it('is defined', function () {
    (0, _expect2.default)(_CsrfUtil2.default).not.to.be(undefined);
  });

  describe('Static methods', function () {
    beforeEach(function () {
      // add custom CSRF headers
      specs.forEach(function (spec) {
        var tagElement = document.createElement(spec.tag);
        tagElement.name = spec.name;
        tagElement.content = spec.content;
        document.getElementsByTagName('head')[0].appendChild(tagElement);
      });
    });

    afterEach(function () {
      // remove custom CSRF headers
      specs.forEach(function (spec) {
        var compiledSelector = (0, _lodash.template)('meta[name="<%= metaTagName %>"]');
        var element = document.querySelector(compiledSelector({ 'metaTagName': spec.name }));
        element.parentNode.removeChild(element);
      });
    });

    it('getCsrfValue', function () {
      var result = _CsrfUtil2.default.getCsrfValue();
      (0, _expect2.default)(result).to.be(tokenValue);
    });

    it('getCsrfHeaderName', function () {
      var result = _CsrfUtil2.default.getCsrfHeaderName();
      (0, _expect2.default)(result).to.be(headerName);
    });

    it('getCsrfParameterName', function () {
      var result = _CsrfUtil2.default.getCsrfParameterName();
      (0, _expect2.default)(result).to.be(paramName);
    });

    it('getHeader', function () {
      var result = _CsrfUtil2.default.getHeader();
      (0, _expect2.default)(result).to.be.a(Headers);

      (0, _expect2.default)(result.has(headerName)).to.be(true);
      (0, _expect2.default)(result.get(headerName)).to.be(tokenValue);
    });

    it('getContentFromMetaTagByName', function () {
      var result = _CsrfUtil2.default.getContentFromMetaTagByName('manta');
      (0, _expect2.default)(result).to.be('jurgensohn');
    });

    it('getContentFromMetaTagByName should return warning for unknown meta tag', function () {
      var logSpy = _sinon2.default.spy(_Logger2.default, 'warn');

      var result = _CsrfUtil2.default.getContentFromMetaTagByName('balotelli');
      (0, _expect2.default)(result).to.be('');
      (0, _expect2.default)(logSpy).to.have.property('callCount', 1);

      _Logger2.default.warn.restore();
    });

    it('getContentFromMetaTagByName should return empty content string if content is not present', function () {
      var tagElement = document.createElement('meta');
      var tagName = 'test';
      tagElement.name = tagName;
      tagElement.value = 'test_val';
      document.getElementsByTagName('head')[0].appendChild(tagElement);

      var result = _CsrfUtil2.default.getContentFromMetaTagByName(tagName);
      (0, _expect2.default)(result).to.be('');
    });
  });
});
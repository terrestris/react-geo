/*eslint-env mocha*/
import expect from 'expect.js';
import { template } from 'lodash';
import sinon from 'sinon';

import CsrfUtil from './CsrfUtil';
import Logger from './Logger';

const tokenValue = 'my-csrf-token-value';
const headerName = 'my-csrf-header-name';
const paramName = 'my-csrf-param-name';
const specs = [{
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

describe('CsrfUtil', () => {
  it('is defined', () => {
    expect(CsrfUtil).not.to.be(undefined);
  });

  describe('Static methods', () => {
    beforeEach(() => {
      // add custom CSRF headers
      specs.forEach((spec) => {
        let tagElement = document.createElement(spec.tag);
        tagElement.name = spec.name;
        tagElement.content = spec.content;
        document.getElementsByTagName('head')[0].appendChild(tagElement);
      });
    });

    afterEach(() => {
      // remove custom CSRF headers
      specs.forEach((spec) => {
        let compiledSelector = template('meta[name="<%= metaTagName %>"]');
        let element = document.querySelector(compiledSelector({ 'metaTagName': spec.name }));
        element.parentNode.removeChild(element);
      });
    });

    it('getCsrfValue', () => {
      let result = CsrfUtil.getCsrfValue();
      expect(result).to.be(tokenValue);
    });

    it('getCsrfHeaderName', () => {
      let result = CsrfUtil.getCsrfHeaderName();
      expect(result).to.be(headerName);
    });

    it('getCsrfParameterName', () => {
      let result = CsrfUtil.getCsrfParameterName();
      expect(result).to.be(paramName);
    });

    it('getHeader', () => {
      let result = CsrfUtil.getHeader();
      expect(result).to.be.a(Headers);

      expect(result.has(headerName)).to.be(true);
      expect(result.get(headerName)).to.be(tokenValue);
    });

    it('getContentFromMetaTagByName', () => {
      let result = CsrfUtil.getContentFromMetaTagByName('manta');
      expect(result).to.be('jurgensohn');
    });

    it('getContentFromMetaTagByName should return warning for unknown meta tag', () => {
      const logSpy = sinon.spy(Logger, 'warn');

      let result = CsrfUtil.getContentFromMetaTagByName('balotelli');
      expect(result).to.be('');
      expect(logSpy).to.have.property('callCount', 1);

      Logger.warn.restore();
    });

    it('getContentFromMetaTagByName should return empty content string if content is not present', () => {
      let tagElement = document.createElement('meta');
      const tagName = 'test';
      tagElement.name = tagName;
      tagElement.value = 'test_val';
      document.getElementsByTagName('head')[0].appendChild(tagElement);

      let result = CsrfUtil.getContentFromMetaTagByName(tagName);
      expect(result).to.be('');
    });
  });
});

/*eslint-env jest*/

import template from 'lodash/template.js';

import {
  CsrfUtil,
  Logger
} from '../../index';

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
    expect(CsrfUtil).not.toBeUndefined();
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
      expect(result).toBe(tokenValue);
    });

    it('getCsrfHeaderName', () => {
      let result = CsrfUtil.getCsrfHeaderName();
      expect(result).toBe(headerName);
    });

    it('getCsrfParameterName', () => {
      let result = CsrfUtil.getCsrfParameterName();
      expect(result).toBe(paramName);
    });

    it('getHeader', () => {
      let result = CsrfUtil.getHeader();
      expect(result).toBeInstanceOf(Headers);

      expect(result.has(headerName)).toBe(true);
      expect(result.get(headerName)).toBe(tokenValue);
    });

    it('getHeaderObject', () => {
      const result = CsrfUtil.getHeaderObject();
      const csrfHeaderName = CsrfUtil.getCsrfHeaderName();
      const csrfValue = CsrfUtil.getCsrfValue();

      const keysInObject = Object.keys(result).length;
      expect(keysInObject).toBe(1);

      expect(result[csrfHeaderName]).toBe(csrfValue);
    });

    it('getContentFromMetaTagByName', () => {
      let result = CsrfUtil.getContentFromMetaTagByName('manta');
      expect(result).toBe('jurgensohn');
    });

    it('getContentFromMetaTagByName should return warning for unknown meta tag', () => {
      const logSpy = jest.spyOn(Logger, 'warn');

      let result = CsrfUtil.getContentFromMetaTagByName('balotelli');
      expect(result).toBe('');
      expect(logSpy).toHaveBeenCalled();

      logSpy.mockReset();
      logSpy.mockRestore();
    });

    it('getContentFromMetaTagByName should return empty content string if content is not present', () => {
      let tagElement = document.createElement('meta');
      const tagName = 'test';
      tagElement.name = tagName;
      tagElement.value = 'test_val';
      document.getElementsByTagName('head')[0].appendChild(tagElement);

      let result = CsrfUtil.getContentFromMetaTagByName(tagName);
      expect(result).toBe('');
    });
  });
});

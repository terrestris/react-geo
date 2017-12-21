/*eslint-env jest*/

import URL from 'url-parse';

import {
  UrlUtil
} from '../../index';

describe('UrlUtil', () => {

  describe('Basics', () => {
    it('is defined', () => {
      expect(UrlUtil).toBeDefined();
    });
  });

  describe('Static methods', () => {
    describe('#read', () => {
      it('is defined', () => {
        expect(UrlUtil.read).toBeDefined();
      });
      it('returns an URL object from the given URL string', () => {
        let got = UrlUtil.read('http://borussia.de?bvb=true');
        expect(got).toBeInstanceOf(URL);
      });
    });

    describe('#write', () => {
      it('is defined', () => {
        expect(UrlUtil.write).toBeDefined();
      });
      it('stringifies a given URL object', () => {
        let exp = new URL('http://borussia.de?bvb=true');
        let got = UrlUtil.write(exp);
        expect(got).toBe('http://borussia.de?bvb=true');
      });
    });

    describe('#getBasePath', () => {
      it('is defined', () => {
        expect(UrlUtil.getBasePath).toBeDefined();
      });
      it('returns the base path of a given URL string', () => {
        let got = UrlUtil.getBasePath('http://borussia.de/bvb?bvb=09');
        expect(got).toBe('http://borussia.de/bvb');

        got = UrlUtil.getBasePath('https://borussia.de/bvb?bvb=09');
        expect(got).toBe('https://borussia.de/bvb');

        got = UrlUtil.getBasePath('https://borussia.de?bvb=09');
        expect(got).toBe('https://borussia.de');
      });
    });

    describe('#getQueryParams', () => {
      it('is defined', () => {
        expect(UrlUtil.getQueryParams).toBeDefined();
      });
      it('returns the query parameters of a given URL string as an object', () => {
        let got = UrlUtil.getQueryParams('http://borussia.de/bvb');
        expect(got).toEqual({});

        got = UrlUtil.getQueryParams('http://borussia.de/bvb?bvb=09');
        expect(got).toEqual({
          bvb: '09'
        });

        got = UrlUtil.getQueryParams('http://borussia.de/bvb?bvb=09&shinji=kagawa');
        expect(got).toEqual({
          bvb: '09',
          shinji: 'kagawa'
        });
      });
    });

    describe('#getQueryParam', () => {
      it('is defined', () => {
        expect(UrlUtil.getQueryParam).toBeDefined();
      });
      it('returns the value of the given query param of the provided URL', () => {
        let got = UrlUtil.getQueryParam('http://borussia.de/bvb', 'bvb');
        expect(got).toEqual(undefined);

        got = UrlUtil.getQueryParam('http://borussia.de/bvb?bvb=09', 'bvb');
        expect(got).toEqual('09');

        got = UrlUtil.getQueryParam('http://borussia.de/bvb?bvb=09&shinji=kagawa', 'shinji');
        expect(got).toEqual('kagawa');

        got = UrlUtil.getQueryParam('http://borussia.de/bvb?bvb=19&bvb=09', 'bvb');
        expect(got).toEqual(['19', '09']);
      });
    });

    describe('#joinQueryParams', () => {
      it('is defined', () => {
        expect(UrlUtil.joinQueryParams).toBeDefined();
      });
      it('returns the query parameters of a given URL string as an object', () => {
        let got = UrlUtil.joinQueryParams({
          players: 'Shinji Kagawa,Nuri Sahin'
        }, {
          players: 'Marco Reus'
        }, ['players']);
        expect(got).toEqual({
          players: 'Shinji Kagawa,Nuri Sahin,Marco Reus'
        });
      });
    });

    describe('#hasQueryParam', () => {
      it('is defined', () => {
        expect(UrlUtil.hasQueryParam).toBeDefined();
      });
      it('checks if the provided queryParam is available in the given URL', () => {
        const url = 'http://borussia.de?bvb=true&s04=false';
        let got = UrlUtil.hasQueryParam(url, 'bvb');
        expect(got).toEqual(true);

        got = UrlUtil.hasQueryParam(url, 'BvB');
        expect(got).toEqual(true);

        got = UrlUtil.hasQueryParam(url, 'BVB');
        expect(got).toEqual(true);

        got = UrlUtil.hasQueryParam(url, 'fcb');
        expect(got).toEqual(false);
      });
    });

    describe('#createValidGetCapabilitiesRequest', () => {
      it('is defined', () => {
        expect(UrlUtil.createValidGetCapabilitiesRequest).toBeDefined();
      });
      it('returns a valid GetCapabilities request', () => {
        const validUrl = 'http://borussia.de?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0';

        let got = UrlUtil.createValidGetCapabilitiesRequest('http://borussia.de');
        expect(got).toEqual(validUrl);

        got = UrlUtil.createValidGetCapabilitiesRequest('http://borussia.de?');
        expect(got).toEqual(validUrl);

        got = UrlUtil.createValidGetCapabilitiesRequest('http://borussia.de?VERSION=1.1.0&REQUEST=GetCapabilities');
        expect(got).toEqual('http://borussia.de?REQUEST=GetCapabilities&VERSION=1.1.0&SERVICE=WMS');

        got = UrlUtil.createValidGetCapabilitiesRequest('http://borussia.de?SERVICE=WMS&REQUEST=GetCapabilities', null, '1.1.0');
        expect(got).toEqual('http://borussia.de?REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.1.0');

        got = UrlUtil.createValidGetCapabilitiesRequest('http://borussia.de', 'WFS', '1.1.0');
        expect(got).toEqual('http://borussia.de?SERVICE=WFS&REQUEST=GetCapabilities&VERSION=1.1.0');
      });
    });

    describe('#bundleOgcRequests', () => {
      it('is defined', () => {
        expect(UrlUtil.bundleOgcRequests).toBeDefined();
      });
      it('bundles a set of requests if there are from the same domain', () => {
        let got = UrlUtil.bundleOgcRequests([
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Shinji',
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa'
        ], true);
        expect(got).toEqual(['http://maps.bvb.de?LAYERS=Shinji%2CKagawa&REQUEST=GetFeatureInfo&SERVICE=WMS']);

        got = UrlUtil.bundleOgcRequests([
          'http://maps.bvb.de?LAYERS=Shinji&REQUEST=GetFeatureInfo&SERVICE=WMS',
          'http://maps.bvb.de?LAYERS=Kagawa&REQUEST=GetFeatureInfo&SERVICE=WMS',
          'https://maps.bvb.de?LAYERS=Kagawa&REQUEST=GetFeatureInfo&SERVICE=WMS'
        ], true);
        expect(got).toEqual([
          'http://maps.bvb.de?LAYERS=Shinji%2CKagawa&REQUEST=GetFeatureInfo&SERVICE=WMS',
          'https://maps.bvb.de?LAYERS=Kagawa&REQUEST=GetFeatureInfo&SERVICE=WMS'
        ]);

        got = UrlUtil.bundleOgcRequests([
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Shinji',
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa',
          'https://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa'
        ], true, ['PETER']);
        expect(got).toEqual([
          'http://maps.bvb.de?LAYERS=Shinji&REQUEST=GetFeatureInfo&SERVICE=WMS',
          'https://maps.bvb.de?LAYERS=Kagawa&REQUEST=GetFeatureInfo&SERVICE=WMS'
        ]);

        got = UrlUtil.bundleOgcRequests([
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Shinji',
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa'
        ], false);
        expect(got).toEqual({
          'http://maps.bvb.de': {
            SERVICE: 'WMS',
            REQUEST: 'GetFeatureInfo',
            LAYERS: 'Shinji,Kagawa'
          }
        });
      });
    });

    describe('#objectToRequestString', () => {
      it('is defined', () => {
        expect(UrlUtil.objectToRequestString).toBeDefined();
      });
      it('returns a requestString from an object', () => {
        const requestString = 'LAYER=OSM-WMS&VERSION=1.3.0&SERVICE=WMS&REQUEST=getLegendGraphic&FORMAT=image%2Fpng';
        const params = {
          LAYER: 'OSM-WMS',
          VERSION: '1.3.0',
          SERVICE: 'WMS',
          REQUEST: 'getLegendGraphic',
          FORMAT: 'image/png'
        };
        const got = UrlUtil.objectToRequestString(params);
        expect(got).toBe(requestString);
      });
    });

    describe('#isValid', () => {
      it('is defined', () => {
        expect(UrlUtil.isValid).toBeDefined();
      });
      it('validates the given URL', () => {
        const urls = {
          'http://ows.terrestris.de': true,
          'https://ows.terrestris.de': true,
          'ftp://ows.terrestris.de': true,
          'http://ows.terrestris.de:8080': true,
          'http://ows.terrestris.de?param=key': true,
          'http://ows.terrestris.de?param1=key1&param2=key2': true,
          'http://10.133.7.9': true,
          'bvb://ows.terrestris.de': false,
          'http://foo@example.com/foo?humpty=dumpty': true,
          'http://foo:s3cretP4ssw0rd@example.com/foo?humpty=dumpty': true
        };

        for (const [key, value] of Object.entries(urls)) {
          expect(UrlUtil.isValid(key)).toBe(value);
        }
      });
    });
  });

});

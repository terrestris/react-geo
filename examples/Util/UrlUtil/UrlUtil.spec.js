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

    describe('#bundleOgcRequests', () => {
      it('is defined', () => {
        expect(UrlUtil.bundleOgcRequests).toBeDefined();
      });
      it('bundles a set of requests if there are from the same domain', () => {
        let got = UrlUtil.bundleOgcRequests([
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Shinji',
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa'
        ], true);
        expect(got).toEqual(['http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Shinji%2CKagawa']);

        got = UrlUtil.bundleOgcRequests([
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Shinji',
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa',
          'https://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa'
        ], true);
        expect(got).toEqual([
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Shinji%2CKagawa',
          'https://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa'
        ]);

        got = UrlUtil.bundleOgcRequests([
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Shinji',
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa',
          'https://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa'
        ], true, ['PETER']);
        expect(got).toEqual([
          'http://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Shinji',
          'https://maps.bvb.de?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=Kagawa'
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
  });

});

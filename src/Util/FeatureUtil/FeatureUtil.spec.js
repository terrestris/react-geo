/*eslint-env jest*/

import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';

import {
  FeatureUtil,
} from '../../index';

describe('FeatureUtil', () => {
  let coords;
  let geom;
  let props;
  let feat;
  let featId;

  beforeEach(() => {
    featId = 'BVB.BORUSSIA';
    coords = [1909, 1909];
    geom = new OlGeomPoint({
      coordinates: coords
    });
    props = {
      name: 'Shinji Kagawa',
      address: 'Borsigplatz 9',
      city: 'Dortmund',
      homepage: 'https://www.bvb.de/'
    };
    feat = new OlFeature({
      geometry: geom
    });

    feat.setProperties(props);
    feat.setId(featId);
  });

  describe('Basics', () => {
    it('is defined', () => {
      expect(FeatureUtil).toBeDefined();
    });
  });

  describe('Static methods', () => {
    describe('#getFeatureTypeName', () => {
      it('splits the feature ID at the point character and returns the first part', () => {
        let got = FeatureUtil.getFeatureTypeName(feat);
        expect(got).toBe(featId.split('.')[0]);

        feat.setId('BVB');
        got = FeatureUtil.getFeatureTypeName(feat);
        expect(got).toBe('BVB');
      });

      it('returns undefined if the ID is not set', () => {
        feat.setId(null);
        let got = FeatureUtil.getFeatureTypeName(feat);
        expect(got).toBe(undefined);
      });
    });

    describe('#resolveAttributeTemplate', () => {
      it('resolves the given template string with the feature attributes', () => {
        let template = '{{name}}';
        let got = FeatureUtil.resolveAttributeTemplate(feat, template);
        expect(got).toBe(props.name);

        // It's case insensitive.
        template = '{{NAmE}}';
        got = FeatureUtil.resolveAttributeTemplate(feat, template);
        expect(got).toBe(props.name);

        // It resolves static and non-static content.
        template = 'Contact information: {{name}} {{address}} {{city}}';
        got = FeatureUtil.resolveAttributeTemplate(feat, template);
        expect(got).toBe(`Contact information: ${props.name} ${props.address} ${props.city}`);

        // It doesn't harm the template if not attribute placeholder is given.
        template = 'No attribute template';
        got = FeatureUtil.resolveAttributeTemplate(feat, template);
        expect(got).toBe(template);
      });

      it('wraps an URL occurence with an <a> tag', () => {
        let template = '{{homepage}}';
        let got = FeatureUtil.resolveAttributeTemplate(feat, template);
        expect(got).toBe(`<a href="${props.homepage}" target="_blank">${props.homepage}</a>`);
      });

      it('resolves it with a placeholder if attribute could not be found', () => {
        let template = '{{notAvailable}}';
        let got = FeatureUtil.resolveAttributeTemplate(feat, template);
        expect(got).toBe('n.v.');

        template = '{{name}} {{notAvailable}}';
        got = FeatureUtil.resolveAttributeTemplate(feat, template);
        expect(got).toBe(`${props.name} n.v.`);

        // The placeholder is configurable.
        let notFoundPlaceHolder = '【ツ】';
        template = '{{name}} {{notAvailable}}';
        got = FeatureUtil.resolveAttributeTemplate(feat, template, notFoundPlaceHolder);
        expect(got).toBe(`${props.name} ${notFoundPlaceHolder}`);
      });

      it('returns the id of the feature if no template is given', () => {
        let template = '';
        let got = FeatureUtil.resolveAttributeTemplate(feat, template);
        expect(got).toBe(featId);

        got = FeatureUtil.resolveAttributeTemplate(feat);
        expect(got).toBe(featId);
      });

      it('replaces newline chars with a <br> tag', () => {
        let template = '{{name}} \n {{city}}';
        let got = FeatureUtil.resolveAttributeTemplate(feat, template);
        expect(got).toBe(`${props.name} <br> ${props.city}`);
      });
    });

  });

});

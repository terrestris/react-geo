/*eslint-env jest*/

import {
  WfsFilterUtil,
} from '../../index';

describe('WfsFilterUtil', () => {

  const featureType = 'featureType';
  const stringSearchTerm = 'searchMe';
  const digitSearchTerm = '123';
  let searchAttributes = {
    featureType: []
  };
  let attributeDetails = {
    featureType: {}
  };

  const stringAttr1 = {
    matchCase: false,
    type: 'string',
    exactSearch: false
  };

  const stringAttr2 = {
    matchCase: true,
    type: 'string',
    exactSearch: false
  };

  const numberAttr = {
    matchCase: true,
    type: 'int',
    exactSearch: true
  };

  describe('Basics', () => {
    it('is defined', () => {
      expect(WfsFilterUtil).not.toBeUndefined();
    });
  });

  describe('Static methods', () => {

    afterEach(() => {
      searchAttributes = {
        'featureType': []
      };
      Object.keys(attributeDetails[featureType]).forEach(prop => {
        delete attributeDetails[featureType][prop];
      });
    });

    describe('#createWfsFilter', () => {

      it('is defined', () => {
        expect(WfsFilterUtil.createWfsFilter).toBeDefined();
      });

      it ('returns null if no search attributes for the provided feature type are found', () => {
        searchAttributes = {
          'someAnotherFeatureType': []
        };
        attributeDetails['featureType']['stringAttr1'] = stringAttr1;

        const got = WfsFilterUtil.createWfsFilter(featureType, stringSearchTerm, searchAttributes, attributeDetails);

        expect(got).toBeNull();
      });

      it ('returns simple LIKE filter if only one attribute is provided and exactSearch flag is false', () => {
        searchAttributes[featureType].push('stringAttr1');
        attributeDetails['featureType']['stringAttr1'] = stringAttr1;

        const got = WfsFilterUtil.createWfsFilter(featureType, stringSearchTerm, searchAttributes, attributeDetails);

        expect(got.getTagName()).toBe('PropertyIsLike');
        expect(got.pattern).toEqual(`*${stringSearchTerm}*`);
        expect(got.propertyName).toEqual(searchAttributes[featureType][0]);
      });

      it ('returns simple EQUALTO filter if only one attribute is provided and exactSearch flag is true', () => {
        searchAttributes[featureType].push('numberAttr');
        attributeDetails['featureType']['numberAttr'] = numberAttr;

        const got = WfsFilterUtil.createWfsFilter(featureType, digitSearchTerm, searchAttributes, attributeDetails);

        expect(got.getTagName()).toBe('PropertyIsEqualTo');
        expect(got.expression).toEqual(digitSearchTerm);
        expect(got.propertyName).toEqual(searchAttributes[featureType][0]);
      });

      it ('returns combined OR filter if more than one search attributes are provided', () => {
        searchAttributes[featureType].push(...['stringAttr1', 'stringAttr2']);
        attributeDetails = {
          'featureType': {
            'stringAttr1': stringAttr1,
            'stringAttr2': stringAttr2
          }
        };

        const got = WfsFilterUtil.createWfsFilter(featureType, stringSearchTerm, searchAttributes, attributeDetails);

        expect(got.getTagName()).toBe('Or');
        expect(got.conditions.length).toEqual(searchAttributes[featureType].length);
      });
    });
  });
});

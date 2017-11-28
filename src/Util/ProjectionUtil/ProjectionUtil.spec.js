/*eslint-env jest*/
import sinon from 'sinon';
import proj4 from 'proj4';
import OlProjection from 'ol/proj';

import ProjectionUtil from './ProjectionUtil.js';

describe('ProjectionUtil', () => {

  describe('Basic test', () => {
    it('is defined', () => {
      expect(ProjectionUtil).not.toBeUndefined();
    });
  });

  describe('Static methods', () => {
    describe('#proj4CrsDefinitions', () => {
      it('is defined', () => {
        expect(ProjectionUtil.proj4CrsDefinitions).not.toBeUndefined();
      });
      it('returns an object', () => {
        let got = ProjectionUtil.proj4CrsDefinitions();
        expect(got).toBeInstanceOf(Object);
      });
    });

    describe('#proj4CrsMappings', () => {
      it('is defined', () => {
        expect(ProjectionUtil.proj4CrsMappings).not.toBeUndefined();
      });
      it('returns an object', () => {
        let got = ProjectionUtil.proj4CrsMappings();
        expect(got).toBeInstanceOf(Object);
      });
    });

    describe('#initProj4Definitions', () => {
      it('is defined', () => {
        expect(ProjectionUtil.initProj4Definitions).not.toBeUndefined();
      });
      it('it registers the given CRS definitions in proj4 and ol', () => {
        sinon.stub(ProjectionUtil, 'proj4CrsDefinitions').returns({
          'EPSG:25832': '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        });
        let proj4Spy = sinon.spy(proj4, 'defs');
        let olSpy = sinon.spy(OlProjection, 'setProj4');

        ProjectionUtil.initProj4Definitions();
        expect(proj4Spy).toHaveProperty('callCount', 1);
        expect(olSpy).toHaveProperty('callCount', 1);

        proj4.defs.restore();
        OlProjection.setProj4.restore();
        ProjectionUtil.proj4CrsDefinitions.restore();
      });
    });

    describe('#initProj4DefinitionMappings', () => {
      it('is defined', () => {
        expect(ProjectionUtil.initProj4DefinitionMappings).not.toBeUndefined();
      });
      it('it registers the given CRS mappings in proj4', () => {
        sinon.stub(ProjectionUtil, 'proj4CrsMappings').returns({
          'urn:ogc:def:crs:EPSG::3857': 'EPSG:3857'
        });
        let spy = sinon.spy(proj4, 'defs');

        ProjectionUtil.initProj4DefinitionMappings();
        expect(spy).toHaveProperty('callCount', 2);

        proj4.defs.restore();
        ProjectionUtil.proj4CrsMappings.restore();
      });
    });
  });

});

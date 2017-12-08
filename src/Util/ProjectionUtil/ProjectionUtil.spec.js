/*eslint-env jest*/
import proj4 from 'proj4';
import OlProjection from 'ol/proj';

import ProjectionUtil from './ProjectionUtil.js';

describe('ProjectionUtil', () => {

  const testCrsDefinition = {
    'EPSG:25832': '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
  };

  const testCrsMappings = {
    'urn:ogc:def:crs:EPSG::3857': 'EPSG:3857',
    'urn:ogc:def:crs:EPSG::25832': 'EPSG:25832'
  };

  describe('Basic test', () => {
    it('is defined', () => {
      expect(ProjectionUtil).not.toBeUndefined();
    });
  });

  describe('Static methods', () => {
    describe('#initProj4Definitions', () => {
      it('is defined', () => {
        expect(ProjectionUtil.initProj4Definitions).not.toBeUndefined();
      });
      it('it registers the given CRS definitions in proj4 and ol', () => {
        const proj4Spy = jest.spyOn(proj4, 'defs');
        const olSpy = jest.spyOn(OlProjection, 'setProj4');

        ProjectionUtil.initProj4Definitions(testCrsDefinition);
        expect(proj4Spy).toHaveBeenCalled();
        expect(olSpy).toHaveBeenCalled();

        proj4Spy.mockReset();
        proj4Spy.mockRestore();
        olSpy.mockReset();
        olSpy.mockRestore();

      });
    });

    describe('#initProj4DefinitionMappings', () => {
      it('is defined', () => {
        expect(ProjectionUtil.initProj4DefinitionMappings).not.toBeUndefined();
      });
      it('it registers the given CRS mappings in proj4', () => {
        const proj4Spy = jest.spyOn(proj4, 'defs');

        ProjectionUtil.initProj4DefinitionMappings(testCrsMappings);
        expect(proj4Spy).toHaveBeenCalledTimes(4);

        proj4Spy.mockReset();
        proj4Spy.mockRestore();
      });
    });
  });

});

/*eslint-env mocha*/
import expect from 'expect.js';
import OlDragRotateAndZoom from 'ol/interaction/dragrotateandzoom';
import OlDraw from 'ol/interaction/draw';
import OlLayerTile from 'ol/layer/tile';
import OlSourceTileWMS from 'ol/source/tilewms';
import OlFeature from 'ol/feature';
import OlGeomPoint from 'ol/geom/point';
import OlLayerGroup from 'ol/layer/group';
import sinon from 'sinon';

import TestUtils from './TestUtils.js';
import Logger from './Logger.js';
import MapUtil from './MapUtil.js';

describe('MapUtil', () => {
  const testResolutions = {
    degrees: 0.000004807292355257246,
    m: 0.5345462690925383,
    ft: 1.7537607253692198,
    'us-ft': 1.7537572178477696
  };
  const testScale = 1909.09;

  let map;


  beforeEach(() => {
    map = TestUtils.createMap();
  });

  afterEach(() => {
    TestUtils.removeMap(map);
  });

  it('is defined', () => {
    expect(MapUtil).to.not.be(undefined);
  });

  describe('#getInteractionsByName', () => {
    it('is defined', () => {
      expect(MapUtil.getInteractionsByName).to.not.be(undefined);
    });

    it('needs to be called with a map instance', () => {
      const logSpy = sinon.spy(Logger, 'debug');

      let returnedInteractions = MapUtil.getInteractionsByName(null, 'BVB!');

      expect(logSpy).to.have.property('callCount', 1);
      expect(returnedInteractions).to.have.length(0);

      Logger.debug.restore();
    });

    it('returns an empty array if no interaction candidate is found', () => {
      let dragInteractionName = 'Drag Queen';
      let dragInteraction = new OlDragRotateAndZoom();
      dragInteraction.set('name', dragInteractionName);
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByName(
        map, `${dragInteractionName} NOT AVAILABLE`);

      expect(returnedInteractions).to.have.length(0);
    });

    it('returns the requested interactions by name', () => {
      let dragInteractionName = 'Drag Queen';
      let dragInteraction = new OlDragRotateAndZoom();
      dragInteraction.set('name', dragInteractionName);
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByName(
        map, dragInteractionName);

      expect(returnedInteractions).to.have.length(1);

      let anotherDragInteraction = new OlDragRotateAndZoom();
      anotherDragInteraction.set('name', dragInteractionName);
      map.addInteraction(anotherDragInteraction);

      returnedInteractions = MapUtil.getInteractionsByName(
        map, dragInteractionName);

      expect(returnedInteractions).to.have.length(2);
    });
  });

  describe('#getInteractionsByClass', () => {
    it('is defined', () => {
      expect(MapUtil.getInteractionsByClass).to.not.be(undefined);
    });

    it('needs to be called with a map instance', () => {
      const logSpy = sinon.spy(Logger, 'debug');

      let returnedInteractions = MapUtil.getInteractionsByClass(null, OlDragRotateAndZoom);

      expect(logSpy).to.have.property('callCount', 1);
      expect(returnedInteractions).to.have.length(0);

      Logger.debug.restore();
    });

    it('returns an empty array if no interaction candidate is found', () => {
      let dragInteraction = new OlDragRotateAndZoom();
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByClass(
        map, OlDraw);

      expect(returnedInteractions).to.have.length(0);
    });

    it('returns the requested interactions by class', () => {
      let dragInteraction = new OlDragRotateAndZoom();
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByClass(
        map, OlDragRotateAndZoom);

      expect(returnedInteractions).to.have.length(1);

      let anotherDragInteraction = new OlDragRotateAndZoom();
      map.addInteraction(anotherDragInteraction);

      returnedInteractions = MapUtil.getInteractionsByClass(
        map, OlDragRotateAndZoom);

      expect(returnedInteractions).to.have.length(2);
    });
  });

  describe('#getResolutionForScale', () => {
    it('is defined', () => {
      expect(MapUtil.getResolutionForScale).to.not.be(undefined);
    });

    it('returns expected values for valid units', () => {
      const units = ['degrees', 'm', 'ft', 'us-ft'];
      units.forEach( (unit) => {
        expect(MapUtil.getResolutionForScale(testScale, unit)).to.be(testResolutions[unit]);
      });
    });

    it('returns inverse of getScaleForResolution', () => {
      const unit = 'm';
      const resolutionToTest = 190919.09;
      const calculateScale = MapUtil.getScaleForResolution(resolutionToTest, unit);
      expect(MapUtil.getResolutionForScale(calculateScale, unit)).to.be(resolutionToTest);
    });
  });

  describe('#getScaleForResolution', () => {
    it('is defined', () => {
      expect(MapUtil.getScaleForResolution).to.not.be(undefined);
    });

    it('returns expected values for valid units', () => {
      const units = ['degrees', 'm', 'ft', 'us-ft'];

      /**
       * Helper method to round number to two floating digits
       */
      const roundToTwoDecimals = (num) => (Math.round(num * 100) / 100);

      units.forEach( (unit) => {
        expect(roundToTwoDecimals(MapUtil.getScaleForResolution(testResolutions[unit], unit))).to.be(testScale);
      });
    });

    it('returns inverse of getResolutionForScale', () => {
      const unit = 'm';
      const calculateScale = MapUtil.getResolutionForScale(testScale, unit);
      expect(MapUtil.getScaleForResolution(calculateScale, unit)).to.be(testScale);
    });
  });

  describe('#getLayerByName', () => {
    it('returns the layer by the given name', () => {
      let layerName = 'OSM-WMS';
      let layer = new OlLayerTile({
        visible: false,
        source: new OlSourceTileWMS({
          url: 'http://ows.terrestris.de/osm/service?',
          params: {
            'LAYERS': layerName,
            'TILED': true
          }
        })
      });
      layer.set('key', 'prop');
      map.addLayer(layer);
      let got = MapUtil.getLayerByName(map, layerName);

      expect(got).to.be.a(OlLayerTile);
      expect(got.get('key')).to.equal('prop');
    });

    it('returns undefined if the layer could not be found', () => {
      let layerName = 'OSM-WMS';
      let got = MapUtil.getLayerByName(map, layerName);

      expect(got).to.be(undefined);
    });
  });

  describe('#getLayerByFeature', () => {
    it('returns the layer by the given feature', () => {
      let namespace = 'BVB_NAMESPACE';
      let layerName = 'BVB';
      let qualifiedLayerName = `${namespace}:${layerName}`;

      let featId = `${layerName}.1909`;
      let feat = new OlFeature({
        geometry: new OlGeomPoint({
          coordinates: [1909, 1909]
        })
      });
      feat.setId(featId);

      let layer = new OlLayerTile({
        visible: false,
        source: new OlSourceTileWMS({
          url: 'http://ows.terrestris.de/osm/service?',
          params: {
            'LAYERS': qualifiedLayerName,
            'TILED': true
          }
        })
      });
      layer.set('key', 'prop');
      map.addLayer(layer);
      let got = MapUtil.getLayerByFeature(map, feat, [namespace]);

      expect(got).to.be.a(OlLayerTile);
      expect(got.get('key')).to.equal('prop');
    });

    it('returns undefined if the layer could not be found', () => {
      let namespace = 'BVB_NAMESPACE';
      let layerName = 'BVB';
      let qualifiedLayerName = `${namespace}:${layerName}`;
      let featId = `${layerName}_INVALID.1909`;
      let feat = new OlFeature({
        geometry: new OlGeomPoint({
          coordinates: [1909, 1909]
        })
      });
      feat.setId(featId);

      let layer = new OlLayerTile({
        visible: false,
        source: new OlSourceTileWMS({
          url: 'http://ows.terrestris.de/osm/service?',
          params: {
            'LAYERS': qualifiedLayerName,
            'TILED': true
          }
        })
      });
      map.addLayer(layer);
      let got = MapUtil.getLayerByFeature(map, feat, [namespace]);

      expect(got).to.be(undefined);
    });
  });

  describe('#getLayersByGroup', () => {
    it('returns a flattened array of layers out of a given layergroup', () => {
      let layerGroup = new OlLayerGroup({
        layers: [
          TestUtils.createVectorLayer({name: 'Layer 1'}),
          TestUtils.createVectorLayer({name: 'Layer 2'}),
          new OlLayerGroup({
            layers: [
              TestUtils.createVectorLayer({name: 'Sublayer 1'}),
              TestUtils.createVectorLayer({name: 'Sublayer 2'}),
              new OlLayerGroup({
                layers: [
                  TestUtils.createVectorLayer({name: 'Subsublayer 1'}),
                  TestUtils.createVectorLayer({name: 'Subsublayer 2'}),
                ]
              }),
              TestUtils.createVectorLayer({name: 'Sublayer 3'})
            ]
          }),
          TestUtils.createVectorLayer({name: 'Layer 3'})
        ]
      });

      map.setLayerGroup(layerGroup);
      let got = MapUtil.getLayersByGroup(map, layerGroup);

      expect(got).to.be.an(Array);
      expect(got).to.have.length(8);
    });
  });

  describe('#getMapLayers', () => {
    it('returns all layers of the provided map', () => {
      let layerGroup = new OlLayerGroup({
        layers: [
          TestUtils.createVectorLayer({name: 'Layer 1'}),
          TestUtils.createVectorLayer({name: 'Layer 2'}),
          new OlLayerGroup({
            layers: [
              TestUtils.createVectorLayer({name: 'Sublayer 1'}),
              TestUtils.createVectorLayer({name: 'Sublayer 2'}),
              new OlLayerGroup({
                layers: [
                  TestUtils.createVectorLayer({name: 'Subsublayer 1'}),
                  TestUtils.createVectorLayer({name: 'Subsublayer 2'}),
                ]
              }),
              TestUtils.createVectorLayer({name: 'Sublayer 3'})
            ]
          }),
          TestUtils.createVectorLayer({name: 'Layer 3'})
        ]
      });

      map.setLayerGroup(layerGroup);
      let got = MapUtil.getMapLayers(map);

      expect(got).to.be.an(Array);
      expect(got).to.have.length(8);
    });
  });
});

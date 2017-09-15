/*eslint-env mocha*/
import expect from 'expect.js';
import OlInteractionDragRotateAndZoom from 'ol/interaction/dragrotateandzoom';
import OlInteractionDraw from 'ol/interaction/draw';
import OlLayerTile from 'ol/layer/tile';
import OlSourceTileWMS from 'ol/source/tilewms';
import OlSourceTileJson from 'ol/source/tilejson';
import OlFeature from 'ol/feature';
import OlGeomPoint from 'ol/geom/point';
import OlLayerGroup from 'ol/layer/group';
import sinon from 'sinon';

import TestUtil from '../TestUtil';

import {
  Logger,
  MapUtil,
} from '../../index';

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
    map = TestUtil.createMap();
  });

  afterEach(() => {
    TestUtil.removeMap(map);
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
      let dragInteraction = new OlInteractionDragRotateAndZoom();
      dragInteraction.set('name', dragInteractionName);
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByName(
        map, `${dragInteractionName} NOT AVAILABLE`);

      expect(returnedInteractions).to.have.length(0);
    });

    it('returns the requested interactions by name', () => {
      let dragInteractionName = 'Drag Queen';
      let dragInteraction = new OlInteractionDragRotateAndZoom();
      dragInteraction.set('name', dragInteractionName);
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByName(
        map, dragInteractionName);

      expect(returnedInteractions).to.have.length(1);

      let anotherDragInteraction = new OlInteractionDragRotateAndZoom();
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

      let returnedInteractions = MapUtil.getInteractionsByClass(null, OlInteractionDragRotateAndZoom);

      expect(logSpy).to.have.property('callCount', 1);
      expect(returnedInteractions).to.have.length(0);

      Logger.debug.restore();
    });

    it('returns an empty array if no interaction candidate is found', () => {
      let dragInteraction = new OlInteractionDragRotateAndZoom();
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByClass(
        map, OlInteractionDraw);

      expect(returnedInteractions).to.have.length(0);
    });

    it('returns the requested interactions by class', () => {
      let dragInteraction = new OlInteractionDragRotateAndZoom();
      map.addInteraction(dragInteraction);

      let returnedInteractions = MapUtil.getInteractionsByClass(
        map, OlInteractionDragRotateAndZoom);

      expect(returnedInteractions).to.have.length(1);

      let anotherDragInteraction = new OlInteractionDragRotateAndZoom();
      map.addInteraction(anotherDragInteraction);

      returnedInteractions = MapUtil.getInteractionsByClass(
        map, OlInteractionDragRotateAndZoom);

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
          TestUtil.createVectorLayer({name: 'Layer 1'}),
          TestUtil.createVectorLayer({name: 'Layer 2'}),
          new OlLayerGroup({
            layers: [
              TestUtil.createVectorLayer({name: 'Sublayer 1'}),
              TestUtil.createVectorLayer({name: 'Sublayer 2'}),
              new OlLayerGroup({
                layers: [
                  TestUtil.createVectorLayer({name: 'Subsublayer 1'}),
                  TestUtil.createVectorLayer({name: 'Subsublayer 2'}),
                ]
              }),
              TestUtil.createVectorLayer({name: 'Sublayer 3'})
            ]
          }),
          TestUtil.createVectorLayer({name: 'Layer 3'})
        ]
      });

      map.setLayerGroup(layerGroup);
      let got = MapUtil.getLayersByGroup(map, layerGroup);

      expect(got).to.be.an(Array);
      expect(got).to.have.length(8);
    });
  });

  describe('#getAllLayers', () => {
    let subLayer;
    let nestedLayerGroup;
    let layer1;
    let layer2;
    let layerGroup;

    beforeEach(() => {
      const layerSource1 = new OlSourceTileWMS();
      layer1 = new OlLayerTile({
        name: 'layer1',
        source: layerSource1
      });
      const layerSource2 = new OlSourceTileWMS();
      layer2 = new OlLayerTile({
        name: 'layer2',
        visible: false,
        source: layerSource2
      });
      subLayer = new OlLayerTile({
        name: 'subLayer',
        source: new OlSourceTileWMS()
      });
      nestedLayerGroup = new OlLayerGroup({
        name: 'nestedLayerGroup',
        layers: [subLayer]
      });
      layerGroup = new OlLayerGroup({
        layers: [layer1, layer2, nestedLayerGroup]
      });
      map = TestUtil.createMap();
      map.setLayerGroup(layerGroup);
    });

    it('Logs an error and returns an empty array on invalid argument', () => {
      const logSpy = sinon.spy(Logger, 'error');
      const got = MapUtil.getAllLayers();

      expect(got).to.be.an(Array);
      expect(got).to.have.length(0);
      expect(logSpy).to.have.property('callCount', 1);

      logSpy.restore();
    });

    it('returns a flat list of all layers (map passed)', () => {
      const got = MapUtil.getAllLayers(map);

      expect(got).to.be.an(Array);
      expect(got).to.have.length(4);
      expect(got).to.contain(layer1);
      expect(got).to.contain(layer2);
      expect(got).to.contain(nestedLayerGroup);
      expect(got).to.contain(subLayer);
    });

    it('returns a flat list of all layers (layergroup passed)', () => {
      const got = MapUtil.getAllLayers(nestedLayerGroup);

      expect(got).to.be.an(Array);
      expect(got).to.have.length(1);
      expect(got).to.contain(subLayer);
    });

    it('can be used with a filter', () => {
      const got = MapUtil.getAllLayers(map, l => l.get('name') === 'layer1');

      expect(got).to.be.an(Array);
      expect(got).to.have.length(1);
      expect(got).to.contain(layer1);
    });

  });

  describe('getLayerPositionInfo', () => {
    let subLayer;
    let nestedLayerGroup;
    let layer1;
    let layer2;
    let layerGroup;

    beforeEach(() => {
      const layerSource1 = new OlSourceTileWMS();
      layer1 = new OlLayerTile({
        name: 'layer1',
        source: layerSource1
      });
      const layerSource2 = new OlSourceTileWMS();
      layer2 = new OlLayerTile({
        name: 'layer2',
        visible: false,
        source: layerSource2
      });
      subLayer = new OlLayerTile({
        name: 'subLayer',
        source: new OlSourceTileWMS()
      });
      nestedLayerGroup = new OlLayerGroup({
        name: 'nestedLayerGroup',
        layers: [subLayer]
      });
      layerGroup = new OlLayerGroup({
        layers: [layer1, layer2, nestedLayerGroup]
      });
      map = TestUtil.createMap();
      map.setLayerGroup(layerGroup);
    });

    it('uses the map if second argument is a map', () => {
      const layerPositionInfo = MapUtil.getLayerPositionInfo(layer1, map);

      expect(layerPositionInfo).to.be.eql({
        position: 0,
        groupLayer: layerGroup
      });
    });

    it('uses the layerGroup if given as second argument', () => {
      const layerPositionInfo = MapUtil.getLayerPositionInfo(subLayer, nestedLayerGroup);

      expect(layerPositionInfo).to.be.eql({
        position: 0,
        groupLayer: nestedLayerGroup
      });
    });

    it('works iterative', () => {
      const layerPositionInfo = MapUtil.getLayerPositionInfo(subLayer, map);

      expect(layerPositionInfo).to.be.eql({
        position: 0,
        groupLayer: nestedLayerGroup
      });
    });

  });

  describe('getLegendGraphicUrl', () => {

    let layer1;
    let layer2;

    beforeEach(() => {
      layer1 = new OlLayerTile({
        name: 'OSM-WMS',
        source: new OlSourceTileWMS({
          url: 'https://ows.terrestris.de/osm-gray/service',
          params: {'LAYERS': 'OSM-WMS', 'TILED': true},
          serverType: 'geoserver'
        })
      });
      layer2 = new OlLayerTile({
        name: 'Food insecurity',
        source: new OlSourceTileJson({
          url: 'https://api.tiles.mapbox.com/v3/mapbox.20110804-hoa-foodinsecurity-3month.json?secure',
          crossOrigin: 'anonymous'
        })
      });
    });

    it('logs an error if called without a layer', () => {
      const logSpy = sinon.spy(Logger, 'error');
      const legendUrl = MapUtil.getLegendGraphicUrl();
      expect(legendUrl).to.be(undefined);
      expect(logSpy.calledWith('Invalid input parameter for MapUtil.getLegendGraphicUrl.')).to.be.ok();
      expect(logSpy.calledOnce).to.be.ok();

      logSpy.restore();
    });

    it('logs a warning if called with an unsupported layersource', () => {
      const logSpy = sinon.spy(Logger, 'warn');
      const legendUrl = MapUtil.getLegendGraphicUrl(layer2);
      expect(legendUrl).to.be(undefined);
      expect(logSpy.calledWith('Source of "Food insecurity" is currently not supported by MapUtil.getLegendGraphicUrl.')).to.be.ok();
      expect(logSpy.calledOnce).to.be.ok();
      logSpy.restore();
    });

    it('returns a getLegendGraphicUrl from a given layer', () => {
      const legendUrl = MapUtil.getLegendGraphicUrl(layer1);
      const url = 'https://ows.terrestris.de/osm-gray/service?';
      const layerParam = 'LAYER=OSM-WMS';
      const versionParam = 'VERSION=1.3.0';
      const serviceParam = 'SERVICE=WMS';
      const requestParam = 'REQUEST=getLegendGraphic';
      const formatParam = 'FORMAT=image%2Fpng';

      expect(legendUrl).to.contain(url);
      expect(legendUrl).to.contain(layerParam);
      expect(legendUrl).to.contain(versionParam);
      expect(legendUrl).to.contain(serviceParam);
      expect(legendUrl).to.contain(requestParam);
      expect(legendUrl).to.contain(formatParam);
    });

    it('accepts extraParams for the request', () => {
      const extraParams = {
        HEIGHT: 10,
        WIDTH: 10
      };
      const legendUrl = MapUtil.getLegendGraphicUrl(layer1, extraParams);
      const url = 'https://ows.terrestris.de/osm-gray/service?';
      const layerParam = 'LAYER=OSM-WMS';
      const versionParam = 'VERSION=1.3.0';
      const serviceParam = 'SERVICE=WMS';
      const requestParam = 'REQUEST=getLegendGraphic';
      const formatParam = 'FORMAT=image%2Fpng';
      const heightParam = 'HEIGHT=10';
      const widthParam = 'WIDTH=10';

      expect(legendUrl).to.contain(url);
      expect(legendUrl).to.contain(layerParam);
      expect(legendUrl).to.contain(versionParam);
      expect(legendUrl).to.contain(serviceParam);
      expect(legendUrl).to.contain(requestParam);
      expect(legendUrl).to.contain(formatParam);
      expect(legendUrl).to.contain(heightParam);
      expect(legendUrl).to.contain(widthParam);
    });

  });


});

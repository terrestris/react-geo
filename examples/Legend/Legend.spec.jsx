/*eslint-env mocha*/
import expect from 'expect.js';
// import sinon from 'sinon';

import OlTileLayer from 'ol/layer/tile';
import OlSourceTileWMS from 'ol/source/tilewms';
import OlTileJsonSource from 'ol/source/tilejson';

import Logger from '../Util/Logger.js';
import TestUtils from '../Util/TestUtils';
import MapUtil from '../Util/MapUtil';

import Legend from './Legend.jsx';

describe('<Legend />', () => {
  let layer1;
  let layer2;

  beforeEach(() => {
    layer1 = new OlTileLayer({
      name: 'OSM-WMS',
      source: new OlSourceTileWMS({
        url: 'https://ows.terrestris.de/osm/service',
        params: {'LAYERS': 'OSM-WMS', 'TILED': true},
        serverType: 'geoserver'
      })
    });
    layer2 = new OlTileLayer({
      legendUrl: 'http://www.koeln.de/files/images/Karnevalstrikot_Spieler_270.jpg',
      name: 'Food insecurity',
      source: new OlTileJsonSource({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.20110804-hoa-foodinsecurity-3month.json?secure',
        crossOrigin: 'anonymous'
      })
    });
  });

  it('is defined', () => {
    expect(Legend).not.to.be(undefined);
  });

  it('can be rendered', () => {
    const wrapper = TestUtils.mountComponent(Legend, {layer: layer1});
    expect(wrapper).not.to.be(undefined);
  });

  describe('Legend created with Layer', () => {

    it('takes the legendGraphic from layer.get("legendUrl") if configured', () => {
      const wrapper = TestUtils.mountComponent(Legend, {layer: layer2});
      const img = wrapper.children('img').node;
      expect(img.src).to.eql(layer2.get('legendUrl'));
    });

    it('generates getLegendGraphicUrl if no "legendUrl" configured', () => {
      const wrapper = TestUtils.mountComponent(Legend, {layer: layer1});
      const img = wrapper.children('img').node;
      const legendUrl = MapUtil.getLegendGraphicUrl(layer1);
      expect(img.src).to.eql(legendUrl);
    });

    it('generates getLegendGraphicUrl if no "legendUrl" configured (extraParams)', () => {
      const extraParams = {
        HEIGHT: 400,
        WIDTH: 400,
        LANGUAGE: 'de'
      };
      const wrapper = TestUtils.mountComponent(Legend, {
        layer: layer1,
        extraParams: extraParams
      });
      const img = wrapper.children('img').node;
      const legendUrl = MapUtil.getLegendGraphicUrl(layer1, extraParams);
      expect(img.src).to.eql(legendUrl);
    });

    it('creates an alt attribute corresponding to layername', () => {
      const wrapper = TestUtils.mountComponent(Legend, {layer: layer1});
      const img = wrapper.children('img').node;
      expect(img.alt).to.eql(`${layer1.get('name')} legend`);
    });

  });

});

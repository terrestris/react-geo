/*eslint-env jest*/


import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlSourceTileJson from 'ol/source/TileJSON';

import TestUtil from '../Util/TestUtil';

import { Legend } from '../index';

import MapUtil from '@terrestris/ol-util/src/MapUtil/MapUtil';

describe('<Legend />', () => {
  let layer1;
  let layer2;

  beforeEach(() => {
    layer1 = new OlLayerTile({
      name: 'OSM-WMS',
      source: new OlSourceTileWMS({
        url: 'https://ows.terrestris.de/osm/service',
        params: {'LAYERS': 'OSM-WMS', 'TILED': true},
        serverType: 'geoserver'
      })
    });
    layer2 = new OlLayerTile({
      legendUrl: 'https://www.koeln.de/files/images/Karnevalstrikot_Spieler_270.jpg',
      name: 'Food insecurity',
      source: new OlSourceTileJson({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.20110804-hoa-foodinsecurity-3month.json?secure',
        crossOrigin: 'anonymous'
      })
    });
  });

  it('is defined', () => {
    expect(Legend).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(Legend, {layer: layer1});
    expect(wrapper).not.toBeUndefined();
  });

  describe('Legend created with Layer', () => {

    it('takes the legendGraphic from layer.get("legendUrl") if configured', () => {
      const wrapper = TestUtil.mountComponent(Legend, {layer: layer2});
      const img = wrapper.find('img').getElement();
      expect(img.props.src).toBe(layer2.get('legendUrl'));
    });

    it('generates getLegendGraphicUrl if no "legendUrl" configured', () => {
      const wrapper = TestUtil.mountComponent(Legend, {layer: layer1});
      const img = wrapper.find('img').getElement();
      const legendUrl = MapUtil.getLegendGraphicUrl(layer1);
      expect(img.props.src).toBe(legendUrl);
    });

    it('generates getLegendGraphicUrl if no "legendUrl" configured (extraParams)', () => {
      const extraParams = {
        HEIGHT: 400,
        WIDTH: 400,
        LANGUAGE: 'de'
      };
      const wrapper = TestUtil.mountComponent(Legend, {
        layer: layer1,
        extraParams: extraParams
      });
      const img = wrapper.find('img').getElement();
      const legendUrl = MapUtil.getLegendGraphicUrl(layer1, extraParams);
      expect(img.props.src).toBe(legendUrl);
    });

    it('creates an alt attribute corresponding to layername', () => {
      const wrapper = TestUtil.mountComponent(Legend, {layer: layer1});
      const img = wrapper.find('img').getElement();
      expect(img.props.alt).toBe(`${layer1.get('name')} legend`);
    });

  });

});

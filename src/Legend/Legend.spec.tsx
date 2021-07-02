import { render, screen } from '@testing-library/react';
import * as React from 'react';

import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlSourceTileJson from 'ol/source/TileJSON';

import Legend from './Legend';

import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

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
      name: 'A layer',
      source: new OlSourceTileJson({
        url: 'https://example.org',
        crossOrigin: 'anonymous'
      })
    });
  });

  it('is defined', () => {
    expect(Legend).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<Legend layer={layer2} />);
    expect(container).toBeVisible();
  });

  describe('Legend created with Layer', () => {

    it('takes the legendGraphic from layer.get("legendUrl") if configured', () => {
      render(<Legend layer={layer2} />);
      const image = screen.getByRole('img');
      expect(image).toBeVisible();
      expect(image).toHaveAttribute('src', layer2.get('legendUrl'));
    });

    it('generates getLegendGraphicUrl if no "legendUrl" configured', () => {
      render(<Legend layer={layer1} />);
      const image = screen.getByRole('img');
      const legendUrl = MapUtil.getLegendGraphicUrl(layer1);
      expect(image).toBeVisible();
      expect(image).toHaveAttribute('src', legendUrl);
    });

    it('generates getLegendGraphicUrl if no "legendUrl" configured (extraParams)', () => {
      const extraParams = {
        HEIGHT: 400,
        WIDTH: 400,
        LANGUAGE: 'de'
      };
      render(<Legend layer={layer1} extraParams={extraParams} />);
      const image = screen.getByRole('img');
      const legendUrl = MapUtil.getLegendGraphicUrl(layer1, extraParams);
      expect(image).toBeVisible();
      expect(image).toHaveAttribute('src', legendUrl);
    });

    it('creates an alt attribute corresponding to layername', () => {
      render(<Legend layer={layer1} />);
      const image = screen.getByRole('img');
      expect(image).toBeVisible();
      expect(image).toHaveAttribute('alt', `${layer1.get('name')} legend`);
    });

  });

});

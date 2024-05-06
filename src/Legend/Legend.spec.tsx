import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';
import {
  render,
  screen,
  waitFor
} from '@testing-library/react';
import {
  disableFetchMocks,
  enableFetchMocks,
  FetchMock
} from 'jest-fetch-mock';
import OlLayerImage from 'ol/layer/Image';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import OlSourceTileWMS from 'ol/source/TileWMS';
import * as React from 'react';

import Legend from './Legend';

describe('<Legend />', () => {
  // A yellow (#ffed00) 1 x 1 px full opaque image
  const mockLegend = 'data:image/png;base64,' +
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5bhPwAHzALtznmijAAAAABJRU5ErkJggg==';
  let layer1: OlLayerTile<OlSourceTileWMS>;
  let layer2: OlLayerImage<OlSourceImageWMS>;

  beforeAll(() => {
    enableFetchMocks();
    (window.URL.createObjectURL as jest.Mock) = jest.fn().mockReturnValue(mockLegend);
    (window.URL.revokeObjectURL as jest.Mock) = jest.fn();
  });

  afterAll(() => {
    disableFetchMocks();
    (window.URL.createObjectURL as jest.Mock).mockRestore();
    (window.URL.revokeObjectURL as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    layer1 = new OlLayerTile({
      properties: {
        name: 'OSM-WMS',
      },
      source: new OlSourceTileWMS({
        url: 'https://ows.terrestris.de/osm/service',
        params: {LAYERS: 'OSM-WMS', TILED: true},
        serverType: 'geoserver'
      })
    });
    layer2 = new OlLayerImage({
      properties: {
        name: 'A layer',
        legendUrl: 'https://www.koeln.de/files/images/Karnevalstrikot_Spieler_270.jpg'
      },
      source: new OlSourceImageWMS({
        url: 'https://example.org',
        crossOrigin: 'anonymous'
      })
    });
  });

  afterEach(() => {
    (fetch as FetchMock).mockReset();
  });

  it('is defined', () => {
    expect(Legend).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<Legend layer={layer2} />);
    expect(container).toBeVisible();
  });

  describe('Legend created with Layer', () => {

    it('takes the legendGraphic from layer.get("legendUrl") if configured', async () => {
      (fetch as FetchMock).mockResponse(JSON.stringify(mockLegend));

      render(<Legend layer={layer2} />);
      const image = screen.getByRole('img');
      expect(image).toBeVisible();
      await waitFor(() => {
        expect(image).toHaveAttribute('src', mockLegend);
      });
    });

    it('generates getLegendGraphicUrl if no "legendUrl" configured', async () => {
      (fetch as FetchMock).mockResponse(JSON.stringify(mockLegend));

      render(<Legend layer={layer1} />);
      const image = screen.getByRole('img');
      expect(image).toBeVisible();
      await waitFor(() => {
        expect(image).toHaveAttribute('src', mockLegend);
      });
    });

    it('generates getLegendGraphicUrl if no "legendUrl" configured (extraParams)', async () => {
      (fetch as FetchMock).mockResponse(JSON.stringify(mockLegend));

      const extraParams = {
        HEIGHT: 400,
        WIDTH: 400,
        LANGUAGE: 'de'
      };
      render(<Legend layer={layer1} extraParams={extraParams} />);
      const image = screen.getByRole('img');
      const legendUrl = MapUtil.getLegendGraphicUrl(layer1, extraParams);
      expect(image).toBeVisible();
      expect((fetch as FetchMock)).toHaveBeenCalledWith(legendUrl, {
        headers: undefined
      });
      await waitFor(() => {
        expect(image).toHaveAttribute('src', mockLegend);
      });
    });

    it('creates an alt attribute corresponding to layername', () => {
      render(<Legend layer={layer1} />);
      const image = screen.getByRole('img');
      expect(image).toBeVisible();
      expect(image).toHaveAttribute('alt', `${layer1.get('name')} legend`);
    });
  });

});

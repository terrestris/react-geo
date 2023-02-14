import { render, screen, within } from '@testing-library/react';
import * as React from 'react';

import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import TestUtil from '../../Util/TestUtil';
import MapUtil from '@terrestris/ol-util/dist/MapUtil/MapUtil';

import AddWmsPanel from './AddWmsPanel';
import { click } from '../../Util/electronTestUtils';

describe('<AddWmsPanel />', () => {

  let map;

  const testLayerName = 'OSM-WMS';
  const testLayerTitle = 'OSM-WMS - by terrestris';
  const testLayer = new OlLayerTile({
    visible: false,
    properties: {
      title: testLayerTitle
    },
    source: new OlSourceTileWMS({
      url: 'https://ows.terrestris.de/osm/service?',
      params: {
        LAYERS: testLayerName,
        TILED: true
      }
    })
  });

  const testLayerName2 = 'OSM-WMS 2';
  const testLayerTitle2 = 'OSM-WMS - by terrestris 2';
  const testLayer2 = new OlLayerTile({
    visible: false,
    properties: {
      title: testLayerTitle2
    },
    source: new OlSourceTileWMS({
      url: 'https://ows.terrestris.de/osm/service?',
      params: {
        LAYERS: testLayerName2,
        TILED: true
      }
    })
  });

  const testWmsLayers = [
    testLayer,
    testLayer2
  ];

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  it('is defined', () => {
    expect(AddWmsPanel).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<AddWmsPanel wmsLayers={testWmsLayers} />);
    expect(container).toBeVisible();
  });

  it('shows a list of all available layers', () => {
    render(<AddWmsPanel wmsLayers={testWmsLayers} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeVisible();

    const title = within(dialog).getByText(/add wms layer/i);
    expect(title).toBeVisible();

    const list = within(dialog).getByRole('list');
    expect(list).toBeVisible();

    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);

    expect(items[0]).toHaveTextContent(testLayerTitle);
    expect(items[1]).toHaveTextContent(testLayerTitle2);
  });

  describe('`add all layers` button', () => {
    it('adds all layers to the map', async () => {
      render(<AddWmsPanel map={map} wmsLayers={testWmsLayers} />);

      const addAllLayersButton = screen.getByRole('button', { name: /add all layers/i });
      await click(addAllLayersButton);

      const layers = MapUtil.getLayersByProperty(map, 'title', testLayerTitle);
      expect(layers).toHaveLength(1);
      expect(layers).toContain(testLayer);

      const layers2 = MapUtil.getLayersByProperty(map, 'title', testLayerTitle2);
      expect(layers2).toHaveLength(1);
      expect(layers2).toContain(testLayer2);
    });

    it('passes all layers to `onLayerAddToMap` if provided', async () => {
      const callback = jest.fn();
      render(<AddWmsPanel wmsLayers={testWmsLayers} onLayerAddToMap={callback} />);

      const addAllLayersButton = screen.getByRole('button', { name: /add all layers/i });
      await click(addAllLayersButton);

      expect(callback).toBeCalledWith(testWmsLayers);
    });
  });

  describe('`add selected layers` button', () => {
    it('fires `onSelectedChange`', async () => {
      const callback = jest.fn();
      render(<AddWmsPanel wmsLayers={testWmsLayers} onSelectionChange={callback} />);

      const checkbox = screen.getByRole('checkbox', { name: testLayerTitle });

      await click(checkbox);
      expect(callback).toBeCalledWith([testLayerTitle]);

      await click(checkbox);
      expect(callback).toBeCalledWith([]);
    });

    it('adds selected layers to the map', async () => {
      render(<AddWmsPanel map={map} wmsLayers={testWmsLayers} />);

      const checkbox = screen.getByRole('checkbox', { name: testLayerTitle });

      await click(checkbox);

      const addSelectedLayersButton = screen.getByRole('button', { name: /add selected layers/i });
      await click(addSelectedLayersButton);

      const layers = MapUtil.getLayersByProperty(map, 'title', testLayerTitle);
      expect(layers).toHaveLength(1);
      expect(layers).toContain(testLayer);

      const layers2 = MapUtil.getLayersByProperty(map, 'title', testLayerTitle2);
      expect(layers2).toHaveLength(0);
    });

    it('passes selected layers to `onLayerAddToMap` if provided', async () => {
      const callback = jest.fn();
      render(<AddWmsPanel wmsLayers={testWmsLayers} onLayerAddToMap={callback} />);

      const checkbox = screen.getByRole('checkbox', { name: testLayerTitle });

      await click(checkbox);

      const addSelectedLayersButton = screen.getByRole('button', { name: /add selected layers/i });
      await click(addSelectedLayersButton);

      expect(callback).toBeCalledWith([testLayer]);
    });
  });

  describe('cancel button', () => {
    it('shows no cancel button if no `onCancel` method is provided', () => {
      render(<AddWmsPanel wmsLayers={testWmsLayers} />);
      const onCancelButton = screen.queryByRole('button', { name: /cancel/i });
      expect(onCancelButton).not.toBeInTheDocument();
    });

    it('shows a cancel button if an `onCancel` method is provided and calls it if the button was clicked', async () => {
      const callback = jest.fn();
      render(<AddWmsPanel wmsLayers={testWmsLayers} onCancel={callback} />);

      const onCancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(onCancelButton).toBeInTheDocument();

      await click(onCancelButton);
      expect(callback).toBeCalled();
    });
  });

});

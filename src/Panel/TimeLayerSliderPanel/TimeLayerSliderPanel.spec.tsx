import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceTileWMS from 'ol/source/TileWMS';
import * as React from 'react';

import TestUtil from '../../Util/TestUtil';
import TimeLayerSliderPanel from '../TimeLayerSliderPanel/TimeLayerSliderPanel';

describe('<TimeLayerSliderPanel />', () => {

  let map: OlMap;

  const testLayerName = 'OSM-WMS';
  const testLayerTitle = 'OSM-WMS - by terrestris';
  const testLayer = new OlLayerTile({
    visible: false,
    source: new OlSourceTileWMS({
      url: 'https://ows.terrestris.de/osm/service?',
      params: {
        LAYERS: testLayerName,
        TILED: true
      }
    }),
    properties: {
      title: testLayerTitle
    }
  });

  beforeEach(() => {
    map = TestUtil.createMap();
    map.addLayer(testLayer);
  });

  it('is defined', () => {
    expect(TimeLayerSliderPanel).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<TimeLayerSliderPanel
      min={dayjs().subtract(3, 'hours')}
      max={dayjs()}
      timeAwareLayers={[]}
    />);
    expect(container).toBeVisible();
  });

  it('autoplay button is visible', () => {
    render(<TimeLayerSliderPanel
      min={dayjs().subtract(3, 'hours')}
      max={dayjs()}
      timeAwareLayers={[]}
    />);

    const playButton = screen.getByLabelText('Autoplay');
    expect(playButton).toBeVisible();
  });

  it('autoplay can be toggled', async () => {
    render(<TimeLayerSliderPanel
      min={dayjs().subtract(3, 'hours')}
      max={dayjs()}
      timeAwareLayers={[testLayer]}
    />);

    const playButton = screen.getByLabelText('Autoplay');
    expect(playButton).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(playButton);
    expect(playButton).toHaveAttribute('aria-pressed', 'true');
    expect(playButton).toBeVisible();
  });
});

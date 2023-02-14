import * as React from 'react';
import TestUtil from '../../Util/TestUtil';
import moment from 'moment';
import TimeLayerSliderPanel from '../TimeLayerSliderPanel/TimeLayerSliderPanel';
import { render, screen } from '@testing-library/react';

import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlMap from 'ol/Map';
import { click } from '../../Util/electronTestUtils';

describe('<TimeLayerSliderPanel />', () => {

  let map: OlMap;

  const testLayerName = 'OSM-WMS';
  const testLayerTitle = 'OSM-WMS - by terrestris';
  const testLayer = new OlLayerTile({
    visible: false,
    properties: {
      title: testLayerTitle,
    },
    source: new OlSourceTileWMS({
      url: 'https://ows.terrestris.de/osm/service?',
      params: {
        LAYERS: testLayerName,
        TILED: true
      }
    })
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
      map={map}
      initStartDate={moment().subtract(3, 'hours')}
      initEndDate={moment()}
    />);
    expect(container).toBeVisible();
  });

  it('autoplay button is visible', () => {
    render(<TimeLayerSliderPanel
      map={map}
      initStartDate={moment().subtract(3, 'hours')}
      initEndDate={moment()}
    />);

    const playButton = screen.getByLabelText('Autoplay');
    expect(playButton).toBeVisible();
  });

  it('autoplay can be toggled', async () => {
    render(<TimeLayerSliderPanel
      map={map}
      initStartDate={moment().subtract(3, 'hours')}
      initEndDate={moment()}
      timeAwareLayers={[testLayer]}
    />);

    const playButton = screen.getByLabelText('Autoplay');
    expect(playButton).toHaveAttribute('aria-pressed', 'false');
    await click(playButton);
    expect(playButton).toHaveAttribute('aria-pressed', 'true');
    expect(playButton).toBeVisible();
  });
});

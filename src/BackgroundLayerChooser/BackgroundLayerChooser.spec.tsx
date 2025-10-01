import * as React from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM'
// import TileWMS from 'ol/source/TileWMS';

import {
  renderInMapContext
} from '@terrestris/react-util/dist/Util/rtlTestUtils';

import BackgroundLayerChooser from './BackgroundLayerChooser';
import { act, fireEvent, waitFor } from '@testing-library/react';

describe('<BackGroundLayerChooser />', () => {

  let map: Map;
  let layers: TileLayer[];

  function createLayers() {
    return [
      new TileLayer({
        source: new OSM(),
        properties: {
          name: 'OSM',
          isBackgroundLayer: true
        }
      }),
      new TileLayer({
        source: new OSM(),
        properties: {
          name: 'OSM2',
          isBackgroundLayer: true
        }
      })
    ];
  }

  beforeEach(() => {
    layers = createLayers();
    map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 1
      }),
      layers
    });
  });


  describe('#Basics', () => {
    it('is defined', () => {
      expect(BackgroundLayerChooser).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const { container } = renderInMapContext(
        map,
        <BackgroundLayerChooser
          layers={layers}
          allowEmptyBackground={true}
        />
      );
      expect(container.querySelector('.bg-layer-chooser')).toBeInTheDocument();
    });
  });

  it('shows layer cards when button is clicked', async () => {
    const { container } = renderInMapContext(
      map,
      <BackgroundLayerChooser
        layers={layers}
        allowEmptyBackground={true}
      />
    );
    const btn = container.querySelector('.change-bg-btn');
    await act(async () => {
      btn && fireEvent.click(btn);
    });
    await waitFor(() => {
      expect(container.querySelector('.layer-cards')).toBeInTheDocument();
      expect(container.querySelectorAll('.layer-preview').length).toBeGreaterThan(0);
    });
  });

  it('calls titleRenderer for each layer', async () => {
    const titleRenderer = jest.fn(l => <span>Layer: {l.get('name')}</span>);
    const { container } = renderInMapContext(
      map,
      <BackgroundLayerChooser
        layers={layers}
        allowEmptyBackground={true}
        titleRenderer={titleRenderer}
      />
    );
    const btn = container.querySelector('.change-bg-btn');
    await act(async () => {
      btn && fireEvent.click(btn);
    });
    await waitFor(() => {
      expect(titleRenderer).toHaveBeenCalled();
    });
  });

  it('shows no background option and selects it', async () => {
    const { container } = renderInMapContext(
      map,
      <BackgroundLayerChooser
        layers={layers}
        allowEmptyBackground={true}
        noBackgroundTitle="None"
      />
    );
    const btn = container.querySelector('.change-bg-btn');
    await act(async () => {
      btn && fireEvent.click(btn);
    });
    const noBg = await waitFor(() => container.querySelector('.no-background'));
    expect(noBg).toBeInTheDocument();
    await act(async () => {
      noBg && fireEvent.click(noBg);
    });
    await waitFor(() => {
      expect(container.querySelector('.bg-preview .layer-title')?.textContent).toBe('None');
    });
  });

  it('selects a background layer when preview is clicked', async () => {
    const { container } = renderInMapContext(
      map,
      <BackgroundLayerChooser
        layers={layers}
        allowEmptyBackground={true}
      />
    );
    const btn = container.querySelector('.change-bg-btn');
    await act(async () => {
      btn && fireEvent.click(btn);
    });
    const previews = await waitFor(() => container.querySelectorAll('.layer-preview'));
    expect(previews.length).toBeGreaterThan(0);
    await act(async () => {
      previews[0] && fireEvent.click(previews[0]);
    });
    await waitFor(() => {
      expect(container.querySelector('.bg-preview .layer-title')?.textContent).toBe('OSM');
    });
  });

  it('respects initiallySelectedLayer prop', async () => {
    // Do not set allowEmptyBackground, so 'No Background' is not selected
    const { container } = renderInMapContext(
      map,
      <BackgroundLayerChooser
        layers={layers}
        allowEmptyBackground={false}
        initiallySelectedLayer={layers[1]}
      />
    );
    await waitFor(() => {
      expect(container.querySelector('.bg-preview .layer-title')?.textContent).toBe('OSM2');
    });
  });

  it('filters layers using backgroundLayerFilter', async () => {
    const filter = (l: any) => l.get('name') === 'OSM2';
    const { container } = renderInMapContext(
      map,
      <BackgroundLayerChooser
        layers={layers}
        allowEmptyBackground={false}
        backgroundLayerFilter={filter}
      />
    );
    const btn = container.querySelector('.change-bg-btn');
    await act(async () => {
      btn && fireEvent.click(btn);
    });
    await waitFor(() => {
      // Only OSM2 should be present
      const previews = container.querySelectorAll('.layer-preview');
      expect(previews.length).toBe(1);
      const title = (previews[0] as Element).querySelector('.layer-title')?.textContent;
      expect(title).toBe('OSM2');
    });
  });

});

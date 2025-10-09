import OlLayer from 'ol/layer/Layer';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import OlLayerImage from 'ol/layer/Image';
import OlLayerGroup from 'ol/layer/Group';
import OlSourceImageWMS from 'ol/source/ImageWMS';

import React from 'react';
import { render, fireEvent, screen, waitFor, act, cleanup } from '@testing-library/react';

import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import TestUtil from '../Util/TestUtil';
import BackgroundLayerChooser from './BackgroundLayerChooser';

describe('BackgroundLayerChooser', () => {
  let map: OlMap;
  let layers: OlLayer[];

  beforeEach(() => {
    layers = [
      new OlLayerTile({
        source: new OlSourceOsm()
      }),
      new OlLayerTile({
        source: new OlSourceOsm()
      })
    ];
    layers[0].set('name', 'Layer 1');
    layers[1].set('name', 'Layer 2');
    map = TestUtil.createMap();
    map.addLayer(layers[0]);
    map.addLayer(layers[1]);
  });

  afterEach(() => {
    cleanup();
    map?.dispose();
    layers = [];
  });

  it('renders button and preview', () => {
    const { container } = render(<BackgroundLayerChooser layers={layers as any} />);
    expect(container.querySelector('.bg-layer-chooser')).toBeInTheDocument();
    expect(container.querySelector('.bg-preview')).toBeInTheDocument();
    expect(container.querySelector('#overview-map')).toBeInTheDocument();
  });

  it('selects a layer and updates preview', async () => {
    const { container } = renderInMapContext(map, <BackgroundLayerChooser layers={layers as any} />);
    const btn = container.querySelector('.change-bg-btn');
    await act(async () => {
      btn && fireEvent.click(btn);
    });

    const previews = await waitFor(() => container.querySelectorAll('.bg-preview'));
    await waitFor(() => {
      expect(previews.length).toBeGreaterThan(0);
    });
    await act(async () => {
      previews[0] && fireEvent.click(previews[0]);
    });

    await waitFor(() => {
      expect(container.querySelector('.bg-preview .layer-title')?.textContent).toBe('Layer 1');
    });
  });

  it('uses titleRenderer if provided', () => {
    const titleRenderer = (layer: any) => <span>Custom: {layer.get('name')}</span>;
    render(<BackgroundLayerChooser layers={layers as any} titleRenderer={titleRenderer} />);
    expect(screen.getByText('Custom: Layer 1')).toBeInTheDocument();
  });

  it('shows noBackgroundTitle if provided', async () => {
    const noBackgroundTitle = 'Empty';
    const { container } = render(<BackgroundLayerChooser layers={layers as any} allowEmptyBackground noBackgroundTitle={noBackgroundTitle} />);
    fireEvent.click(container.querySelector('.change-bg-btn') as HTMLElement);
    await waitFor(() => {
      expect(screen.getByText(noBackgroundTitle)).toBeInTheDocument();
    });
  });

  it('handles OlLayerImage as background', async () => {
    const imageLayer = new OlLayerImage({
      source: new OlSourceImageWMS({ url: 'test', params: {} })
    });
    imageLayer.set('name', 'Image Layer');
    render(<BackgroundLayerChooser layers={[imageLayer] as any} />);
    expect(screen.getByText('Image Layer')).toBeInTheDocument();
  });

  it('handles OlLayerGroup as background', async () => {
    const groupLayer = new OlLayerGroup({
      layers: [layers[0], layers[1]]
    });
    groupLayer.set('name', 'Group Layer');
    render(<BackgroundLayerChooser layers={[groupLayer] as any} />);
    expect(screen.getByText('Group Layer')).toBeInTheDocument();
  });

  it('toggles layerOptionsVisible state on button click', async () => {
    const { container } = render(<BackgroundLayerChooser layers={layers as any} />);
    const btn = container.querySelector('.change-bg-btn') as HTMLElement;
    expect(container.querySelector('.layer-cards')).not.toBeInTheDocument();
    fireEvent.click(btn);
    await waitFor(() => {
      expect(container.querySelector('.layer-cards')).toBeInTheDocument();
    });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(container.querySelector('.layer-cards')).not.toBeInTheDocument();
    });
  });

  it('sets selectedLayer to undefined when no background is selected', async () => {
    const { container } = render(<BackgroundLayerChooser layers={layers as any} allowEmptyBackground />);
    fireEvent.click(container.querySelector('.change-bg-btn') as HTMLElement);
    await waitFor(() => {
      const noBgButton = screen.getByText('No Background');
      fireEvent.click(noBgButton);
    });
    await waitFor(() => {
      expect(screen.getAllByText('No Background').length).toBeGreaterThan(0);
    });
  });

  it('filters layers using backgroundLayerFilter', async () => {
    const filter = (l: any) => l.get('name') === 'Layer 2';
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
      const previews = container.querySelectorAll('.layer-preview');
      expect(previews.length).toBe(1);
      const title = (previews[0] as Element).querySelector('.layer-title')?.textContent;
      expect(title).toBe('Layer 2');
    });
  });
});

import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import OlLayerGroup from 'ol/layer/Group';
import OlSourceOsm from 'ol/source/OSM';
import OlMap from 'ol/Map';
import ImageStatic from 'ol/source/ImageStatic';

import TestUtil from '../Util/TestUtil';
import BackgroundLayerPreview from './BackgroundLayerPreview';

describe('BackgroundLayerPreview', () => {
  let map: OlMap;
  let layer: OlLayerTile;

  beforeEach(() => {
    layer = new OlLayerTile({ source: new OlSourceOsm() });
    layer.set('name', 'Test Layer');
    map = TestUtil.createMap();
    map.addLayer(layer);
  });

  it('renders with default props', () => {
    const { container } = render(
      <BackgroundLayerPreview
        layer={layer}
        onClick={jest.fn()}
        backgroundLayerFilter={() => true}
      />
    );
    expect(screen.getByText('Test Layer')).toBeInTheDocument();
    expect(container.querySelector('.map')).toBeInTheDocument();
    expect(container.querySelector('.layer-preview')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    renderInMapContext(map, (
      <BackgroundLayerPreview
        layer={layer}
        onClick={onClick}
        backgroundLayerFilter={() => true}
      />
    ));
    const preview = screen.getByText('Test Layer').closest('.layer-preview')!;
    // ensure React updates are flushed
    act(() => {
      fireEvent.click(preview);
    });
    return waitFor(() => {
      expect(onClick).toHaveBeenCalled();
    });
  });

  it('calls backgroundLayerFilter on mouse events', async () => {
    const filter = jest.fn(() => true);
    renderInMapContext(map, (
      <BackgroundLayerPreview
        layer={layer}
        onClick={jest.fn()}
        backgroundLayerFilter={filter}
      />
    ));
    const preview = screen.getByText('Test Layer').closest('.layer-preview')!;
    act(() => {
      fireEvent.mouseOver(preview);
      fireEvent.mouseLeave(preview);
    });
    await waitFor(() => {
      expect(filter).toHaveBeenCalled();
    });
  });

  it('calls backgroundLayerFilter on focus and keyup Enter (keyboard)', async () => {
    const filter = jest.fn(() => true);
    renderInMapContext(map, (
      <BackgroundLayerPreview
        layer={layer}
        onClick={jest.fn()}
        backgroundLayerFilter={filter}
      />
    ));
    const preview = screen.getByText('Test Layer').closest('.layer-preview') as HTMLElement;
    // simulate keyboard focus and Enter press to trigger update
    act(() => {
      preview.focus();
      fireEvent.keyDown(preview, { key: 'Enter', code: 'Enter' });
      fireEvent.keyUp(preview, { key: 'Enter', code: 'Enter' });
    });
    await waitFor(() => {
      expect(filter).toHaveBeenCalled();
    });
  });

  it('renders the title from layer name', () => {
    const onClick = jest.fn();
    const backgroundLayerFilter = () => true;
    const { getByText } = render(
      <BackgroundLayerPreview
        layer={layer}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
      />
    );
    expect(getByText('Test Layer')).toBeInTheDocument();
  });

  it('renders custom title if titleRenderer is provided', () => {
    render(
      <BackgroundLayerPreview
        layer={layer}
        onClick={jest.fn()}
        backgroundLayerFilter={() => true}
        titleRenderer={l => <span>Custom: {l.get('name')}</span>}
      />
    );
    expect(screen.getByText('Custom: Test Layer')).toBeInTheDocument();
  });

  it('applies selected class if activeLayer matches', () => {
    render(
      <BackgroundLayerPreview
        layer={layer}
        activeLayer={layer}
        onClick={jest.fn()}
        backgroundLayerFilter={() => true}
      />
    );
    expect(screen.getByText('Test Layer').closest('.selected')).toBeInTheDocument();
  });

  it('renders with custom width and height', () => {
    const { container } = render(
      <BackgroundLayerPreview
        layer={layer}
        onClick={jest.fn()}
        backgroundLayerFilter={() => true}
        width={200}
        height={150}
      />
    );
    const mapDiv = container.querySelector('.map');
    expect(mapDiv).toHaveStyle({ width: '200px', height: '150px' });
  });

  it('renders with an Image layer', () => {
    // Use a minimal valid Image source for OlLayerImage
    const layer = new OlLayerImage({
      source: new ImageStatic({
        url: '',
        imageExtent: [0, 0, 1, 1],
        projection: 'EPSG:3857'
      })
    });
    layer.set('name', 'ImageLayer');
    const onClick = jest.fn();
    const backgroundLayerFilter = () => true;
    const { getByText } = render(
      <BackgroundLayerPreview
        layer={layer as any}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
      />
    );
    expect(getByText('ImageLayer')).toBeInTheDocument();
  });

  it('handles backgroundLayerFilter returning false', () => {
    layer = new OlLayerTile({ source: new OlSourceOsm() });
    layer.set('name', 'FilteredOut');
    const onClick = jest.fn();
    const backgroundLayerFilter = () => false;
    const { getByText } = render(
      <BackgroundLayerPreview
        layer={layer as any}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
      />
    );
    expect(getByText('FilteredOut')).toBeInTheDocument();
  });

  it('handles a layer that is not Tile or Image', () => {
    // Use a LayerGroup as a non-Tile/Image layer
    const group = new OlLayerGroup();
    group.set('name', 'GroupLayer');
    const onClick = jest.fn();
    const backgroundLayerFilter = () => true;
    const { getByText } = render(
      <BackgroundLayerPreview
        layer={group as any}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
      />
    );
    expect(getByText('GroupLayer')).toBeInTheDocument();
  });
});

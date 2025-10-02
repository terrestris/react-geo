import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import OlMap from 'ol/Map';

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
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(
      <BackgroundLayerPreview
        layer={layer}
        onClick={onClick}
        backgroundLayerFilter={() => true}
      />
    );
    fireEvent.click(screen.getByText('Test Layer').closest('.layer-preview')!);
    waitFor(() => {
      expect(onClick).toHaveBeenCalled();
    });
  });

  it('calls backgroundLayerFilter on mouse events', () => {
    const filter = jest.fn(() => true);
    render(
      <BackgroundLayerPreview
        layer={layer}
        onClick={jest.fn()}
        backgroundLayerFilter={filter}
      />
    );
    const preview = screen.getByText('Test Layer').closest('.layer-preview')!;
    fireEvent.mouseOver(preview);
    fireEvent.mouseLeave(preview);
    waitFor(() => {
      expect(filter).toHaveBeenCalled();
    });
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
});

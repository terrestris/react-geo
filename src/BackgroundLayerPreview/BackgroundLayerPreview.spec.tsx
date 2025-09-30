import React from 'react';

import { fireEvent } from '@testing-library/react';
import Map from 'ol/Map';
import View from 'ol/View';
import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import '@testing-library/jest-dom';
import BackgroundLayerPreview from './BackgroundLayerPreview';

import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import OlLayerGroup from 'ol/layer/Group';
import OSM from 'ol/source/OSM';
import ImageStatic from 'ol/source/ImageStatic';

describe('BackgroundLayerPreview', () => {

  function createLayer(name = 'Layer', visible = true) {
    const layer = new OlLayerTile({ source: new OSM() });
    layer.set('name', name);
    layer.setVisible(visible);
    return layer;
  }

  function createMap(layers: any[]) {
    return new Map({
      view: new View({ center: [0, 0], zoom: 1 }),
      layers
    });
  }

  it('renders without crashing', () => {
    const layer = createLayer();
    const onClick = jest.fn();
    const backgroundLayerFilter = () => true;
    const map = createMap([layer]);
    renderInMapContext(
      map,
      <BackgroundLayerPreview
        layer={layer}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
      />
    );
    expect(document.querySelector('.layer-preview')).toBeInTheDocument();
  });

  it('renders the title from layer name', () => {
    const layer = createLayer('foo-bar-baz');
    const onClick = jest.fn();
    const backgroundLayerFilter = () => true;
    const map = createMap([layer]);
    const { getByText } = renderInMapContext(
      map,
      <BackgroundLayerPreview
        layer={layer}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
      />
    );
    expect(getByText('foo-bar-baz')).toBeInTheDocument();
  });

  it('renders the title using titleRenderer', () => {
    const layer = createLayer('foo-bar-baz');
    const onClick = jest.fn();
    const backgroundLayerFilter = () => true;
  const titleRenderer = (l: any) => <span>Custom: {l.get('name')}</span>;
    const map = createMap([layer]);
    const { getByText } = renderInMapContext(
      map,
      <BackgroundLayerPreview
        layer={layer}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
        titleRenderer={titleRenderer}
      />
    );
    expect(getByText('Custom: foo-bar-baz')).toBeInTheDocument();
  });

  it('applies selected class if activeLayer matches', () => {
    const layer = createLayer('ActiveLayer');
    const onClick = jest.fn();
    const backgroundLayerFilter = () => true;
    const map = createMap([layer]);
    const { container } = renderInMapContext(
      map,
      <BackgroundLayerPreview
        layer={layer}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
        activeLayer={layer}
      />
    );
    expect(container.querySelector('.layer-preview.selected')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const layer = createLayer('Clickable');
    const onClick = jest.fn();
    const backgroundLayerFilter = () => true;
    const map = createMap([layer]);
    const { container } = renderInMapContext(
      map,
      <BackgroundLayerPreview
        layer={layer}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
      />
    );
    const preview = container.querySelector('.layer-preview');
    fireEvent.click(preview!);
    expect(onClick).toHaveBeenCalled();
  });

  it('handles mouse over and leave events', () => {
    const layer = createLayer('Hoverable');
    const onClick = jest.fn();
    const backgroundLayerFilter = () => true;
    const map = createMap([layer]);
    const { container } = renderInMapContext(
      map,
      <BackgroundLayerPreview
        layer={layer}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
      />
    );
    const preview = container.querySelector('.layer-preview');
    fireEvent.mouseOver(preview!);
    fireEvent.mouseLeave(preview!);
    // No error = pass
    expect(preview).toBeInTheDocument();
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
    const map = createMap([layer as any]);
    const { getByText } = renderInMapContext(
      map,
      <BackgroundLayerPreview
        layer={layer as any}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
      />
    );
    expect(getByText('ImageLayer')).toBeInTheDocument();
  });

  it('handles backgroundLayerFilter returning false', () => {
    const layer = createLayer('FilteredOut');
    const onClick = jest.fn();
    const backgroundLayerFilter = () => false;
    const map = createMap([layer]);
    const { getByText } = renderInMapContext(
      map,
      <BackgroundLayerPreview
        layer={layer}
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
    const map = createMap([group as any]);
    const { getByText } = renderInMapContext(
      map,
      <BackgroundLayerPreview
        layer={group as any}
        onClick={onClick}
        backgroundLayerFilter={backgroundLayerFilter}
      />
    );
    expect(getByText('GroupLayer')).toBeInTheDocument();
  });
});

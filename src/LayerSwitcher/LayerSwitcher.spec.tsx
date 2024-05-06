import { render, screen,within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OlLayer from 'ol/layer/Layer';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import React from 'react';

import TestUtil from '../Util/TestUtil';
import LayerSwitcher from './LayerSwitcher';

describe('<LayerSwitcher />', () => {
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
    map = TestUtil.createMap();
    map.addLayer(layers[0]);
    map.addLayer(layers[1]);
  });

  afterEach(() => {
    map?.dispose();
    layers = [];
  });

  it('is defined', () => {
    expect(LayerSwitcher).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<LayerSwitcher layers={layers} map={map} />);
    expect(container).toBeVisible();
  });

  it('contains map element', () => {
    const { container } = render(<LayerSwitcher layers={layers} map={map} />);
    const mapElement = within(container).getByRole('menu');
    expect(mapElement).toBeVisible();
  });

  it('adds a custom className', () => {
    render(<LayerSwitcher layers={layers} map={map} className="peter" />);
    const firstChild = screen.getByRole('menu');
    expect(firstChild).toHaveClass('peter');
  });

  it('passes style prop', () => {
    render(<LayerSwitcher layers={layers} map={map} style={{
      backgroundColor: 'yellow',
      position: 'inherit'
    }} />);
    const firstChild = screen.getByRole('menu');
    expect(firstChild).toHaveStyle({
      backgroundColor: 'yellow'
    });
    expect(firstChild).toHaveStyle({
      position: 'inherit'
    });
  });

  it('sets all but one layer to invisible', () => {
    render(<LayerSwitcher layers={layers} map={map} />);
    const layer0visibile = layers[0].getVisible();
    const layer1visibile = layers[1].getVisible();
    expect(layer0visibile && layer1visibile).toBe(false);
    expect(layer0visibile || layer1visibile).toBe(true);
  });

  it('switches the visible layer on click', async () => {
    const { container } = render(<LayerSwitcher layers={layers} map={map} />);
    const switcher = within(container).getByRole('button');

    const layer0visible = layers[0].getVisible();
    const layer1visible = layers[1].getVisible();

    await userEvent.click(switcher);

    expect(layers[0].getVisible()).toBe(!layer0visible);
    expect(layers[1].getVisible()).toBe(!layer1visible);
  });

  it('assumes the first provided layer as visible if the initial visibility of all layers is false', () => {
    layers.forEach(l => l.setVisible(false));
    render(<LayerSwitcher layers={layers} map={map} />);
    expect(layers[0].getVisible()).toBeTruthy();
  });

});

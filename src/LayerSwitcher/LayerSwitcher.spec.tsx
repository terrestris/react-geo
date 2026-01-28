import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { screen, within } from '@testing-library/react';
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
    const { container } = renderInMapContext(map, <LayerSwitcher layers={layers} />);
    expect(container).toBeVisible();
  });

  it('contains map element', () => {
    const { container } = renderInMapContext(map, <LayerSwitcher layers={layers} />);
    const mapElement = within(container).getByRole('menu');
    expect(mapElement).toBeVisible();
  });

  it('adds a custom className', () => {
    renderInMapContext(map, <LayerSwitcher layers={layers} className="peter" />);
    const firstChild = screen.getByRole('menu');
    expect(firstChild).toHaveClass('peter');
  });

  it('passes style prop', () => {
    renderInMapContext(map, <LayerSwitcher layers={layers} style={{
      backgroundColor: 'yellow',
      position: 'inherit'
    }} />);
    const firstChild = screen.getByRole('menu');
    expect(firstChild).toHaveStyle({
      "background-color": 'rgb(255, 255, 0)'
    });
    expect(firstChild).toHaveStyle({
      position: 'inherit'
    });
  });

  it('sets all but one layer to invisible', () => {
    renderInMapContext(map, <LayerSwitcher layers={layers} />);
    const layer0visibile = layers[0].getVisible();
    const layer1visibile = layers[1].getVisible();
    expect(layer0visibile && layer1visibile).toBe(false);
    expect(layer0visibile || layer1visibile).toBe(true);
  });

  it('switches the visible layer on click', async () => {
    const { container } = renderInMapContext(map, <LayerSwitcher layers={layers} />);

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    const layerSwitcher = container.querySelector('.react-geo-layer-switcher');

    const switcher = within(layerSwitcher).getByRole('button');

    const layer0visible = layers[0].getVisible();
    const layer1visible = layers[1].getVisible();

    await userEvent.click(switcher);

    expect(layers[0].getVisible()).toBe(!layer0visible);
    expect(layers[1].getVisible()).toBe(!layer1visible);
  });

  it('assumes the first provided layer as visible if the initial visibility of all layers is false', () => {
    layers.forEach(l => l.setVisible(false));
    renderInMapContext(map, <LayerSwitcher layers={layers} />);
    expect(layers[0].getVisible()).toBeTruthy();
  });

  it('switches the visible layer when Enter key is pressed on focused div', async () => {
    const { container } = renderInMapContext(map, <LayerSwitcher layers={layers} />);

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    const layerSwitcher = container.querySelector('.react-geo-layer-switcher');

    const switcher = within(layerSwitcher).getByRole('button');

    const layer0visible = layers[0].getVisible();
    const layer1visible = layers[1].getVisible();

    switcher.focus();
    await userEvent.keyboard('{Enter}');

    expect(layers[0].getVisible()).toBe(!layer0visible);
    expect(layers[1].getVisible()).toBe(!layer1visible);
  });

  it('switches the visible layer when Space key is pressed on focused div', async () => {
    const { container } = renderInMapContext(map, <LayerSwitcher layers={layers} />);

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    const layerSwitcher = container.querySelector('.react-geo-layer-switcher');

    const switcher = within(layerSwitcher).getByRole('button');

    const layer0visible = layers[0].getVisible();
    const layer1visible = layers[1].getVisible();

    switcher.focus();
    await userEvent.keyboard(' ');

    expect(layers[0].getVisible()).toBe(!layer0visible);
    expect(layers[1].getVisible()).toBe(!layer1visible);
  });

});

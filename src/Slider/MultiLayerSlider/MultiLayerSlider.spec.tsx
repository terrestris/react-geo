import { ArrayTwoOrMore } from '@terrestris/base-util/dist/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OlLayerBase from 'ol/layer/Base';
import React from 'react';

import TestUtil from '../../Util/TestUtil';
import MultiLayerSlider from './MultiLayerSlider';

describe('<MultiLayerSlider />', () => {
  let layers: ArrayTwoOrMore<OlLayerBase>;

  beforeEach(() => {
    layers = [
      TestUtil.createVectorLayer({}),
      TestUtil.createVectorLayer({}),
    ];
    layers.push(TestUtil.createVectorLayer({}));
  });

  it('is defined', () => {
    expect(MultiLayerSlider).not.toBeUndefined();
  });

  it('can rendered', () => {
    const { container } = render(
      <MultiLayerSlider
        layers={layers}
      />
    );

    expect(container).toBeVisible();
  });

  it('sets the initial transparency of the layers', () => {
    render(
      <MultiLayerSlider
        layers={layers}
      />
    );
    expect(layers[0].getOpacity()).toBe(1);
    expect(layers[1].getOpacity()).toBe(0);
    expect(layers[2].getOpacity()).toBe(0);
  });

  it('updates the opacity of the layer by setting a transparency value', async () => {
    render(
      <MultiLayerSlider
        layers={layers}
      />
    );

    const mark1 = screen.getByText('Layer 1');

    await userEvent.click(mark1);

    expect(layers[0].getOpacity()).toBe(1);
    expect(layers[1].getOpacity()).toBe(0);
    expect(layers[2].getOpacity()).toBe(0);

    const mark2 = screen.getByText('Layer 2');

    await userEvent.click(mark2);

    expect(layers[0].getOpacity()).toBe(0);
    expect(layers[1].getOpacity()).toBe(1);
    expect(layers[2].getOpacity()).toBe(0);

    const mark3 = screen.getByText('Layer 3');

    await userEvent.click(mark3);

    expect(layers[0].getOpacity()).toBe(0);
    expect(layers[1].getOpacity()).toBe(0);
    expect(layers[2].getOpacity()).toBe(1);
  });

  it('sets the display name for the layer based on the layer property defined by the user', () => {
    layers.forEach((layer, index) => {
      layer.set('name', `Layer Name ${index + 1}`);
      layer.set('title', `Layer Title ${index + 1}`);
    });

    const { rerender } = render(
      <MultiLayerSlider
        layers={layers}
      />
    );

    let mark1 = screen.getByText('Layer Name 1');
    let mark2 = screen.getByText('Layer Name 2');
    let mark3 = screen.getByText('Layer Name 3');

    expect(mark1).toBeVisible();
    expect(mark2).toBeVisible();
    expect(mark3).toBeVisible();

    rerender(
      <MultiLayerSlider
        layers={layers}
        nameProperty="title"
      />
    );

    mark1 = screen.getByText('Layer Title 1');
    mark2 = screen.getByText('Layer Title 2');
    mark3 = screen.getByText('Layer Title 3');

    expect(mark1).toBeVisible();
    expect(mark2).toBeVisible();
    expect(mark3).toBeVisible();

    rerender(
      <MultiLayerSlider
        layers={layers}
        nameProperty="randomProp"
      />
    );

    mark1 = screen.getByText('Layer 1');
    mark2 = screen.getByText('Layer 2');
    mark3 = screen.getByText('Layer 3');

    expect(mark1).toBeVisible();
    expect(mark2).toBeVisible();
    expect(mark3).toBeVisible();
  });
});

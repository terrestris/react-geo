import { render, screen } from '@testing-library/react';
import * as React from 'react';
import userEvent from '@testing-library/user-event';

import TestUtil from '../../Util/TestUtil';
import MultiLayerSlider from './MultiLayerSlider';

describe('<MultiLayerSlider />', () => {
  let layers;

  const repeatKeyboard = (key: string, repeats: number) => {
    for (let i = 0; i < repeats; i++) {
      userEvent.keyboard(key);
    }
  };

  beforeEach(() => {
    layers = [
      TestUtil.createVectorLayer({}),
      TestUtil.createVectorLayer({}),
      TestUtil.createVectorLayer({})
    ];
  });

  it('is defined', () => {
    expect(MultiLayerSlider).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<MultiLayerSlider layers={layers} />);
    expect(container).toBeVisible();
  });

  it('sets the initial transparency of the layers', () => {
    render(<MultiLayerSlider layers={layers} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeVisible();
    expect(layers[0].getOpacity()).toBe(1);
    expect(layers[1].getOpacity()).toBe(0);
    expect(layers[2].getOpacity()).toBe(0);
  });

  it('updates the opacity of the layer by setting a transparency value', () => {
    render(<MultiLayerSlider layers={layers} />);
    const slider = screen.getByRole('slider');
    userEvent.click(slider);
    repeatKeyboard('{arrowright}', 25);

    expect(layers[0].getOpacity()).toBe(0.5);
    expect(layers[1].getOpacity()).toBe(0.5);
    expect(layers[2].getOpacity()).toBe(0);

    repeatKeyboard('{arrowright}', 25);

    expect(layers[0].getOpacity()).toBe(0);
    expect(layers[1].getOpacity()).toBe(1);
    expect(layers[2].getOpacity()).toBe(0);

    repeatKeyboard('{arrowright}', 25);
    expect(layers[0].getOpacity()).toBe(0);
    expect(layers[1].getOpacity()).toBe(0.5);
    expect(layers[2].getOpacity()).toBe(0.5);

    repeatKeyboard('{arrowright}', 25);
    expect(layers[0].getOpacity()).toBe(0);
    expect(layers[1].getOpacity()).toBe(0);
    expect(layers[2].getOpacity()).toBe(1);

    repeatKeyboard('{arrowleft}', 100);
    expect(layers[0].getOpacity()).toBe(1);
    expect(layers[1].getOpacity()).toBe(0);
    expect(layers[2].getOpacity()).toBe(0);
  });

});

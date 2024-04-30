import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OlLayerBase from 'ol/layer/Base';
import React from 'react';

import TestUtil from '../../Util/TestUtil';
import LayerTransparencySlider from './LayerTransparencySlider';

describe('<LayerTransparencySlider />', () => {
  let layer: OlLayerBase;

  beforeEach(() => {
    layer = TestUtil.createVectorLayer({});
  });

  it('can be rendered', () => {
    const { container } = render(
      <LayerTransparencySlider
        layer={layer}
      />
    );

    expect(container).toBeVisible();
  });

  it('sets the initial transparency value of the layer', () => {
    layer.setOpacity(0.09);

    render(
      <LayerTransparencySlider
        layer={layer}
      />
    );

    const slider = screen.getByRole('slider');

    expect(slider).toHaveStyle('left: 91%');
  });

  it('updates the opacity of the layer by providing a transparency value', async () => {
    layer.setOpacity(0);

    render(
      <LayerTransparencySlider
        layer={layer}
        marks={{
          0: 0,
          50: 50,
          100: 100
        }}
      />
    );

    const slider = screen.getByText('50');

    await userEvent.click(slider);

    expect(layer.getOpacity()).toBe(0.5);
  });
});

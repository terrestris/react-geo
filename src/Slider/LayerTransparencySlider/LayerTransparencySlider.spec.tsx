import TestUtil from '../../Util/TestUtil';
import LayerTransparencySlider from './LayerTransparencySlider';

import { render, screen, within } from '@testing-library/react';
import * as React from 'react';
import userEvent from '@testing-library/user-event';

describe('<LayerTransparencySlider />', () => {

  let layer;

  beforeEach(() => {
    layer = TestUtil.createVectorLayer({});
  });

  it('is defined', () => {
    expect(LayerTransparencySlider).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<LayerTransparencySlider layer={layer} />);
    expect(container).toBeVisible();
  });

  it('returns the the transparency of the layer', () => {
    layer.setOpacity(0.09);
    render(<LayerTransparencySlider layer={layer} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeVisible();
    expect(slider).toHaveAttribute('aria-valuenow', '91');
  });

  it('updates the opacity of the layer by providing a transparency value', () => {
    render(<LayerTransparencySlider layer={layer} value={91} />);
    const slider = screen.getByRole('slider');
    userEvent.click(slider);
    userEvent.keyboard('{arrowright}'); // required to update opacity value
    expect(slider).toBeVisible();
    expect(slider).toHaveAttribute('aria-valuenow', '91');
    expect(layer.getOpacity()).toBe(0.08);
  });

});

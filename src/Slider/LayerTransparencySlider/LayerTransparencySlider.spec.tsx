import TestUtil from '../../Util/TestUtil';
import LayerTransparencySlider from './LayerTransparencySlider';

describe('<LayerTransparencySlider />', () => {
  let layer;

  beforeEach(() => {
    layer = TestUtil.createVectorLayer();
  });

  it('is defined', () => {
    expect(LayerTransparencySlider).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const props = {
      layer: layer
    };
    const wrapper = TestUtil.mountComponent(LayerTransparencySlider, props);
    expect(wrapper).not.toBeUndefined();
  });

  it('returns the the transparency of the layer', () => {
    layer.setOpacity(0.09);
    const props = {
      layer: layer
    };

    const wrapper = TestUtil.mountComponent(LayerTransparencySlider, props);
    const transparency = wrapper.instance().getLayerTransparency();
    expect(transparency).toBe(91);
  });

  it('updates the opacity of the layer by providing a transparency value', () => {
    const props = {
      layer: layer
    };
    const wrapper = TestUtil.mountComponent(LayerTransparencySlider, props);

    wrapper.instance().setLayerTransparency(91);
    expect(layer.getOpacity()).toBe(0.09);
  });

  it('uses default format in tooltip if no tipFormatter is provided', () => {
    const props = {
      layer: layer
    };
    const wrapper = TestUtil.mountComponent(LayerTransparencySlider, props);

    const formattedValue = wrapper.instance().tipFormatter(50);
    expect(formattedValue).toBe('50%');
  });
  it('uses provided tipFormatter in tooltip', () => {
    const props = {
      layer: layer,
      valueFormatter: val => `Format: ${val}`
    };
    const wrapper = TestUtil.mountComponent(LayerTransparencySlider, props);

    const formattedValue = wrapper.instance().tipFormatter(50);
    expect(formattedValue).toBe('Format: 50');
  });

});

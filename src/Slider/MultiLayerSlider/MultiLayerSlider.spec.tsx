import TestUtil from '../../Util/TestUtil';
import MultiLayerSlider from './MultiLayerSlider';

describe('<MultiLayerSlider />', () => {
  let layers;

  beforeEach(() => {
    layers = [
      TestUtil.createVectorLayer(),
      TestUtil.createVectorLayer(),
      TestUtil.createVectorLayer()
    ];
  });

  it('is defined', () => {
    expect(MultiLayerSlider).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const props = {
      layers: layers
    };
    const wrapper = TestUtil.mountComponent(MultiLayerSlider, props);
    expect(wrapper).not.toBeUndefined();
  });

  it('sets the initial transparency of the layers', () => {
    const props = {
      layers: layers
    };

    TestUtil.mountComponent(MultiLayerSlider, props);
    expect(layers[0].getOpacity()).toBe(1);
    expect(layers[1].getOpacity()).toBe(0);
    expect(layers[2].getOpacity()).toBe(0);
  });

  it('updates the opacity of the layer by setting a transparency value', () => {
    const props = {
      layers: layers
    };
    const wrapper = TestUtil.mountComponent(MultiLayerSlider, props);

    wrapper.instance().valueUpdated(25);
    expect(layers[0].getOpacity()).toBe(0.5);
    expect(layers[1].getOpacity()).toBe(0.5);
    expect(layers[2].getOpacity()).toBe(0);

    wrapper.instance().valueUpdated(50);
    expect(layers[0].getOpacity()).toBe(0);
    expect(layers[1].getOpacity()).toBe(1);
    expect(layers[2].getOpacity()).toBe(0);

    wrapper.instance().valueUpdated(75);
    expect(layers[0].getOpacity()).toBe(0);
    expect(layers[1].getOpacity()).toBe(0.5);
    expect(layers[2].getOpacity()).toBe(0.5);

    wrapper.instance().valueUpdated(100);
    expect(layers[0].getOpacity()).toBe(0);
    expect(layers[1].getOpacity()).toBe(0);
    expect(layers[2].getOpacity()).toBe(1);

    wrapper.instance().valueUpdated(0);
    expect(layers[0].getOpacity()).toBe(1);
    expect(layers[1].getOpacity()).toBe(0);
    expect(layers[2].getOpacity()).toBe(0);
  });

});

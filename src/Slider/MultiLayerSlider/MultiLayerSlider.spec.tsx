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

  it.only('sets the display name for the layer based on the layer property defined by the user', () => {
    layers.forEach((layer, index) => {
      layer.set('name', `Layer Name ${index + 1}`);
      layer.set('title', `Layer Title ${index + 1}`);
    });

    const props = {
      layers: layers,
    };

    // if nothing is defined, it should get the layer name 
    const wrapper = TestUtil.mountComponent(MultiLayerSlider, props);

    const expectedMarksWithNameProperty = { '0': 'Layer Name 1', '50': 'Layer Name 2', '100': 'Layer Name 3' };
    const expectedMarksWithTitleProperty = { '0': 'Layer Title 1', '50': 'Layer Title 2', '100': 'Layer Title 3' };
    const expectedMarksWithoutProperty = { '0': 'Layer 1', '50': 'Layer 2', '100': 'Layer 3' };

    expect(wrapper.instance().getMarks()).toEqual(expectedMarksWithNameProperty);
    expect(wrapper.instance().formatTip(0)).toEqual('Layer Name 1 100%');

    wrapper.setProps({ ...props, nameProperty: 'title' });
    expect(wrapper.instance().getMarks()).toEqual(expectedMarksWithTitleProperty);
    expect(wrapper.instance().formatTip(0)).toEqual('Layer Title 1 100%');

    wrapper.setProps({ ...props, nameProperty: 'name' });
    expect(wrapper.instance().getMarks()).toEqual(expectedMarksWithNameProperty);
    expect(wrapper.instance().formatTip(0)).toEqual('Layer Name 1 100%');

    wrapper.setProps({ ...props, nameProperty: 'randomProp' });
    expect(wrapper.instance().getMarks()).toEqual(expectedMarksWithoutProperty);
    expect(wrapper.instance().formatTip(0)).toEqual('Layer 1 100%');

  });
});

import TestUtil from '../Util/TestUtil';

import LayerSwitcher from './LayerSwitcher';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceStamen from 'ol/source/Stamen';
import OlSourceOsm from 'ol/source/OSM';

const fakeEvent = {
  stopPropagation: () => undefined
};

describe('<LayerSwitcher />', () => {
  let wrapper;
  let map;
  let layers;

  beforeEach(() => {
    layers = [
      new OlLayerTile({
        name: 'OSM',
        source: new OlSourceOsm()
      }),
      new OlLayerTile({
        name: 'Stamen',
        source: new OlSourceStamen({
          layer: 'watercolor'
        })
      }),
    ];
    map = TestUtil.createMap();
    map.addLayer(layers[0]);
    map.addLayer(layers[1]);
    const props = {
      map: map,
      layers: layers
    };
    wrapper = TestUtil.mountComponent(LayerSwitcher, props);
  });

  afterEach(() => {
    TestUtil.removeMap(map);
    layers = null;
    map = null;
  });

  it('is defined', () => {
    expect(LayerSwitcher).not.toBeUndefined();
  });

  it('can be rendered', () => {
    expect(wrapper).not.toBeUndefined();
  });

  it('contains map element', () => {
    const mapElement = wrapper.find('div#layer-switcher-map');
    expect(mapElement).not.toBeUndefined();
  });

  it('adds a custom className', () => {
    const props = {
      className: 'peter',
      map: map,
      layers: layers
    };
    wrapper = TestUtil.mountComponent(LayerSwitcher, props);
    const elementClass = wrapper.find('div').get(0).props.className;
    expect(elementClass).toContain('peter');
    expect(elementClass).toContain(wrapper.instance()._className);
  });

  it('passes style prop', () => {
    const props = {
      style: {
        backgroundColor: 'yellow',
        position: 'inherit'
      },
      map: map,
      layers: layers
    };
    wrapper = TestUtil.mountComponent(LayerSwitcher, props);
    expect(wrapper.getDOMNode()).toHaveStyle('backgroundColor: yellow');
    expect(wrapper.getDOMNode()).toHaveStyle('position: inherit');
  });

  it('sets all but one layer to invisible', () => {
    const layer0visibile = layers[0].getVisible();
    const layer1visibile = layers[1].getVisible();
    expect(layer0visibile && layer1visibile).toBe(false);
    expect(layer0visibile || layer1visibile).toBe(true);
  });

  it('switches the visible layer on click', () => {
    const instance = wrapper.instance();
    const layer0visibile = layers[0].getVisible();
    const layer1visibile = layers[1].getVisible();
    instance.onSwitcherClick(fakeEvent);
    expect(layers[0].getVisible()).toBe(!layer0visibile);
    expect(layers[1].getVisible()).toBe(!layer1visibile);
  });

});

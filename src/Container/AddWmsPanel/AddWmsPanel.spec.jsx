/*eslint-env jest*/
import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import { AddWmsPanel, SimpleButton } from '../../index';
import TestUtil from '../../Util/TestUtil';

describe('<AddWmsPanel />', () => {

  const testLayerName = 'OSM-WMS';
  const testLayerTitle = 'OSM-WMS - by terrestris';
  const testLayer = new OlLayerTile({
    visible: false,
    title: testLayerTitle,
    source: new OlSourceTileWMS({
      url: 'https://ows.terrestris.de/osm/service?',
      params: {
        'LAYERS': testLayerName,
        'TILED': true
      }
    })
  });

  const testLayerName2 = 'OSM-WMS 2';
  const testLayerTitle2 = 'OSM-WMS - by terrestris 2';
  const testLayer2 = new OlLayerTile({
    visible: false,
    title: testLayerTitle2,
    source: new OlSourceTileWMS({
      url: 'https://ows.terrestris.de/osm/service?',
      params: {
        'LAYERS': testLayerName2,
        'TILED': true
      }
    })
  });

  const testWmsLayers = [
    testLayer,
    testLayer2
  ];

  it('is defined', () => {
    expect(AddWmsPanel).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(AddWmsPanel, {
      wmsLayers: testWmsLayers
    });
    expect(wrapper).not.toBeUndefined();
  });

  it('updates state on onSelectedLayersChange', () => {
    const wrapper = TestUtil.mountComponent(AddWmsPanel, {
      wmsLayers: testWmsLayers
    });
    const titles = testWmsLayers.map(layer => layer.Title);
    wrapper.instance().onSelectedLayersChange(titles);
    const state = wrapper.state();
    expect(state.selectedWmsLayers).toBe(titles);
  });

  it('passes all wmsLayers to onLayerAddToMap if onAddAllLayers is called', () => {
    const onLayerAddToMapMock = jest.fn();
    const wrapper = TestUtil.mountComponent(AddWmsPanel, {
      wmsLayers: testWmsLayers,
      onLayerAddToMap: onLayerAddToMapMock
    });
    wrapper.instance().onAddAllLayers();
    expect(onLayerAddToMapMock).toHaveBeenCalledTimes(1);
    expect(onLayerAddToMapMock).toHaveBeenCalledWith(testWmsLayers);
  });

  it('passes filtered set of wmsLayers to onLayerAddToMap if onAddSelectedLayers is called', () => {
    const selectedWmsLayers = [
      testLayerTitle2
    ];
    const onLayerAddToMapMock = jest.fn();
    const wrapper = TestUtil.mountComponent(AddWmsPanel, {
      wmsLayers: testWmsLayers,
      onLayerAddToMap: onLayerAddToMapMock
    });

    wrapper.setState({
      selectedWmsLayers: selectedWmsLayers
    }, () => {
      wrapper.instance().onAddSelectedLayers();

      expect(onLayerAddToMapMock).toHaveBeenCalledTimes(1);
      const passedFunctionParameter = onLayerAddToMapMock.mock.calls[0][0];
      expect(passedFunctionParameter.length).toBe(selectedWmsLayers.length);
    });
  });

  it('renders cancelBtn only if onCancel prop (as function) is provided', () => {
    let wrapper = TestUtil.mountComponent(AddWmsPanel, {
      wmsLayers: testWmsLayers
    });
    const buttonsWithoutCancel = wrapper.find(SimpleButton);
    expect(buttonsWithoutCancel).toHaveLength(2);
    buttonsWithoutCancel.forEach((btn) => {
      expect(btn.key).not.toBe('cancelBtn');
    });
    wrapper.unmount();

    wrapper = TestUtil.mountComponent(AddWmsPanel, {
      onCancel: jest.fn,
      wmsLayers: testWmsLayers
    });
    const buttonsWithCancel = wrapper.find(SimpleButton);
    expect(buttonsWithCancel).toHaveLength(3);
    const buttonWithCancel = buttonsWithCancel.get(2);
    expect(buttonWithCancel.key).toBe('cancelBtn');
  });

});

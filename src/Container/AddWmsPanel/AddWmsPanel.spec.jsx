/*eslint-env jest*/
import { AddWmsPanel, SimpleButton } from '../../index';
import TestUtil from '../../Util/TestUtil';

describe('<AddWmsPanel />', () => {

  const testWmsLayers = [{
    'wmsAttribution': 'pariatur magna deserunt consequat sunt consequat qui sit exercitation',
    'Title': 'ullamco id',
    'Abstract': 'esse enim voluptate esse exercitation',
    'queryable': true
  },
  {
    'wmsAttribution': 'exercitation laboris ullamco ex id amet in pariatur eiusmod',
    'Title': 'aliquip ipsum',
    'Abstract': 'officia sint anim sint qui',
    'queryable': false
  },
  {
    'wmsAttribution': 'et exercitation nisi exercitation nostrud aliqua laborum enim deserunt',
    'Title': 'consectetur Lorem',
    'Abstract': 'est est consectetur ea consequat',
    'queryable': true
  },
  {
    'wmsAttribution': 'consectetur adipisicing tempor nostrud consequat laboris id cupidatat sit',
    'Title': 'officia est',
    'Abstract': 'do nostrud laborum nulla voluptate',
    'queryable': false
  },
  {
    'wmsAttribution': 'do ipsum laborum quis reprehenderit anim laborum magna ex',
    'Title': 'sit quis',
    'Abstract': 'non id mollit officia veniam',
    'queryable': false
  }];

  const defaultProps = {
    wmsLayers: []
  };

  it('is defined', () => {
    expect(AddWmsPanel).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(AddWmsPanel, defaultProps);
    expect(wrapper).not.toBeUndefined();
  });

  it('updates state on onSelectedLayersChange', () => {
    const wrapper = TestUtil.mountComponent(AddWmsPanel, defaultProps);
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
    expect(onLayerAddToMapMock.mock.calls.length).toBe(1);
    const passedFunctionParameter = onLayerAddToMapMock.mock.calls[0][0];
    expect(passedFunctionParameter).toBe(testWmsLayers);
  });

  it('passes filtered set of wmsLayers to onLayerAddToMap if onAddSelectedLayers is called', () => {
    const selectedWmsLayers = [
      testWmsLayers[0].Title,
      testWmsLayers[2].Title,
      testWmsLayers[3].Title
    ];
    const onLayerAddToMapMock = jest.fn();
    const filteredLayers = testWmsLayers.filter(layer => selectedWmsLayers.includes(layer.Title));
    const wrapper = TestUtil.mountComponent(AddWmsPanel, {
      wmsLayers: testWmsLayers,
      onLayerAddToMap: onLayerAddToMapMock
    });

    wrapper.setState({
      selectedWmsLayers: selectedWmsLayers
    }, () => {
      wrapper.instance().onAddSelectedLayers();

      expect(onLayerAddToMapMock.mock.calls.length).toBe(1);
      const passedFunctionParameter = onLayerAddToMapMock.mock.calls[0][0];
      expect(passedFunctionParameter.length).toBe(selectedWmsLayers.length);
      expect(passedFunctionParameter).toEqual(filteredLayers);
    });
  });

  it('renders cancelBtn only if onCancel prop (as function) is provided', () => {
    let wrapper = TestUtil.mountComponent(AddWmsPanel, defaultProps);
    const buttonsWithoutCancel = wrapper.find(SimpleButton);
    expect(buttonsWithoutCancel).toHaveLength(2);
    buttonsWithoutCancel.forEach((btn) => {
      expect(btn.key).not.toBe('cancelBtn');
    });
    wrapper.unmount();

    wrapper = TestUtil.mountComponent(AddWmsPanel, {
      onCancel: jest.fn,
      wmsLayers: []
    });
    const buttonsWithCancel = wrapper.find(SimpleButton);
    expect(buttonsWithCancel).toHaveLength(3);
    const buttonWithCancel = buttonsWithCancel.get(2);
    expect(buttonWithCancel.key).toBe('cancelBtn');
  });

});

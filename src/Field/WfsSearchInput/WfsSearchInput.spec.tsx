import TestUtil from '../../Util/TestUtil';
import Logger from '@terrestris/base-util/dist/Logger';

import {
  act
} from 'react-dom/test-utils';

import WfsSearchInput from './WfsSearchInput';

describe('<WfsSearchInput />', () => {
  it('is defined', () => {
    expect(WfsSearchInput).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(WfsSearchInput);
    expect(wrapper).not.toBeUndefined();
  });

  describe('#onUpdateInput', () => {
    it('resets state.data', () => {
      const wrapper = TestUtil.mountComponent(WfsSearchInput);
      wrapper.instance().onUpdateInput();
      expect(wrapper.state().data).toEqual([]);
    });

    it('sets the inputValue as state.searchTerm', () => {
      const wrapper = TestUtil.mountComponent(WfsSearchInput);
      const evt = {
        target: {
          value: 'a'
        }
      };
      act(() => {
        wrapper.instance().onUpdateInput(evt);
      });
      expect(wrapper.state().searchTerm).toBe(evt.target.value);
    });

    it('calls onBeforeSearch callback if passed in props', () => {
      const wrapper = TestUtil.mountComponent(WfsSearchInput, {
      });
      wrapper.setProps({
        onBeforeSearch: jest.fn(),
      });
      const evt = {
        target: {
          value: 'abc'
        }
      };

      act(() => {
        wrapper.instance().onUpdateInput(evt);
      });
      expect(wrapper.props().onBeforeSearch).toHaveBeenCalled();
    });

    it('sends a request if input is as long as props.minChars', () => {
      // expect.assertions(1);
      const wrapper = TestUtil.mountComponent(WfsSearchInput, {
        placeholder: 'Type a countryname in its own language…',
        baseUrl: 'https://ows-demo.terrestris.de/geoserver/osm/wfs',
        featureTypes: ['osm:osm-country-borders'],
        attributeDetails: {
          'osm:osm-country-borders': {
            name: {
              type: 'string',
              exactSearch: false,
              matchCase: false
            }
          }
        }
      });
      const doSearchSpy = jest.spyOn(wrapper.instance(), 'doSearch');
      const evt = {
        target: {
          value: 'abc'
        }
      };
      act(() => {
        wrapper.instance().onUpdateInput(evt);
      });
      expect(doSearchSpy).toHaveBeenCalled();
      doSearchSpy.mockRestore();
    });
  });

  describe('#onFetchSuccess', () => {
    it('sets the response features as state.data', () => {
      const wrapper = TestUtil.mountComponent(WfsSearchInput);
      const response = {
        features: [{
          id: '752526',
          properties: {
            name: 'Deutschland'
          }
        }]
      };
      wrapper.instance().onFetchSuccess(response);
      const promise = new Promise(resolve => {
        setTimeout(resolve, 350);
      });
      return promise.then(() => {
        expect(wrapper.state().data).toEqual(response.features);
      });
    });
  });

  describe('#onFetchError', () => {
    it('sets the response as state.data', () => {
      const wrapper = TestUtil.mountComponent(WfsSearchInput);
      const loggerSpy = jest.spyOn(Logger, 'error');
      wrapper.instance().onFetchError('Peter');
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Error while requesting WFS GetFeature: Peter');
      loggerSpy.mockRestore();
    });
  });

  describe('#resetSearch', () => {
    it('resets input value', () => {
      const wrapper = TestUtil.mountComponent(WfsSearchInput);
      wrapper.instance()._inputRef.input.value = 'some value';
      wrapper.instance().resetSearch();
      expect(wrapper.instance()._inputRef.input.value).toBe('');
    });

    it('resets state value for data', () => {
      const wrapper = TestUtil.mountComponent(WfsSearchInput);
      act(() => {
        wrapper.setState({
          data: [{
            feat1: {
              prop: 'peter'
            }
          }]
        });
      });
      expect(wrapper.state().data.length).toBe(1);
      act(() => {
        wrapper.instance().resetSearch();
      });
      expect(wrapper.state().data.length).toBe(0);
      expect(wrapper.state().data).toEqual([]);

    });

    it('calls onClearClick callback function if passed in props', () => {
      const wrapper = TestUtil.mountComponent(WfsSearchInput);
      wrapper.setProps({
        onClearClick: jest.fn()
      });
      act(() => {
        wrapper.instance().resetSearch();
      });
      expect(wrapper.props().onClearClick).toHaveBeenCalled();
    });
  });
});

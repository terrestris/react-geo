/* eslint-disable testing-library/render-result-naming-convention */
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';

import TestUtil from '../../Util/TestUtil';
import Logger from '@terrestris/base-util/dist/Logger';

import WfsSearch from './WfsSearch';

describe('<WfsSearch />', () => {
  it('is defined', () => {
    expect(WfsSearch).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(WfsSearch);
    expect(wrapper).not.toBeUndefined();
  });

  describe('#onUpdateInput', () => {
    it('resets state.data', () => {
      const wrapper = TestUtil.mountComponent(WfsSearch);
      wrapper.instance().onUpdateInput();
      expect(wrapper.state().data).toEqual([]);
    });

    it('sets the inputValue as state.searchTerm', () => {
      const wrapper = TestUtil.mountComponent(WfsSearch);
      const inputValue = 'a';
      wrapper.instance().onUpdateInput(inputValue);
      expect(wrapper.state().searchTerm).toBe(inputValue);
    });

    it('sends a request if input is as long as props.minChars', () => {
      // expect.assertions(1);
      const wrapper = TestUtil.mountComponent(WfsSearch, {
        placeholder: 'Type a countryname in its own language…',
        baseUrl: 'https://ows.terrestris.de/geoserver/osm/wfs',
        featureTypes: ['osm:osm-country-borders'],
        searchAttributes: {
          'osm:osm-country-borders': ['name']
        }
      });
      const doSearchSpy = jest.spyOn(wrapper.instance(), 'doSearch');
      const inputValue = 'Deutsch';
      wrapper.instance().onUpdateInput(inputValue);
      expect(doSearchSpy).toHaveBeenCalled();
      doSearchSpy.mockRestore();
    });
  });

  describe('#onFetchSuccess', () => {
    it('sets the response features as state.data', () => {
      const wrapper = TestUtil.mountComponent(WfsSearch);
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
      const wrapper = TestUtil.mountComponent(WfsSearch);
      const loggerSpy = jest.spyOn(Logger, 'error');
      wrapper.instance().onFetchError('Peter');
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Error while requesting WFS GetFeature: Peter');
      loggerSpy.mockRestore();
    });
  });

  describe('#onMenuItemSelected', () => {
    it('calls this.props.onSelect with the selected item', () => {
      // SETUP
      const data = [{
        id: '752526',
        properties: {
          name: 'Deutschland'
        }
      }];
      const map = new OlMap({
        layers: [new OlLayerTile({name: 'OSM', source: new OlSourceOsm()})],
        view: new OlView({
          projection: 'EPSG:4326',
          center: [37.40570, 8.81566],
          zoom: 4
        })
      });
      // SETUP END

      const selectSpy = jest.fn();
      const wrapper = TestUtil.mountComponent(WfsSearch, {
        onSelect: selectSpy,
        map
      });
      wrapper.setState({
        data: data
      });
      wrapper.instance().onMenuItemSelected('Deutschland', {key: '752526'});
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith(data[0], map);

      selectSpy.mockRestore();
    });
  });

  describe('default #onSelect', () => {
    it('zooms to the selected feature', () => {
      // SETUP
      const feature = {
        type: 'Feature',
        id: '752526',
        properties: {
          name: 'Peter',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[10, 40], [40, 40], [40, 10], [10, 10], [10, 40]]]
        }
      };
      const map = new OlMap({
        layers: [new OlLayerTile({name: 'OSM', source: new OlSourceOsm()})],
        view: new OlView({
          projection: 'EPSG:4326',
          center: [37.40570, 8.81566],
          zoom: 4,
          constrainResolution: true
        })
      });
      // SETUP END

      const wrapper = TestUtil.mountComponent(WfsSearch, {map});
      const fitSpy = jest.spyOn(map.getView(), 'fit');
      wrapper.props().onSelect(feature, map);

      expect.assertions(3);

      expect(fitSpy).toHaveBeenCalled();

      return new Promise(resolve => {
        setTimeout(resolve, 600);
      })
        .then(() => {
          expect(map.getView().getCenter()).toEqual([25, 25]);
          expect(map.getView().getZoom()).toEqual(2);
          fitSpy.mockRestore();
        });
    });
  });

  describe('#renderOption', () => {
    it('returns a Select.Option', () => {
      const wrapper = TestUtil.mountComponent(WfsSearch);
      const feature = {
        id: '752526',
        properties: {
          name: 'Deutschland'
        }
      };
      const option = wrapper.props().renderOption(feature, {
        // Props must be passed to the renderOption function.
        displayValue: 'name',
        idProperty: 'id'
      });

      expect(option.key).toBe(feature.id);
      expect(option.props.children).toBe(feature.properties.name);
    });
  });

  describe('#idProperty', () => {
    it('can be specified', () => {
      const wrapper = TestUtil.mountComponent(WfsSearch);
      const feature = {
        customId: '7355608',
        properties: {
          name: 'Deutschland'
        }
      };
      const option = wrapper.props().renderOption(feature, {
        displayValue: 'name',
        idProperty: 'customId'
      });

      expect(option.key).toBe(feature.customId);
      expect(option.props.children).toBe(feature.properties.name);
    });
  });

});

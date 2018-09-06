/*eslint-env jest*/

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';

import TestUtil from '../../Util/TestUtil';
import Logger from '@terrestris/base-util/src/Logger';

import { NominatimSearch } from '../../index';

describe('<NominatimSearch />', () => {
  it('is defined', () => {
    expect(NominatimSearch).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(NominatimSearch);
    expect(wrapper).not.toBeUndefined();
  });

  describe('#onUpdateInput', () => {
    it('resets state.dataSource', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      wrapper.instance().onUpdateInput();
      expect(wrapper.state().dataSource).toEqual([]);
    });

    it('sets the inputValue as state.searchTerm', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      const inputValue = 'a';
      wrapper.instance().onUpdateInput(inputValue);
      expect(wrapper.state().searchTerm).toBe(inputValue);
    });

    it('sends a request if input is as long as props.minChars', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      const fetchSpy = jest.spyOn(window, 'fetch');
      const inputValue = 'Bonn';
      wrapper.instance().onUpdateInput(inputValue);
      expect(fetchSpy).toHaveBeenCalled();
      fetchSpy.mockReset();
      fetchSpy.mockRestore();
    });
  });

  describe('#doSearch', () => {
    it('sends a request with appropriate parts', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      const fetchSpy = jest.spyOn(window, 'fetch');
      const inputValue = 'Bonn';
      wrapper.setState({searchTerm: inputValue});
      wrapper.instance().doSearch();
      expect(fetchSpy).toHaveBeenCalled();

      const fetchUrl = fetchSpy.mock.calls[0][0];

      const expectations = [
        wrapper.props().nominatimBaseUrl,
        encodeURIComponent(wrapper.props().format),
        encodeURIComponent(wrapper.props().viewbox),
        encodeURIComponent(wrapper.props().bounded),
        encodeURIComponent(wrapper.props().polygon_geojson),
        encodeURIComponent(wrapper.props().addressdetails),
        encodeURIComponent(wrapper.props().limit),
        encodeURIComponent(wrapper.props().countrycodes),
        encodeURIComponent(inputValue)
      ];
      expectations.forEach(expectation => {
        expect(fetchUrl).toMatch(expectation);
      });
      fetchSpy.mockReset();
      fetchSpy.mockRestore();
    });
  });

  describe('#onFetchSuccess', () => {
    it('sets the response as state.dataSource', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      const response = [{
        place_id: 123,
        display_name: 'peter'
      }];
      wrapper.instance().onFetchSuccess(response);
      expect(wrapper.state().dataSource).toEqual(response);
    });
  });

  describe('#onFetchError', () => {
    it('sets the response as state.dataSource', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      const loggerSpy = jest.spyOn(Logger, 'error');
      wrapper.instance().onFetchError('Peter');
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Error while requesting Nominatim: Peter');
      loggerSpy.mockReset();
      loggerSpy.mockRestore();
    });
  });

  describe('#onMenuItemSelected', () => {
    it('calls this.props.onSelect with the selected item', () => {
      //SETUP
      const dataSource = [{
        place_id: '752526',
        display_name: 'Böen, Löningen, Landkreis Cloppenburg, Niedersachsen, Deutschland'
      }];
      const map = new OlMap({
        layers: [new OlLayerTile({name: 'OSM', source: new OlSourceOsm()})],
        view: new OlView({
          projection: 'EPSG:4326',
          center: [37.40570, 8.81566],
          zoom: 4
        })
      });
      //SETUP END

      const selectSpy = jest.fn();
      const wrapper = TestUtil.mountComponent(NominatimSearch, {
        onSelect: selectSpy,
        map
      });
      wrapper.setState({
        dataSource: dataSource
      });
      wrapper.instance().onMenuItemSelected('752526');
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith(dataSource[0], map);

      selectSpy.mockReset();
      selectSpy.mockRestore();
    });
  });

  describe('#onSelect', () => {
    it('zooms to the boundingbox of the selected entry', () => {
      //SETUP
      const bbox = ['52.7076346', '52.7476346', '7.7702617', '7.8102617'];
      const transformedExtent = [
        parseFloat(bbox[2]),
        parseFloat(bbox[0]),
        parseFloat(bbox[3]),
        parseFloat(bbox[1])
      ];
      const item = {
        place_id: '752526',
        boundingbox: bbox
      };
      const map = new OlMap({
        layers: [new OlLayerTile({name: 'OSM', source: new OlSourceOsm()})],
        view: new OlView({
          projection: 'EPSG:4326',
          center: [37.40570, 8.81566],
          zoom: 4
        })
      });
      //SETUP END

      const wrapper = TestUtil.mountComponent(NominatimSearch, {map});
      const fitSpy = jest.spyOn(map.getView(), 'fit');
      wrapper.props().onSelect(item, map);
      expect(fitSpy).toHaveBeenCalled();
      expect(fitSpy).toHaveBeenCalledWith(transformedExtent, expect.any(Object) );
      fitSpy.mockReset();
      fitSpy.mockRestore();
    });
  });

  describe('#renderOption', () => {
    it('returns an AutoComplete.Option', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      const item = {
        place_id: '752526',
        display_name: 'Böen, Löningen, Landkreis Cloppenburg, Niedersachsen, Deutschland'
      };
      const option = wrapper.props().renderOption(item);
      expect(option.key).toBe(item.place_id);
      expect(option.props.children).toBe(item.display_name);
    });
  });

});

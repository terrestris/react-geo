/*eslint-env jest*/

import sinon from 'sinon';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';

import TestUtil from '../../Util/TestUtil';
import Logger from '../../Util/Logger';

import {NominatimSearch} from '../../index';

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
      const fetchSpy = sinon.spy(window, 'fetch');
      const inputValue = 'Bonn';
      wrapper.instance().onUpdateInput(inputValue);
      expect(fetchSpy.calledOnce).toBeTruthy();
      expect(fetchSpy.calledWithMatch(wrapper.props().nominatimBaseUrl)).toBeTruthy();
      fetchSpy.restore();
    });
  });

  describe('#doSearch', () => {
    it('sends a request with state.searchTerm', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      const fetchSpy = sinon.spy(window, 'fetch');
      const inputValue = 'Bonn';
      wrapper.setState({searchTerm: inputValue});
      wrapper.instance().doSearch();
      expect(fetchSpy.calledOnce).toBeTruthy();
      expect(fetchSpy.calledWithMatch(wrapper.props().nominatimBaseUrl)).toBeTruthy();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().format))).toBeTruthy();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().viewbox))).toBeTruthy();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().bounded))).toBeTruthy();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().polygon_geojson))).toBeTruthy();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().addressdetails))).toBeTruthy();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().limit))).toBeTruthy();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().countrycodes))).toBeTruthy();
      expect(fetchSpy.calledWithMatch(inputValue)).toBeTruthy();
      fetchSpy.restore();
    });
  });

  describe('#onFetchSuccess', () => {
    it('sets the response as state.dataSource', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      wrapper.instance().onFetchSuccess(['Peter']);
      expect(wrapper.state().dataSource).toEqual(['Peter']);
    });
  });

  describe('#onFetchError', () => {
    it('sets the response as state.dataSource', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      const loggerSpy = sinon.spy(Logger, 'error');
      wrapper.instance().onFetchError('Peter');
      expect(loggerSpy.calledOnce).toBeTruthy();
      expect(loggerSpy.calledWith('Error while requesting Nominatim: Peter')).toBeTruthy();
      loggerSpy.restore();
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

      const selectSpy = sinon.spy();
      const wrapper = TestUtil.mountComponent(NominatimSearch, {
        onSelect: selectSpy,
        map
      });
      wrapper.setState({
        dataSource: dataSource
      });
      wrapper.instance().onMenuItemSelected('752526');
      expect(selectSpy.calledOnce).toBeTruthy();
      expect(selectSpy.calledWith(dataSource[0], map)).toBeTruthy();
    });
  });

  describe('#onSelect', () => {
    it('zooms to the boundingbox of the selected entry', () => {
      //SETUP
      const bbox = ['52.7076346', '52.7476346', '7.7702617', '7.8102617'];
      const tranformedExtent = [
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
      const fitSpy = sinon.spy(map.getView(), 'fit');
      wrapper.props().onSelect(item, map);
      expect(fitSpy.calledOnce).toBeTruthy();
      expect(fitSpy.calledWith(tranformedExtent)).toBeTruthy();
      fitSpy.restore();
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

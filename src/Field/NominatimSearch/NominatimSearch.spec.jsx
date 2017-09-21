/*eslint-env mocha*/
import expect from 'expect.js';
import sinon from 'sinon';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import olProj from 'ol/proj';

import TestUtil from '../../Util/TestUtil';
import Logger from '../../Util/Logger';

import {NominatimSearch} from '../../index';

describe('<NominatimSearch />', () => {
  it('is defined', () => {
    expect(NominatimSearch).not.to.be(undefined);
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(NominatimSearch);
    expect(wrapper).not.to.be(undefined);
  });

  describe('#onUpdateInput', () => {
    it('resets state.dataSource', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      wrapper.instance().onUpdateInput();
      expect(wrapper.state().dataSource).to.eql([]);
    });

    it('sets the inputValue as state.searchTerm', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      const inputValue = 'a';
      wrapper.instance().onUpdateInput(inputValue);
      expect(wrapper.state().searchTerm).to.eql(inputValue);
    });

    it('sends a request if input is as long as props.minChars', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      const fetchSpy = sinon.spy(window, 'fetch');
      const inputValue = 'Bonn';
      wrapper.instance().onUpdateInput(inputValue);
      expect(fetchSpy.calledOnce).to.be.ok();
      expect(fetchSpy.calledWithMatch(wrapper.props().nominatimBaseUrl)).to.be.ok();
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
      expect(fetchSpy.calledOnce).to.be.ok();
      expect(fetchSpy.calledWithMatch(wrapper.props().nominatimBaseUrl)).to.be.ok();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().format))).to.be.ok();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().viewbox))).to.be.ok();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().bounded))).to.be.ok();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().polygon_geojson))).to.be.ok();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().addressdetails))).to.be.ok();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().limit))).to.be.ok();
      expect(fetchSpy.calledWithMatch(encodeURIComponent(wrapper.props().countrycodes))).to.be.ok();
      expect(fetchSpy.calledWithMatch(inputValue)).to.be.ok();
      fetchSpy.restore();
    });
  });

  describe('#onFetchSuccess', () => {
    it('sets the response as state.dataSource', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      wrapper.instance().onFetchSuccess(['Peter']);
      expect(wrapper.state().dataSource).to.eql(['Peter']);
    });
  });

  describe('#onFetchError', () => {
    it('sets the response as state.dataSource', () => {
      const wrapper = TestUtil.mountComponent(NominatimSearch);
      const loggerSpy = sinon.spy(Logger, 'error');
      wrapper.instance().onFetchError('Peter');
      expect(loggerSpy.calledOnce).to.be.ok();
      expect(loggerSpy.calledWith('Error while requesting Nominatim: Peter')).to.be.ok();
      loggerSpy.restore();
    });
  });

  describe('#onMenuItemSelected', () => {

    it('zooms to the boundingbox of the selected entry', () => {
      // SETUP
      const bbox = ['52.7076346', '52.7476346', '7.7702617', '7.8102617'];
      const tranformedExtent = [
        parseFloat(bbox[2]),
        parseFloat(bbox[0]),
        parseFloat(bbox[3]),
        parseFloat(bbox[1])
      ];
      const dataSource = [{
        place_id: '752526',
        licence: 'Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright',
        osm_type: 'node',
        osm_id: '265510725',
        boundingbox: bbox,
        lat: '52.7276346',
        lon: '7.7902617',
        display_name: 'Böen, Löningen, Landkreis Cloppenburg, Niedersachsen, Deutschland',
        class: 'place',
        type: 'suburb',
        importance: 0.25,
        icon: 'http://nominatim.openstreetmap.org/images/mapicons/poi_place_village.p.20.png',
        address: {
          suburb: 'Böen',
          town: 'Löningen',
          county: 'Landkreis Cloppenburg',
          state: 'Niedersachsen',
          country: 'Deutschland',
          country_code: 'de'
        },
        geojson: {
          type: 'Point',
          coordinates: [7.7902617, 52.7276346]
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

      const wrapper = TestUtil.mountComponent(NominatimSearch, {map});
      const inputValue = 'Bonn';
      const fitSpy = sinon.spy(map.getView(), 'fit');
      wrapper.setState({
        dataSource: dataSource,
        searchTerm: inputValue
      });
      wrapper.instance().onMenuItemSelected('752526');
      expect(fitSpy.calledOnce).to.be.ok();
      expect(fitSpy.calledWith(tranformedExtent)).to.be.ok();
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
      const option = wrapper.instance().renderOption(item);
      expect(option.key).to.eql(item.place_id);
      expect(option.props.children).to.eql(item.display_name);
    });
  })

});

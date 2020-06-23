import TestUtil from '../../Util/TestUtil';

import CoordinateReferenceSystemCombo from '../CoordinateReferenceSystemCombo/CoordinateReferenceSystemCombo';

import Logger from '@terrestris/base-util/dist/Logger';

describe('<CoordinateReferenceSystemCombo />', () => {

  const resultMock = {
    status: 'ok',
    number_result: 1,
    results: [{
      code: '31466',
      bbox: [53.81,5.86,49.11,7.5],
      // eslint-disable-next-line max-len
      proj4: '+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs',
      name: 'DHDN / 3-degree Gauss-Kruger zone 2'
    }, {
      code: '4326',
      bbox: [90,-180,-90,180],
      proj4: '+proj=longlat +datum=WGS84 +no_defs',
      name: 'WGS 84'
    }]
  };

  it('is defined', () => {
    expect(CoordinateReferenceSystemCombo).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(CoordinateReferenceSystemCombo);
    expect(wrapper).not.toBeUndefined();
  });

  describe('#fetchCrs', () => {
    it('sends a request with searchTerm', () => {
      const wrapper = TestUtil.mountComponent(CoordinateReferenceSystemCombo);
      const searchVal = '25832';
      const callback = jest.fn();
      const fetchPromise = wrapper.instance().fetchCrs(searchVal, callback);
      expect(fetchPromise).toBeInstanceOf(Promise);
    });
  });

  describe('#transformResults', () => {
    const wrapper = TestUtil.mountComponent(CoordinateReferenceSystemCombo);
    it('appropriately transforms filled results', () => {
      const transformedResults = wrapper.instance().transformResults(resultMock);
      expect(transformedResults).toHaveLength(resultMock.results.length);
      transformedResults.forEach((crsObj, idx) => {
        expect(crsObj.code).toBe(resultMock.results[idx].code);
        expect(crsObj.bbox).toBe(resultMock.results[idx].bbox);
        expect(crsObj.proj4def).toBe(resultMock.results[idx].proj4);
        expect(crsObj.value).toBe(resultMock.results[idx].name);
      });
    });

    it('appropriately transforms empty results', () => {
      const transformedResults = wrapper.instance().transformResults({
        success: 'ok',
        results: []
      });
      expect(transformedResults).toHaveLength(0);
    });
  });

  describe('#onFetchError', () => {
    it('logs error message', () => {
      const wrapper = TestUtil.mountComponent(CoordinateReferenceSystemCombo);
      const loggerSpy = jest.spyOn(Logger, 'error');
      wrapper.instance().onFetchError('Peter');
      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Error while requesting in CoordinateReferenceSystemCombo: Peter');

      loggerSpy.mockRestore();
    });
  });

  describe('#handleSearch', () => {
    const value = 25832;
    const wrapper = TestUtil.mountComponent(CoordinateReferenceSystemCombo);

    it('resets state if value is empty', () => {
      wrapper.setState({
        value: value,
        crsDefinitions: resultMock.results
      }, () => {
        wrapper.instance().handleSearch(null);
        window.setTimeout(() => {
          const stateAfter = wrapper.state();
          expect(stateAfter.value).toBe(null);
          expect(stateAfter.crsDefinitions).toHaveLength(0);
        }, 50);
      });
    });

    it('updates state if value is given', () => {
      wrapper.setState({
        value: value,
        crsDefinitions: resultMock.results
      }, () => {
        wrapper.instance().handleSearch(value);
        window.setTimeout(() => {
          const stateAfter = wrapper.state();
          expect(stateAfter.value).toBe(value);
        }, 50);
      });
    });

  });

  describe('#onCrsItemSelect', () => {

    it('sets value property in state for given code', () => {
      const onSelect = jest.fn();
      const props = {
        onSelect: onSelect
      };
      const wrapper = TestUtil.mountComponent(CoordinateReferenceSystemCombo, props);
      wrapper.setState({
        crsDefinitions: resultMock.results
      }, () => {
        wrapper.instance().onCrsItemSelect('31466');

        const stateAfter = wrapper.state();
        expect(stateAfter.crsDefinitions[0]).toBe(resultMock.results[0]);
      });
    });

    it('calls onSelect function if given in props', () => {
      const onSelect = jest.fn();
      const props = {
        onSelect: onSelect
      };
      const wrapper = TestUtil.mountComponent(CoordinateReferenceSystemCombo, props);
      wrapper.setState({
        crsDefinitions: resultMock.results
      }, () => {
        wrapper.instance().onCrsItemSelect('31466');
        expect(onSelect).toHaveBeenCalledTimes(1);
      });
    });

  });

  describe('#transformCrsObjectsToOptions', () => {
    it('returns an AutoComplete.Option', () => {
      const wrapper = TestUtil.mountComponent(CoordinateReferenceSystemCombo);
      const item = {
        code: '31466',
        value: 'DHDN / 3-degree Gauss-Kruger zone 2'
      };
      const option = wrapper.instance().transformCrsObjectsToOptions(item);
      expect(option.key).toBe(item.code);
      expect(option.props.children).toBe(`${item.value} (EPSG:${item.code})`);
    });
  });

});

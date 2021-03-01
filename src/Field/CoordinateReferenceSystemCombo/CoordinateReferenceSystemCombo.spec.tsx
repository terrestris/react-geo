import { render, screen, within } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom';
import { enableFetchMocks } from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';

import TestUtil from '../../Util/TestUtil';
import Logger from '@terrestris/base-util/dist/Logger';

import CoordinateReferenceSystemCombo from '../CoordinateReferenceSystemCombo/CoordinateReferenceSystemCombo';

describe('<CoordinateReferenceSystemCombo />', () => {

  const resultMock = {
    status: 'ok',
    // eslint-disable-next-line camelcase
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

  const transformedResults = [{
    code: '31466',
    bbox: [53.81,5.86,49.11,7.5],
    // eslint-disable-next-line max-len
    proj4def: '+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs',
    value: 'DHDN / 3-degree Gauss-Kruger zone 2'
  }, {
    code: '4326',
    bbox: [90,-180,-90,180],
    proj4def: '+proj=longlat +datum=WGS84 +no_defs',
    value: 'WGS 84'
  }];

  beforeAll(() => {
    enableFetchMocks();
    fetch.mockResponse(JSON.stringify(resultMock));
  });

  it('is defined', () => {
    expect(CoordinateReferenceSystemCombo).not.toBeUndefined();
  });

  it('can be rendered', () => {
    render(<CoordinateReferenceSystemCombo data-testid="test-coordinate-reference-combo" />);
    expect(screen.getByTestId('test-coordinate-reference-combo')).toBeVisible();
  });

  describe('#fetchCrs', () => {
    it('sends a request with searchTerm', () => {
      const url = 'http://test.url';
      render(<CoordinateReferenceSystemCombo crsApiUrl={url} />);

      const combobox = screen.getByRole('combobox');
      userEvent.type(combobox, '25832');

      expect(fetch).toBeCalled();
      expect(fetch).toBeCalledWith(`${url}?format=json&q=25832`);
    });
  });

  describe('#options', () => {
    it('creates desired options', async () => {
      render(<CoordinateReferenceSystemCombo />);

      const combobox = screen.getByRole('combobox');

      userEvent.type(combobox, 'a');

      await TestUtil.actImmediate();

      const dropdown = global.document.querySelector('.ant-select-dropdown');

      for (const result of resultMock.results) {
        const option = within(dropdown).getByTitle(`${result.name} (EPSG:${result.code})`);
        // would be nicer to test for `toBeVisible`, but antd seems to be in the way
        expect(option).toBeInTheDocument();
      }
    });

    it('does not options for empty results', async () => {
      fetch.mockResponseOnce(JSON.stringify({
        status: 'ok',
        number_result: 0,
        results: []
      }));

      render(<CoordinateReferenceSystemCombo />);

      const combobox = screen.getByRole('combobox');

      userEvent.type(combobox, 'a');

      await TestUtil.actImmediate();

      const dropdown = global.document.querySelector('.ant-select-dropdown');

      expect(dropdown).toBeNull();
    });
  });

  describe('#onFetchError', () => {
    it('logs error message', async () => {
      fetch.mockRejectOnce('Peter');

      const loggerSpy = jest.spyOn(Logger, 'error');

      render(<CoordinateReferenceSystemCombo />);
      const combobox = screen.getByRole('combobox');
      userEvent.type(combobox, 'a');

      await TestUtil.actImmediate();

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

    it('calls the onSelect callback with the correct value', async () => {
      const onSelect = jest.fn();

      render(<CoordinateReferenceSystemCombo onSelect={onSelect}/>);

      const combobox = screen.getByRole('combobox');

      userEvent.type(combobox, 'a');

      await TestUtil.actImmediate();

      const dropdown = global.document.querySelector('.ant-select-dropdown');

      const result = resultMock.results[0];
      const expected = transformedResults[0];

      const option = within(dropdown).getByTitle(`${result.name} (EPSG:${result.code})`);

      userEvent.click(option);

      expect(onSelect).toBeCalledWith(expected);
    });

    it('sets the value of the combobox to the correct value', async () => {
      const onSelect = jest.fn();

      render(<CoordinateReferenceSystemCombo onSelect={onSelect}/>);

      const combobox = screen.getByRole('combobox');

      userEvent.type(combobox, 'a');

      await TestUtil.actImmediate();

      const dropdown = global.document.querySelector('.ant-select-dropdown');

      const result = resultMock.results[0];

      const option = within(dropdown).getByTitle(`${result.name} (EPSG:${result.code})`);

      userEvent.click(option);

      await TestUtil.actImmediate();

      expect(combobox.value).toBe(`${result.name} (EPSG:${result.code})`);
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

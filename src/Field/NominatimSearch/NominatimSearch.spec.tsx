import { actSetTimeout, renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { enableFetchMocks, FetchMock } from 'jest-fetch-mock';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

import NominatimSearch from '../NominatimSearch/NominatimSearch';

describe('<NominatimSearch />', () => {
  let map: OlMap;

  const nominatimBoundingBox = ['52.7076346', '52.7476346', '7.7702617', '7.8102617'];

  const resultMock = [{
    // eslint-disable-next-line camelcase
    place_id: 752526,
    // eslint-disable-next-line camelcase
    display_name: 'Böen, Löningen, Landkreis Cloppenburg, Niedersachsen, Deutschland',
    boundingbox: nominatimBoundingBox
  }, {
    // eslint-disable-next-line camelcase
    place_id: 123,
    // eslint-disable-next-line camelcase
    display_name: 'peter'
  }];

  beforeAll(() => {
    enableFetchMocks();
    (fetch as FetchMock).mockResponse(JSON.stringify(resultMock));
  });

  beforeEach(() => {
    map = new OlMap({
      layers: [
        new OlLayerTile({
          properties: {
            name: 'OSM'
          },
          source: new OlSourceOsm()
        })
      ],
      view: new OlView({
        projection: 'EPSG:4326',
        center: [37.40570, 8.81566],
        zoom: 4
      })
    });
  });

  it('is defined', () => {
    expect(NominatimSearch).not.toBeUndefined();
  });

  it('can be rendered', () => {
    renderInMapContext(map, <NominatimSearch />);

    const button = screen.getByRole('combobox');
    expect(button).toBeVisible();
  });

  it('performs a search and shows options', async () => {
    renderInMapContext(map, <NominatimSearch />);

    const input = screen.getByRole('combobox');

    await userEvent.type(input, 'Cl');

    await actSetTimeout(500);

    let options = screen.queryAllByRole('option');

    // eslint-disable-next-line jest-dom/prefer-in-document
    expect(options).toHaveLength(0);

    await userEvent.type(input, 'oppenburg');

    await actSetTimeout(500);

    options = screen.queryAllByRole('option');

    // eslint-disable-next-line jest-dom/prefer-in-document
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent(resultMock[0].display_name);
  });

  it('sets the text value of the search to the select item and zooms to the bounding box', async () => {
    renderInMapContext(map, <NominatimSearch />);

    const fitSpy = jest.spyOn(map.getView(), 'fit');

    const input = screen.getByRole('combobox');

    await userEvent.type(input, 'Cloppenburg');

    const option = await screen.findByText(resultMock[0].display_name, {
      selector: '.ant-select-item-option-content'
    });

    await userEvent.click(option);

    expect(input).toHaveValue(resultMock[0].display_name);

    expect(fitSpy).toBeCalled();

    fitSpy.mockRestore();
  });

  it('calls a custom select callback', async () => {
    const selectSpy = jest.fn();

    renderInMapContext(map, <NominatimSearch onSelect={selectSpy} />);

    const fitSpy = jest.spyOn(map.getView(), 'fit');

    const input = screen.getByRole('combobox');

    await userEvent.type(input, 'Cloppenburg');

    const option = await screen.findByText(resultMock[0].display_name, {
      selector: '.ant-select-item-option-content'
    });

    await userEvent.click(option);

    expect(fitSpy).toHaveBeenCalledTimes(0);

    expect(selectSpy).toBeCalled();
    expect(selectSpy.mock.calls[0][0]).toStrictEqual(resultMock[0]);

    fitSpy.mockRestore();
    selectSpy.mockRestore();
  });
});

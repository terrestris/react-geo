import React from 'react';
import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';

import { SearchField, SearchProps } from './SearchField';

jest.mock('@terrestris/react-util', () => ({
  ...jest.requireActual('@terrestris/react-util'),
  useSearch: jest.fn().mockReturnValue({ featureCollection: undefined, loading: false })
}));

describe('<SearchField />', () => {
  const coord = [1, 2];
  let map: OlMap;
  let feature: OlFeature<OlPoint>;

  const defaultProps: SearchProps = {
    searchFunction: jest.fn(),
    getValue: jest.fn().mockImplementation(feature => feature.properties.name),
    onSelect: jest.fn(),
    onSearchCompleted: jest.fn(),
    getExtent: jest.fn().mockImplementation(() => [0, 0, 10, 10]),
    className: 'test-class'
  };

  const renderComponent = (props: Partial<SearchProps> = {}) => render(<SearchField {...defaultProps} {...props} />);


  beforeEach(() => {
    feature = new OlFeature<OlPoint>({
      geometry: new OlPoint(coord),
      someProp: 'test'
    });

    map = new OlMap({
      view: new OlView({
        center: coord,
        zoom: 10
      }),
      controls: [],
      layers: []
    });

    (DigitizeUtil.getDigitizeLayer(map))
      .getSource()?.addFeature(feature);
  });


  it('is defined', () => {
    expect(SearchField).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = renderInMapContext(map, <SearchField searchFunction={jest.fn()} />);

    const button = within(container).getByRole('combobox');
    expect(button).toBeVisible();
  });

  it('calls setSearchTerm on input change', () => {
    const { getByRole } = renderComponent();
    const input = getByRole('combobox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });

  it('calls onSearchCompleted on search completion', () => {
    const mockProps = {
      ...defaultProps,
      onSearchCompleted: jest.fn(),
    };
    const searchCollection = {
      type: 'FeatureCollection',
      features: [feature as any]
    };

    const useSearchMock = jest.requireMock('@terrestris/react-util').useSearch;
    useSearchMock.mockReturnValueOnce({ featureCollection: searchCollection, loading: false });

    renderComponent(mockProps);
    waitFor(() => {
      expect(mockProps.onSearchCompleted).toHaveBeenCalledWith(searchCollection);
    });
  });

  it('disables autocomplete popup if autoCompleteDisabled is true', async () => {
    render(<SearchField searchFunction={jest.fn()} autoCompleteDisabled={true} />);
    const input = screen.getByRole('combobox');
    const value = 'Test';
    fireEvent.change(input, { target: { value } });

    await new Promise(res => setTimeout(res, 300));

    // The popup list should not be rendered when autoCompleteDisabled is true
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('computes options from featureCollection', async () => {
    const mockFeatureCollection = {
      type: 'FeatureCollection' as const,
      features: [
        { type: 'Feature', properties: { name: 'Result A' }, geometry: { type: 'Point', coordinates: [1, 2] } },
        { type: 'Feature', properties: { name: 'Result B' }, geometry: { type: 'Point', coordinates: [3, 4] } },
      ]
    };

    const useSearchMock = jest.requireMock('@terrestris/react-util').useSearch;
    useSearchMock.mockReturnValue({ featureCollection: mockFeatureCollection, loading: false });

    render(
      <SearchField
        searchFunction={jest.fn()}
        getValue={(f) => f.properties.name}
      />
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Result' } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByTitle('Result A')).toBeInTheDocument();
      expect(screen.getByTitle('Result B')).toBeInTheDocument();
    });
  });

  it('returns empty options when loading', () => {
    const useSearchMock = jest.requireMock('@terrestris/react-util').useSearch;
    useSearchMock.mockReturnValue({
      featureCollection: {
        type: 'FeatureCollection',
        features: [{ type: 'Feature', properties: { name: 'X' }, geometry: { type: 'Point', coordinates: [0, 0] } }]
      },
      loading: true
    });

    render(
      <SearchField
        searchFunction={jest.fn()}
        getValue={(f) => f.properties.name}
      />
    );

    expect(screen.queryByTitle('X')).not.toBeInTheDocument();
  });

  it('returns empty options when featureCollection is nil', () => {
    const useSearchMock = jest.requireMock('@terrestris/react-util').useSearch;
    useSearchMock.mockReturnValue({ featureCollection: undefined, loading: false });

    render(
      <SearchField
        searchFunction={jest.fn()}
        getValue={(f) => f.properties.name}
      />
    );

    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

});

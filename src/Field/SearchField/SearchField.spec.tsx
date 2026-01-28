import React from 'react';
import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';

import { SearchField, SearchProps } from './SearchField';

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
    fireEvent.change(input, { target: { value: 'A' } });
    // Wait a bit to ensure popup would have rendered if enabled
    await new Promise(res => setTimeout(res, 300));
    expect(screen.queryByText('A')).not.toBeVisible();
  });
});

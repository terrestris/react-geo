import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Geometry, Feature } from 'geojson';
import SearchField from './SearchField';

const features: Feature<Geometry, Record<string, any>>[] = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [1, 2] },
    properties: { name: 'A' }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [3, 4] },
    properties: { name: 'B' }
  }
];

const mockSearchFunction = jest.fn(async (term: string) => {
  if (!term) return { type: "FeatureCollection" as const, features: [] };
  return {
    type: "FeatureCollection" as const,
    features: features.filter(f => f.properties?.name?.toLowerCase().includes(term.toLowerCase()))
  };
});

describe('<SearchField />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and allows typing', () => {
    render(<SearchField searchFunction={mockSearchFunction} />);
    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'MJMJ' } });
    expect(input).toHaveValue('MJMJ');
  });

 it('disables autocomplete popup if autoCompleteDisabled is true', async () => {
    render(<SearchField searchFunction={mockSearchFunction} autoCompleteDisabled={true} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'A' } });
    // Wait a bit to ensure popup would have rendered if enabled
    await new Promise(res => setTimeout(res, 300));
    expect(screen.queryByText('A')).not.toBeInTheDocument();
  });
});

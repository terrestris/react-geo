import { render, screen } from '@testing-library/react';
import * as React from 'react';

import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import AddWmsLayerEntry from './AddWmsLayerEntry';

describe('<AddWmsLayerEntry />', () => {

  const testLayerName = 'OSM-WMS';
  const testLayerTitle = 'OSM-WMS - by terrestris';
  const testLayer = new OlLayerTile({
    visible: false,
    title: testLayerTitle,
    source: new OlSourceTileWMS({
      url: 'https://ows.terrestris.de/osm/service?',
      params: {
        'LAYERS': testLayerName,
        'TILED': true
      }
    })
  });

  it('is defined', () => {
    expect(AddWmsLayerEntry).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    expect(container).toBeVisible();
  });

  it('adds queryable icon if prop wmsLayer has queryable set to true', () => {
    testLayer.set('queryable', true);

    render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    const icon = screen.getByLabelText('queryable-info');

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fa-info');

    testLayer.set('queryable', false);
  });

  it('doesn\'t add queryable icon if prop wmsLayer has queryable set to false', () => {
    render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    const icon = screen.queryByLabelText('queryable-info');
    expect(icon).not.toBeInTheDocument();
  });

  it('adds copyright icon if prop wmsLayer has filled wmsAttribution', () => {
    const wmsAttribution = 'Test - attribution';
    testLayer.getSource().setAttributions(wmsAttribution);

    render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    const attributionIcons = screen.queryAllByLabelText('attribution-info');

    expect(attributionIcons[0]).toBeInTheDocument();
    expect(attributionIcons[0]).toHaveClass('fa-copyright');
    testLayer.getSource().setAttributions(null);
  });

  it('doesn\'t add copyright icon if prop wmsLayer no has filled attribution', () => {
    render(<AddWmsLayerEntry wmsLayer={testLayer} />);

    const attributionIcon = screen.queryByLabelText('attribution-info');
    expect(attributionIcon).not.toBeInTheDocument();
  });

  it('includes abstract in description text if abstract property is set for layer', () => {
    const abstract = 'abstract';
    testLayer.setProperties({
      abstract
    });

    render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    screen.getByText('OSM-WMS - by terrestris - abstract:');
  });

});

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

    expect(icon).toBeDefined();
    expect(icon.className).toContain('fa-info');

    testLayer.set('queryable', false);
  });

  it('doesn\'t add queryable icon if prop wmsLayer has queryable set to false', () => {
    render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    const icons = screen.queryAllByLabelText('queryable-info');
    expect(icons).toHaveLength(0);
  });

  it('adds copyright icon if prop wmsLayer has filled wmsAttribution', () => {
    const wmsAttribution = 'Test - attribution';
    testLayer.getSource().setAttributions(wmsAttribution);

    render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    const attributionIcons = screen.queryAllByLabelText('attribution-info');

    expect(attributionIcons).toHaveLength(1);
    expect(attributionIcons[0].className).toContain('fa-copyright');
    testLayer.getSource().setAttributions(null);
  });

  it('doesn\'t add copyright icon if prop wmsLayer no has filled attribution', () => {
    render(<AddWmsLayerEntry wmsLayer={testLayer} />);

    const attributionIcons = screen.queryAllByLabelText('attribution-info');
    expect(attributionIcons).toHaveLength(0);
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

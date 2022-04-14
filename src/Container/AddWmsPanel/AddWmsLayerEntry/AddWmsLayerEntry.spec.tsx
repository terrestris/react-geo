import { getElementError, queryAllByAttribute, queryByAttribute, render, screen } from '@testing-library/react';
import * as React from 'react';

import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import AddWmsLayerEntry from './AddWmsLayerEntry';

describe('<AddWmsLayerEntry />', () => {
  const testLayerName = 'OSM-WMS';
  const testLayerTitle = 'OSM-WMS - by terrestris';
  const testLayer = new OlLayerTile({
    visible: false,
    source: new OlSourceTileWMS({
      url: 'https://ows.terrestris.de/osm/service?',
      params: {
        'LAYERS': testLayerName,
        'TILED': true
      }
    })
  });
  testLayer.set('title', testLayerTitle);

  it('is defined', () => {
    expect(AddWmsLayerEntry).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    expect(container).toBeVisible();
  });

  it('adds queryable icon if prop wmsLayer has queryable set to true', () => {
    testLayer.set('queryable', true);

    const { container } = render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    const icon = container.getElementsByClassName('queryable-info');
    const iconClassList = Object.keys(icon.item(0).classList).map(k => icon.item(0).classList[k]);
    expect(iconClassList).toContain('fa-info');
    testLayer.set('queryable', false);
  });

  it('doesn\'t add queryable icon if prop wmsLayer has queryable set to false', () => {
    const { container } = render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    const icon = container.getElementsByClassName('queryable-info');
    expect(icon.length).toEqual(0);
  });

  it('adds copyright icon if prop wmsLayer has filled wmsAttribution', () => {
    const wmsAttribution = 'Test - attribution';
    testLayer.getSource().setAttributions(wmsAttribution);

    const { container } = render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    const icon = container.getElementsByClassName('attribution-info');
    const iconClassList = Object.keys(icon.item(0).classList).map(k => icon.item(0).classList[k]);
    expect(iconClassList).toContain('fa-copyright');

    testLayer.getSource().setAttributions(null);
  });

  it('doesn\'t add copyright icon if prop wmsLayer no has filled attribution', () => {
    const { container } = render(<AddWmsLayerEntry wmsLayer={testLayer} />);

    const attributionIcon = container.getElementsByClassName('attribution-info');
    expect(attributionIcon.length).toEqual(0);
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

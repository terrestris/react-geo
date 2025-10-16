import {
  render,
  screen
} from '@testing-library/react';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import * as React from 'react';

import TestUtil from '../../../Util/TestUtil';
import AddWmsLayerEntry from './AddWmsLayerEntry';

describe('<AddWmsLayerEntry />', () => {
  const testLayerName = 'OSM-WMS';
  const testLayerTitle = 'OSM-WMS - by terrestris';
  const testLayer = new OlLayerTile({
    visible: false,
    source: new OlSourceTileWMS({
      url: 'https://ows.terrestris.de/osm/service?',
      params: {
        LAYERS: testLayerName,
        TILED: true
      }
    })
  });
  testLayer.set('title', testLayerTitle);
  const labelIconAttribution = 'Icon indicating that attribution information for layer is available';
  const labelIconQueryable = 'Icon indicating that the layer is queryable';

  it('is defined', () => {
    expect(AddWmsLayerEntry).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    expect(container).toBeVisible();
  });

  it('adds queryable icon if prop wmsLayer has queryable set to true', () => {
    testLayer.set('queryable', true);

    const map = TestUtil.createMap();

    render(<AddWmsLayerEntry map={map} wmsLayer={testLayer} />);
    let icon;
    expect(() => {
      icon = screen.getByLabelText(labelIconQueryable);
    }).not.toThrow();
    expect(icon).toHaveClass('fa-info');

    testLayer.set('queryable', false);
  });

  it('doesn\'t add queryable icon if prop wmsLayer has queryable set to false', () => {
    render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    expect(() => {
      screen.getByLabelText(labelIconQueryable);
    }).toThrow();
  });

  it('adds copyright icon if prop wmsLayer has filled wmsAttribution', () => {
    const wmsAttribution = 'Test - attribution';
    testLayer.getSource()?.setAttributions(wmsAttribution);

    const map = TestUtil.createMap();
    render(<AddWmsLayerEntry map={map} wmsLayer={testLayer} />);
    let icon;
    expect(() => {
      icon = screen.getByLabelText(labelIconAttribution);
    }).not.toThrow();
    expect(icon).toHaveClass('fa-copyright');

    testLayer.getSource()?.setAttributions(undefined);
  });

  it('doesn\'t add copyright icon if prop wmsLayer has no attribution', () => {
    render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    expect(() => {
      screen.getByLabelText(labelIconAttribution);
    }).toThrow();
  });

  it('includes abstract in description text if abstract property is set for layer', () => {
    const abstract = 'abstract';
    testLayer.setProperties({
      abstract
    });

    render(<AddWmsLayerEntry wmsLayer={testLayer} />);
    expect(() => {
      screen.getByText('OSM-WMS - by terrestris - abstract:');
    }).not.toThrow();
  });

});

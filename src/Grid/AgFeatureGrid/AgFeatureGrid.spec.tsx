import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import _isNil from 'lodash/isNil';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import OlGeomGeometryCollection from 'ol/geom/GeometryCollection';
import OlLayerVector from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import OlSourceVector from 'ol/source/Vector';
import OlStyle from 'ol/style/Style';
import React from 'react';

import TestUtil from '../../Util/TestUtil';
import { defaultFeatureGridLayerName } from '../commonGrid';
import AgFeatureGrid from './AgFeatureGrid';

describe('<AgFeatureGrid />', () => {
  let map: OlMap;
  let features: OlFeature[];
  const data = [{
    id: 1,
    name: 'Shinji Kagawa'
  }, {
    id: 2,
    name: 'Marco Reus'
  }, {
    id: 3,
    name: 'Roman Weidenfeller'
  }];

  beforeEach(() => {
    map = TestUtil.createMap();
    features = data.map((prop) => TestUtil.generatePointFeature(prop));
  });

  afterEach(() => {
    TestUtil.removeMap(map);
    features = [];
  });

  it('is defined', () => {
    expect(AgFeatureGrid).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map});
    expect(wrapper).not.toBeUndefined();
  });

  it('initializes a vector layer on mount (if map prop is given)', () => {
    const testLayerName = 'my-test-vector-layer';
    let layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === testLayerName);
    expect(layerCand).toHaveLength(0);

    renderInMapContext(map, (
      <AgFeatureGrid
        features={features}
        layerName={testLayerName}
      />
    ));

    layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === testLayerName);

    expect(layerCand).toHaveLength(1);
    expect(layerCand[0]).toBeInstanceOf(OlLayerVector);
  });


  it('sets the given featureStyle to the featurelayer', () => {
    const featureStyle = new OlStyle();
    renderInMapContext(map, (
      <AgFeatureGrid
        features={features}
        featureStyle={featureStyle}
      />
    ));

    const layerCand = map.getLayers().getArray().find(layer => layer.get('name') === defaultFeatureGridLayerName);

    expect((layerCand as OlLayerVector<OlSourceVector>)?.getStyle()).toBe(featureStyle);
  });

  it('removes the vector layer from the map on unmount', () => {
    const { unmount } = renderInMapContext(map, (
      <AgFeatureGrid
        features={features}
      />
    ));

    unmount();

    const layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === defaultFeatureGridLayerName);

    expect(layerCand).toHaveLength(0);
  });

  it('renders the given features (in the layer and the grid)', () => {
    renderInMapContext(map, (
      <AgFeatureGrid
        features={features}
      />
    ));

    const layerCand = map.getLayers().getArray().find(layer => layer.get('name') === defaultFeatureGridLayerName);

    expect((layerCand as OlLayerVector<OlSourceVector>)?.getSource()?.getFeatures()).toHaveLength(3);

    data.forEach( ({ name }) => {
      expect(screen.getByText(name)).toBeVisible();
    });
  });

  it('fits the map to show all given features', () => {
    const mapViewFitSpy = jest.spyOn(map.getView(), 'fit');
    renderInMapContext(map, (
      <AgFeatureGrid
        features={features}
        zoomToExtent
      />
    ));

    const featGeometries: OlGeometry[] = [];
    features.forEach(feature => {
      if (!_isNil(feature.getGeometry())) {
        featGeometries.push(feature.getGeometry()!);
      }
    });

    expect(mapViewFitSpy).toHaveBeenCalledWith(new OlGeomGeometryCollection(featGeometries).getExtent());
  });

  it('applies the feature select style to the clicked table row', async () => {
    const selectStyle = new OlStyle();

    renderInMapContext(map, (
      <AgFeatureGrid
        features={features}
        selectable={true}
        selectStyle={selectStyle}
      />
    ));


    // TODO: check how can checkbox select be triggered correctly using testing-library
    const rows = screen.getAllByRole('presentation');

    for (const row of rows) {
      if (row.className.indexOf('ag-checkbox-input') > -1) {
        await userEvent.click(row);
      }
    }

    const layerCand = map.getLayers().getArray().find(layer => layer.get('name') === defaultFeatureGridLayerName);

    const feats = (layerCand as OlLayerVector<OlSourceVector>)?.getSource()?.getFeatures() || [];

    for (const feat of feats) {
      expect(feat.getStyle()).toBeDefined(); // TODO
    }
  });

  it('resets all given features to default feature style', () => {
    renderInMapContext(map, (
      <AgFeatureGrid
        features={features}
      />
    ));

    features.forEach(feature => {
      expect(feature.getStyle()).toBeNull();
    });
  });

  it('highlights the feature on row mouse over', async () => {
    const hoverStyle = new OlStyle();

    renderInMapContext(map, (
      <AgFeatureGrid
        features={features}
        highlightStyle={hoverStyle}
      />
    ));

    const row = screen.getByText('Shinji Kagawa');

    await userEvent.hover(row);

    const layerCand = map.getLayers().getArray().find(layer => layer.get('name') === defaultFeatureGridLayerName);
    const featCand = (layerCand as OlLayerVector<OlSourceVector>)?.getSource()?.getFeatures()
      .find(feat => feat.get('name') === 'Shinji Kagawa');

    expect(featCand?.getStyle()).toBe(hoverStyle);
  });


  it('respects the column definition override', async () => {
    const columnNameToCheck = 'My nice test column header';
    renderInMapContext(map, (
      <AgFeatureGrid
        features={features}
        columnDefs={[{
          field: 'TEST',
          filter: true,
          headerName: columnNameToCheck,
          resizable: true,
          sortable: true
        }]}
      />
    ));
    const columnTitle = screen.getByText(columnNameToCheck);

    expect(columnTitle).toBeVisible();
  });

});

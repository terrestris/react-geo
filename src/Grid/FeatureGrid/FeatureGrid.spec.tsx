import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OlFeature from 'ol/Feature';
import OlLayerVector from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import OlStyle from 'ol/style/Style';
import React from 'react';

import TestUtil from '../../Util/TestUtil';
import { defaultFeatureGridLayerName } from '../commonGrid';
import FeatureGrid from './FeatureGrid';

describe('<FeatureGrid />', () => {
  let map: OlMap;
  let features: OlFeature[];

  beforeEach(() => {
    map = TestUtil.createMap();
    features = [{
      id: 1,
      name: 'Shinji Kagawa'
    }, {
      id: 2,
      name: 'Marco Reus'
    }, {
      id: 3,
      name: 'Roman Weidenfeller'
    }].map((prop) => TestUtil.generatePointFeature(prop));
  });

  afterEach(() => {
    TestUtil.removeMap(map);
    features = [];
  });

  it('is defined', () => {
    expect(FeatureGrid).toBeDefined();
  });

  it('can be rendered', () => {
    const { container } = render(
      <FeatureGrid
        features={features}
      />
    );

    expect(container).toBeVisible();
  });

  it('initializes a vector layer on mount', () => {
    let layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === defaultFeatureGridLayerName);

    expect(layerCand).toHaveLength(0);

    renderInMapContext(map, (
      <FeatureGrid
        features={features}
      />
    ));

    layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === defaultFeatureGridLayerName);

    expect(layerCand).toHaveLength(1);
    expect(layerCand[0]).toBeInstanceOf(OlLayerVector);
  });

  it('sets the given featureStyle to the featurelayer', () => {
    const featureStyle = new OlStyle();

    renderInMapContext(map, (
      <FeatureGrid
        features={features}
        featureStyle={featureStyle}
      />
    ));

    const layerCand = map.getLayers().getArray().find(layer => layer.get('name') === defaultFeatureGridLayerName);

    expect((layerCand as OlLayerVector<OlFeature>)?.getStyle()).toBe(featureStyle);
  });

  it('removes the vector layer from the map on unmount', () => {
    const { unmount } = renderInMapContext(map, (
      <FeatureGrid
        features={features}
      />
    ));

    unmount();

    const layerCand = map.getLayers().getArray().find(layer => layer.get('name') === defaultFeatureGridLayerName);

    expect(layerCand).toBeUndefined();
  });

  it('renders the given features (in the layer and the grid)', () => {
    renderInMapContext(map, (
      <FeatureGrid
        features={features}
      />
    ));

    const layerCand = map.getLayers().getArray().find(layer => layer.get('name') === defaultFeatureGridLayerName);

    expect((layerCand as OlLayerVector<OlFeature>)?.getSource()?.getFeatures()).toHaveLength(3);

    expect(screen.getByText('Shinji Kagawa')).toBeVisible();
    expect(screen.getByText('Marco Reus')).toBeVisible();
    expect(screen.getByText('Roman Weidenfeller')).toBeVisible();
  });

  it('respects the attributeBlacklist', () => {
    renderInMapContext(map, (
      <FeatureGrid
        features={features}
        attributeBlacklist={['name']}
      />
    ));

    expect(screen.queryByText('Shinji Kagawa')).not.toBeInTheDocument();
    expect(screen.queryByText('Marco Reus')).not.toBeInTheDocument();
    expect(screen.queryByText('Roman Weidenfeller')).not.toBeInTheDocument();
  });

  it('applies the feature hover style to the hovered table row', async () => {
    const hoverStyle = new OlStyle();

    renderInMapContext(map, (
      <FeatureGrid
        features={features}
        highlightStyle={hoverStyle}
      />
    ));

    const row = screen.getByText('Shinji Kagawa');

    await userEvent.hover(row);

    const layerCand = map.getLayers().getArray().find(layer => layer.get('name') === defaultFeatureGridLayerName);
    const featCand = (layerCand as OlLayerVector<OlFeature>)?.getSource()?.getFeatures()
      .find(feat => feat.get('name') === 'Shinji Kagawa');

    expect(featCand?.getStyle()).toBe(hoverStyle);
  });

  it('applies the feature select style to the clicked table row', async () => {
    const selectStyle = new OlStyle();

    renderInMapContext(map, (
      <FeatureGrid
        features={features}
        selectable={true}
        selectStyle={selectStyle}
      />
    ));

    const rows = screen.getAllByRole('checkbox');
    // Ignore the first one ("Select all")
    rows.shift();

    for (const row of rows) {
      await userEvent.click(row);
    }

    const layerCand = map.getLayers().getArray().find(layer => layer.get('name') === defaultFeatureGridLayerName);

    const feats = (layerCand as OlLayerVector<OlFeature>)?.getSource()?.getFeatures() || [];

    for (const feat of feats) {
      expect(feat.getStyle()).toBe(selectStyle);
    }
  });

  it('zooms to the feature of the clicked table row', async () => {
    renderInMapContext(map, (
      <FeatureGrid
        features={features}
      />
    ));

    const row = screen.getByText('Shinji Kagawa');

    expect(map.getView().getZoom()).toBeCloseTo(17, 0.05);

    await userEvent.click(row);

    expect(map.getView().getZoom()).toBeCloseTo(28);
  });

  it('respects the column definition override', async () => {
    renderInMapContext(map, (
      <FeatureGrid
        features={features}
        columns={[{
          key: 'name',
          dataIndex: 'name',
          title: 'Name override'
        }]}
      />
    ));

    const columnTitle = screen.getByText('Name override');

    expect(columnTitle).toBeVisible();
  });
});


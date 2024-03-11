import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { render } from '@testing-library/react';
import OlInteractionDraw from 'ol/interaction/Draw';
import OlLayerVector from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import React from 'react';

import TestUtil from '../../Util/TestUtil';
import MeasureButton from './MeasureButton';

describe('<MeasureButton />', () => {

  let map: OlMap;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  it('is defined', () => {
    expect(MeasureButton).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(
      <MeasureButton
        measureType='line'
      />
    );
    expect(container).toBeVisible();
  });

  it('creates a draw interaction and toggles its active state', async () => {
    const { rerenderInMapContext } = renderInMapContext(
      map,
      <MeasureButton
        measureType='angle'
      />
    );

    let drawInteractions = map.getInteractions().getArray()
      .filter(interaction => interaction instanceof OlInteractionDraw);

    expect(drawInteractions).toHaveLength(1);

    expect(drawInteractions[0].getActive()).toBeFalsy();

    rerenderInMapContext(
      <MeasureButton
        measureType='angle'
        pressed={true}
      />
    );

    drawInteractions = map.getInteractions().getArray()
      .filter(interaction => interaction instanceof OlInteractionDraw);

    expect(drawInteractions[0].getActive()).toBeTruthy();

    rerenderInMapContext(
      <MeasureButton
        measureType='angle'
        pressed={false}
      />
    );

    drawInteractions = map.getInteractions().getArray()
      .filter(interaction => interaction instanceof OlInteractionDraw);

    expect(drawInteractions[0].getActive()).toBeFalsy();
  });

  it('removes the draw interaction on unmount', () => {
    const { unmount } = renderInMapContext(
      map,
      <MeasureButton
        measureType='angle'
      />
    );

    const drawInteractions = map.getInteractions().getArray()
      .filter(interaction => interaction instanceof OlInteractionDraw);

    expect(drawInteractions).toHaveLength(1);

    unmount();

    const drawInteractionsAfterUnmount = map.getInteractions().getArray()
      .filter(interaction => interaction instanceof OlInteractionDraw);

    expect(drawInteractionsAfterUnmount).toHaveLength(0);
  });

  it('creates a vector layer and toggles its visibility', async () => {
    const { rerenderInMapContext } = renderInMapContext(
      map,
      <MeasureButton
        measureType='angle'
      />
    );

    let vectorLayers = map.getLayers().getArray()
      .filter(layer => layer instanceof OlLayerVector && layer.get('name') === 'react-geo_measure');

    expect(vectorLayers).toHaveLength(1);

    expect(vectorLayers[0].getVisible()).toBeFalsy();

    rerenderInMapContext(
      <MeasureButton
        measureType='angle'
        pressed={true}
      />
    );

    vectorLayers = map.getLayers().getArray()
      .filter(layer => layer instanceof OlLayerVector && layer.get('name') === 'react-geo_measure');

    expect(vectorLayers[0].getVisible()).toBeTruthy();

    rerenderInMapContext(
      <MeasureButton
        measureType='angle'
        pressed={false}
      />
    );

    vectorLayers = map.getLayers().getArray()
      .filter(layer => layer instanceof OlLayerVector && layer.get('name') === 'react-geo_measure');

    expect(vectorLayers[0].getVisible()).toBeFalsy();
  });

  it('removes the vector layer on unmount', () => {
    const { unmount } = renderInMapContext(
      map,
      <MeasureButton
        measureType='angle'
      />
    );

    const vectorLayers = map.getLayers().getArray()
      .filter(layer => layer instanceof OlLayerVector && layer.get('name') === 'react-geo_measure');

    expect(vectorLayers).toHaveLength(1);

    unmount();

    const vectorLayersAfterUnmount = map.getLayers().getArray()
      .filter(layer => layer instanceof OlLayerVector && layer.get('name') === 'react-geo_measure');

    expect(vectorLayersAfterUnmount).toHaveLength(0);
  });
});

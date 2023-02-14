import { act, fireEvent, render } from '@testing-library/react';
import OlMap from 'ol/Map';
import MapContext from '../Context/MapContext/MapContext';
import MapComponent from '../Map/MapComponent/MapComponent';
import * as React from 'react';
import { ReactElement } from 'react';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';

export async function actSetTimeout(time: number): Promise<void> {
  return act(async () => {
    return new Promise(resolve => setTimeout(resolve, time));
  });
}

/**
 * This function renders the given element inside a map context and initializes the map with size `[400, 400]`, ready
 * to be used by the event functions in this file.
 */
export function renderInMapContext(map: OlMap, element: ReactElement, size: [number, number] = [400, 400]) {
  const assemble = (newElement: ReactElement) => {
    return <MapContext.Provider value={map}>
      <MapComponent
        map={map}
        style={{
          position: 'absolute',
          left: '10px',
          top: '10px',
          width: '256px',
          height: '256px'
        }}
      />
      {newElement}
    </MapContext.Provider>;
  };

  const { rerender, ...results } = render(assemble(element));

  const rerenderInMapContext = (newElement: ReactElement) => {
    rerender(assemble(newElement));
  };

  return {
    rerenderInMapContext,
    ...results
  };
}

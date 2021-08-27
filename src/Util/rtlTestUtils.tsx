import { act, fireEvent, render } from '@testing-library/react';
import OlMap from 'ol/Map';
import MapContext from '../Context/MapContext/MapContext';
import MapComponent from '../Map/MapComponent/MapComponent';
import * as React from 'react';
import { ReactElement } from 'react';

export async function actSetTimeout(time: number): Promise<void> {
  return act(async () => {
    return new Promise(resolve => setTimeout(resolve, time));
  });
}

function fireClickEvents(map: OlMap, x: number, y: number) {
  const pointerId = Math.random().toFixed(10).slice(2);

  const evt1 = new MouseEvent('pointerdown', {
    clientX: x,
    clientY: y,
    button: 0
  });

  // @ts-ignore
  evt1.pointerId = pointerId;

  fireEvent(map.getViewport(), evt1);

  const evt2 = new MouseEvent('pointerup', {
    clientX: x,
    clientY: y,
    button: 0
  });

  // @ts-ignore
  evt2.pointerId = pointerId;

  fireEvent(document, evt2);
}

/**
 * Be aware that this will only work if the map was initialized with `setSize` and `renderSync` after adding it to
 * the dom.
 * @param map
 * @param x
 * @param y
 */
export function clickMap(map: OlMap, x: number, y: number) {
  jest.useFakeTimers();
  fireClickEvents(map, x, y);
  jest.runAllTimers();
  jest.useRealTimers();
}

/**
 * Be aware that this will only work if the map was initialized with `setSize` and `renderSync` after adding it to
 * the dom.
 * @param map
 * @param x
 * @param y
 */
export function doubleClickMap(map: OlMap, x: number, y: number) {
  fireClickEvents(map, x, y);
  fireClickEvents(map, x, y);
}

/**
 * This function renders the given element inside a map context and initializes the map with size `[400, 400]`, ready
 * to be used by the event functions in this file.
 */
export function renderInMapContext(map: OlMap, element: ReactElement, size: [number, number] = [400, 400]) {
  const assemble = (element: ReactElement) => {
    return <MapContext.Provider value={map}>
      <MapComponent map={map} />
      {element}
    </MapContext.Provider>;
  }

  const { rerender, ...results } = render(assemble(element));

  map.setSize([400, 400]);
  map.renderSync();

  const rerenderInMapContext = (element: ReactElement) => {
    rerender(assemble(element));
  }

  return {
    rerenderInContext: rerenderInMapContext,
    ...results
  };
}

import { act, fireEvent } from '@testing-library/react';
import OlMap from 'ol/Map';

export async function actSetTimeout(time: number): Promise<void> {
  return act(async () => {
    return new Promise(resolve => setTimeout(resolve, time));
  });
}

/**
 * Be aware that this will only work if the map was initialized with `setSize` and `renderSync` after adding it to
 * the dom.
 * @param map
 * @param x
 * @param y
 */
export function clickMap(map: OlMap, x: number, y: number) {
  const pointerId = Math.random().toFixed(10).slice(2);

  const evt1 = new MouseEvent('pointerdown', {
    clientX: x,
    clientY: y
  });

  evt1.pointerId = pointerId;

  fireEvent(map.getViewport(), evt1);

  const evt2 = new MouseEvent('pointerup', {
    clientX: x,
    clientY: y
  });

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
export function doubleClickMap(map: OlMap, x: number, y: number) {
  clickMap(map, x, y);
  clickMap(map, x, y);
}

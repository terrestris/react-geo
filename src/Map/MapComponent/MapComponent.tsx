import React, {
  useCallback, JSX, FC, ComponentProps, useState, useEffect
} from 'react';

import {
  DebouncedFunc
} from 'lodash';
import _debounce from 'lodash/debounce';

import OlMap from 'ol/Map';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import {
  Pixel
} from 'ol/pixel';

export type MapComponentProps = ComponentProps<'div'> & {
  firePointerRest?: boolean;
  map: OlMap;
  mapDivId?: string;
  pointerRestInterval?: number;
  pointerRestTolerance?: number;
};

export const MapComponent: FC<MapComponentProps> = ({
  firePointerRest = false,
  pointerRestInterval = 1,
  pointerRestTolerance = 1,
  map,
  mapDivId = 'map',
  ...passThroughProps
}): JSX.Element => {

  const [lastPointerPixel, setLastPointerPixel] = useState<Pixel>([-Infinity, -Infinity]);
  const [isMouseOverMapEl, setIsMouseOverMapEl] = useState<boolean>(false);

  const refCallback = useCallback((ref: HTMLDivElement) => {
    if (!map) {
      return;
    }
    if (ref === null) {
      map.setTarget(undefined);
    } else {
      map.setTarget(ref);
    }
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const checkPointerRest = (olEvt: OlMapBrowserEvent<PointerEvent | KeyboardEvent | WheelEvent>): void => {

      if (olEvt.dragging || !isMouseOverMapEl) {
        return;
      }
      const target: EventTarget | null = olEvt?.originalEvent?.target;
      if (target && (target as HTMLElement).tagName?.toLowerCase() !== 'canvas') {
        return;
      }

      const pixel: Pixel = olEvt.pixel;

      if (lastPointerPixel) {
        const deltaX: number = Math.abs(lastPointerPixel[0] - pixel[0]);
        const deltaY: number = Math.abs(lastPointerPixel[1] - pixel[1]);

        if (deltaX > pointerRestTolerance || deltaY > pointerRestTolerance) {
          setLastPointerPixel(pixel);
        } else {
          return;
        }
      } else {
        setLastPointerPixel(pixel);
      }

      olEvt.type = 'pointerrest';
      map.dispatchEvent(olEvt);
    };

    const debouncedCheckPointerRest: DebouncedFunc<(
      evt: OlMapBrowserEvent<PointerEvent | KeyboardEvent | WheelEvent>
    ) => void> =
      _debounce(
        checkPointerRest,
        pointerRestInterval
      );

    if (map) {
      if (firePointerRest) {
        map.on('pointermove', debouncedCheckPointerRest);
      }
    }
    return () => {
      if (firePointerRest) {
        map.un('pointermove', debouncedCheckPointerRest);
      }
    };

  }, [map, firePointerRest, isMouseOverMapEl, pointerRestInterval, lastPointerPixel, pointerRestTolerance]);

  if (!map) {
    return <></>;
  }

  return (
    <div
      id={mapDivId}
      ref={refCallback}
      className="map"
      onMouseOver={() => setIsMouseOverMapEl(true)}
      onMouseOut={() => setIsMouseOverMapEl(false)}
      role="presentation"
      {...passThroughProps}
    />
  );
};

export default MapComponent;

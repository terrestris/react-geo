import { render, fireEvent, act } from '@testing-library/react';
import { Map } from 'ol';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import React from 'react';

import TestUtil from '../../Util/TestUtil';
import MapComponent from './MapComponent';

if (typeof PointerEvent === 'undefined') {
  class PointerEvent extends MouseEvent {
    constructor(type: string, params?: PointerEventInit) {
      super(type, params);
    }
  }
  (global as any).PointerEvent = PointerEvent;
}

describe('<MapComponent />', () => {
  let map: Map;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  afterEach(() => {
    TestUtil.removeMap(map);
  });

  it('is defined', () => {
    expect(MapComponent).not.toBeUndefined();
  });

  it('renders nothing if no map is provided', () => {
    const { container } = render(
      <MapComponent map={undefined as any} />
    );
    expect(container.firstChild).toEqual(null);
  });

  it('can be rendered', () => {
    const { container } = render(
      <MapComponent map={map} />
    );
    expect(container).toBeVisible();
  });

  it('renders with default mapDivId "map"', () => {
    const { container } = render(
      <MapComponent map={map} />
    );
    expect(container.querySelector('#map')).not.toBeNull();
  });

  it('renders with custom mapDivId', () => {
    const { container } = render(
      <MapComponent map={map} mapDivId="custom-map-id" />
    );
    expect(container.querySelector('#custom-map-id')).not.toBeNull();
  });

  it('sets the map target on mount', () => {
    const setTargetSpy = jest.spyOn(map, 'setTarget');
    render(<MapComponent map={map} />);
    expect(setTargetSpy).toHaveBeenCalled();
  });

  it('unsets the map target on unmount', () => {
    const setTargetSpy = jest.spyOn(map, 'setTarget');
    const { unmount } = render(<MapComponent map={map} />);
    unmount();
    expect(setTargetSpy).toHaveBeenCalledWith(undefined);
  });

  it('applies passthrough props to the div', () => {
    const { container } = render(
      <MapComponent map={map} data-testid="map-div" />
    );
    expect(container.querySelector('[data-testid="map-div"]')).not.toBeNull();
  });

  it('updates isMouseOverMapEl on mouseOver and mouseOut', () => {
    const { container } = render(
      <MapComponent map={map} />
    );
    const mapDiv = container.querySelector('#map')!;

    act(() => {
      fireEvent.mouseOver(mapDiv);
    });

    act(() => {
      fireEvent.mouseOut(mapDiv);
    });

    expect(mapDiv).toBeInTheDocument();
  });

  it('registers pointermove listener when firePointerRest is true', () => {
    const onSpy = jest.spyOn(map, 'on');
    render(<MapComponent map={map} firePointerRest={true} />);
    expect(onSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
  });

  it('does not register pointermove listener when firePointerRest is false', () => {
    const onSpy = jest.spyOn(map, 'on');
    render(<MapComponent map={map} firePointerRest={false} />);
    expect(onSpy).not.toHaveBeenCalledWith('pointermove', expect.any(Function));
  });

  it('unregisters pointermove listener on unmount when firePointerRest is true', () => {
    const unSpy = jest.spyOn(map, 'un');
    const { unmount } = render(
      <MapComponent map={map} firePointerRest={true} />
    );
    unmount();
    expect(unSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
  });

  it('dispatches pointerrest event when pointer is at rest', () => {
    const dispatchSpy = jest.spyOn(map, 'dispatchEvent');

    const { container } = render(
      <MapComponent map={map} firePointerRest={true} pointerRestInterval={0} pointerRestTolerance={1} />
    );

    const mapDiv = container.querySelector('#map')!;

    act(() => {
      fireEvent.mouseOver(mapDiv);
    });

    const mockCanvas = document.createElement('canvas');
    const pointerEvent = new PointerEvent('pointermove');
    Object.defineProperty(pointerEvent, 'target', { value: mockCanvas });

    const mockOlEvent = {
      dragging: false,
      pixel: [10, 10],
      originalEvent: { target: mockCanvas },
      type: 'pointermove',
    } as unknown as OlMapBrowserEvent<PointerEvent>;

    act(() => {
      map.dispatchEvent(mockOlEvent as any);
    });

    expect(dispatchSpy).toHaveBeenCalled();
  });
});

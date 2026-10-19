import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import * as React from 'react';
import KeyboardPan from 'ol/interaction/KeyboardPan';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import OlMap from 'ol/Map';
import TestUtil from '../Util/TestUtil';

import KeyboardFeatureSelector from './KeyboardFeatureSelector';

describe('<KeyboardFeatureSelector />', () => {
  let map: OlMap;

  beforeEach(() => {
    map = TestUtil.createMap();
  });

  afterEach(() => {
    cleanup();
    TestUtil.removeMap(map);
  });

  it('renders its crosshair into the map viewport', () => {
    const { container } = renderInMapContext(map, <KeyboardFeatureSelector />);

    expect(container.querySelector('.react-geo-keyboard-feature-selector-crosshair')).toBeInTheDocument();
    expect(map.getViewport().querySelector('.react-geo-keyboard-feature-selector-crosshair')).toBeInTheDocument();
    expect(map.getTargetElement()).toHaveClass('react-geo-keyboard-map');
    expect(map.getTargetElement()).toHaveAttribute('tabindex', '0');
  });

  it('pans the map by the configured step and prevents the arrow key default', () => {
    const { unmount } = renderInMapContext(map, <KeyboardFeatureSelector panStep={5} />);
    const target = map.getTargetElement();
    const center = map.getView().getCenter()!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });

    target.dispatchEvent(event);

    expect(map.getView().getCenter()).toEqual([center[0] + 5, center[1]]);
    expect(event.defaultPrevented).toBe(true);
    unmount();
  });

  it('uses the coarse step with Shift and respects map rotation', () => {
    map.getView().setRotation(Math.PI / 2);
    const { unmount } = renderInMapContext(map, <KeyboardFeatureSelector panStepCoarse={20} />);
    const center = map.getView().getCenter()!;

    fireEvent.keyDown(map.getTargetElement(), { key: 'ArrowRight', shiftKey: true });

    const nextCenter = map.getView().getCenter()!;
    expect(nextCenter[0]).toBeCloseTo(center[0]);
    expect(nextCenter[1]).toBeCloseTo(center[1] + 20);
    unmount();
  });

  it('ignores arrow keys modified with Ctrl, Alt, or Meta', () => {
    const { unmount } = renderInMapContext(map, <KeyboardFeatureSelector />);
    const target = map.getTargetElement();
    const center = map.getView().getCenter();

    fireEvent.keyDown(target, { key: 'ArrowRight', ctrlKey: true });
    fireEvent.keyDown(target, { key: 'ArrowRight', altKey: true });
    fireEvent.keyDown(target, { key: 'ArrowRight', metaKey: true });

    expect(map.getView().getCenter()).toEqual(center);
    unmount();
  });

  it.each(['Enter', ' '])('calls onSelectCoordinate with the map center for %s', key => {
    const onSelectCoordinate = jest.fn();
    const { unmount } = renderInMapContext(map, <KeyboardFeatureSelector onSelectCoordinate={onSelectCoordinate} />);
    const center = map.getView().getCenter();
    const event = new KeyboardEvent('keydown', { key, cancelable: true });

    map.getTargetElement().dispatchEvent(event);

    expect(onSelectCoordinate).toHaveBeenCalledWith(center, map);
    expect(event.defaultPrevented).toBe(true);
    unmount();
  });

  it('simulates a map click with the configured event type when no callback is provided', () => {
    const { unmount } = renderInMapContext(map, <KeyboardFeatureSelector clickEventType="click" />);
    const dispatchEvent = jest.spyOn(map, 'dispatchEvent');
    const pointerEventDescriptor = Object.getOwnPropertyDescriptor(window, 'PointerEvent');
    Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });

    try {
      fireEvent.keyDown(map.getTargetElement(), { key: 'Enter' });
    } finally {
      if (pointerEventDescriptor) {
        Object.defineProperty(window, 'PointerEvent', pointerEventDescriptor);
      } else {
        Reflect.deleteProperty(window, 'PointerEvent');
      }
    }

    const dispatchedEvent = dispatchEvent.mock.calls
      .map(([event]) => event)
      .find((event): event is MapBrowserEvent => event instanceof MapBrowserEvent && event.type === 'click');
    if (!dispatchedEvent) {
      throw new Error('Expected the simulated map click event to be dispatched.');
    }
    expect(dispatchedEvent).toBeInstanceOf(MapBrowserEvent);
    expect(dispatchedEvent.type).toBe('click');
    unmount();
  });

  it('adds help text to the map description without replacing existing descriptions', () => {
    const { unmount, rerenderInMapContext } = renderInMapContext(map, <></>);
    const target = map.getTargetElement();
    target.setAttribute('aria-describedby', 'existing-description');
    const helpText = 'Use arrow keys to move the map.';

    rerenderInMapContext(<KeyboardFeatureSelector helpText={helpText} />);

    expect(screen.getByText(helpText)).toBeInTheDocument();
    expect(target.getAttribute('aria-describedby')).toMatch(/^existing-description\s+.+$/);
    unmount();
    expect(target).toHaveAttribute('aria-describedby', 'existing-description');
  });

  it('restores the target attributes and KeyboardPan interaction on unmount', () => {
    const { unmount, rerenderInMapContext } = renderInMapContext(map, <></>);
    const target = map.getTargetElement();
    const hadTabIndex = target.hasAttribute('tabindex');
    const keyboardPan = map.getInteractions().getArray().find(interaction => interaction instanceof KeyboardPan);
    expect(keyboardPan).toBeDefined();

    rerenderInMapContext(<KeyboardFeatureSelector />);

    expect(map.getInteractions().getArray()).not.toContain(keyboardPan);
    unmount();

    expect(map.getInteractions().getArray()).toContain(keyboardPan);
    expect(target).not.toHaveClass('react-geo-keyboard-map');
    expect(target.hasAttribute('tabindex')).toBe(hadTabIndex);
  });

  it('renders nothing when there is no map context', () => {
    const { container } = render(<KeyboardFeatureSelector />);

    expect(container).toBeEmptyDOMElement();
  });
});

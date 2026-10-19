import React, { CSSProperties, FC, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

import OlMap from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Coordinate, rotate } from 'ol/coordinate';
import KeyboardPan from 'ol/interaction/KeyboardPan';

import { useMap } from '@terrestris/react-util';

import './KeyboardFeatureSelector.less';

export interface KeyboardFeatureSelectorProps {
  /** Pan distance in pixels per arrow key press. Default: 16 */
  panStep?: number;
  /** Pan distance in pixels with Shift held. Default: 128 */
  panStepCoarse?: number;
  /** Remove OL's built-in KeyboardPan while mounted. Default: true */
  replaceDefaultKeyboardPan?: boolean;
  /**
   * Called on Enter/Space with the map center. By default a map click is
   * simulated at the center, so existing click-based tools (e.g. CoordinateInfo)
   * react to it.
   */
  onSelectCoordinate?: (coordinate: Coordinate, map: OlMap) => void;
  /** Event type simulated by the default `onSelectCoordinate`. Default: 'singleclick' */
  clickEventType?: string;
  /** Description announced with the map, e.g. the key bindings. */
  helpText?: string;
  className?: string;
}

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1]
};

export const simulateMapClick = (map: OlMap, coordinate: Coordinate, type = 'singleclick'): void => {
  const pixel = map.getPixelFromCoordinate(coordinate);
  const rect = map.getViewport().getBoundingClientRect();
  const originalEvent = new PointerEvent('pointerup', {
    clientX: rect.left + pixel[0],
    clientY: rect.top + pixel[1],
    pointerType: 'mouse',
    button: 0
  });
  map.dispatchEvent(new MapBrowserEvent(type, map, originalEvent));
};

export const KeyboardFeatureSelector: FC<KeyboardFeatureSelectorProps> = ({
  panStep = 16,
  panStepCoarse = 128,
  replaceDefaultKeyboardPan = true,
  onSelectCoordinate,
  clickEventType = 'singleclick',
  helpText,
  className = 'react-geo-keyboard-feature-selector-crosshair'
}) => {
  const map = useMap();
  const helpId = useId();

  useEffect(() => {
    if (!map) {
      return;
    }
    const el = map.getTargetElement();

    const hadTabIndex = el.hasAttribute('tabindex');
    if (!hadTabIndex) {
      el.tabIndex = 0;
    }
    const previousDescribedBy = el.getAttribute('aria-describedby');
    if (helpText) {
      el.setAttribute('aria-describedby', [previousDescribedBy, helpId].filter(Boolean).join(' '));
    }
    el.classList.add('react-geo-keyboard-map');

    const removed = replaceDefaultKeyboardPan
      ? map.getInteractions().getArray().filter(i => i instanceof KeyboardPan)
      : [];
    removed.forEach(i => map.removeInteraction(i));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }
      const arrow = ARROWS[e.key];
      if (arrow) {
        e.preventDefault();
        const view = map.getView();

        if (!view) {
          return;
        }

        const step = (e.shiftKey ? panStepCoarse : panStep) * view.getResolution()!;
        const delta = rotate([arrow[0] * step, arrow[1] * step], view.getRotation());
        const center = view.getCenter();

        if (!center) {
          return;
        }

        view.setCenter([center[0] + delta[0], center[1] + delta[1]]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const center = map.getView().getCenter();

        if (!center) {
          return;
        }
        if (onSelectCoordinate) {
          onSelectCoordinate(center, map);
        } else {
          simulateMapClick(map, center, clickEventType);
        }
      }
    };

    el.addEventListener('keydown', onKeyDown);
    return () => {
      el.removeEventListener('keydown', onKeyDown);
      el.classList.remove('react-geo-keyboard-map');
      if (!hadTabIndex) {
        el.removeAttribute('tabindex');
      }
      if (previousDescribedBy === null) {
        el.removeAttribute('aria-describedby');
      } else {
        el.setAttribute('aria-describedby', previousDescribedBy);
      }
      removed.forEach(i => map.addInteraction(i));
    };
  }, [map, panStep, panStepCoarse, replaceDefaultKeyboardPan, onSelectCoordinate, clickEventType, helpText, helpId]);

  if (!map) {
    return null;
  }

  const visuallyHidden: CSSProperties = {
    position: 'absolute', width: 1, height: 1, margin: -1, padding: 0,
    overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0
  };

  return (
    <>
      {createPortal(<div className={className} aria-hidden="true" />, map.getViewport())}
      {helpText && <span id={helpId} style={visuallyHidden}>{helpText}</span>}
    </>
  );
};

export default KeyboardFeatureSelector;

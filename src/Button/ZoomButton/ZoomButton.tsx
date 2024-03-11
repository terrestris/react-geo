import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import _isNumber from 'lodash/isNumber';
import { easeOut } from 'ol/easing';
import { AnimationOptions as OlViewAnimationOptions } from 'ol/View';
import * as React from 'react';

import { CSS_PREFIX } from '../../constants';
import SimpleButton, { SimpleButtonProps } from '../SimpleButton/SimpleButton';

interface OwnProps {
  /**
   * Whether the zoom in shall be animated.
   */
  animate?: boolean;
  /**
   * The delta to zoom when clicked. Defaults to positive `1` essentially zooming-in.
   * Pass negative numbers to zoom out.
   */
  delta?: number;
  /**
   * The options for the zoom animation. By default zooming will take 250
   * milliseconds and an easing which starts fast and then slows down will be
   * used.
   */
  animateOptions?: OlViewAnimationOptions;
  /**
   * The className which should be added.
   */
  className?: string;
}

export type ZoomButtonProps = OwnProps & SimpleButtonProps;

// The class name for the component.
const defaultClassName = `${CSS_PREFIX}zoominbutton`;

const ZoomButton: React.FC<ZoomButtonProps> = ({
  className,
  delta = 1,
  animate = true,
  animateOptions = {
    duration: 250,
    easing: easeOut
  },
  ...passThroughProps
}) => {

  const map = useMap();

  const onClick = () => {
    if (!map) {
      return;
    }

    const view = map.getView();
    if (!view) { // no view, no zooming
      return;
    }
    if (view.getAnimating()) {
      view.cancelAnimations();
    }
    const currentZoom = view.getZoom();
    if (!_isNumber(currentZoom)) {
      return;
    }
    const zoom = currentZoom + delta;
    if (animate) {
      const finalOptions = {
        zoom,
        duration: animateOptions.duration,
        easing: animateOptions.easing
      };
      view.animate(finalOptions);
    } else {
      view.setZoom(zoom);
    }
  };

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <SimpleButton
      className={finalClassName}
      onClick={onClick}
      {...passThroughProps}
    />
  );
};

export default ZoomButton;

import * as React from 'react';

import OlMap from 'ol/Map';
import { easeOut } from 'ol/easing';

import SimpleButton, { SimpleButtonProps } from '../SimpleButton/SimpleButton';
import { CSS_PREFIX } from '../../constants';
import { AnimationOptions as OlViewAnimationOptions } from 'ol/View';
import _isNumber from 'lodash/isNumber';

interface OwnProps {
  /**
   * Whether the zoom in shall be animated.
   */
  animate: boolean;
  /**
   * The delta to zoom when clicked. Defaults to positive `1` essentially zooming-in.
   * Pass negative numbers to zoom out.
   */
  delta: number;
  /**
   * The options for the zoom animation. By default zooming will take 250
   * milliseconds and an easing which starts fast and then slows down will be
   * used.
   */
  animateOptions: OlViewAnimationOptions;
  /**
   * The className which should be added.
   */
  className?: string;
  /**
   * Instance of OL map this component is bound to.
   */
  map: OlMap;
}

export type ZoomButtonProps = OwnProps & SimpleButtonProps;

/**
 * Class representing a zoom button.
 *
 * @class The ZoomButton
 * @extends React.Component
 */

const defaultClassName = `${CSS_PREFIX}zoominbutton`;

const ZoomButton: React.FC<ZoomButtonProps> = ({
  animate = true,
  delta = 1,
  animateOptions = {
    duration: 250,
    easing: easeOut
  },
  className,
  map,
  ...passThroughProps
}) => {

  const onClick = () => {
    const {
      duration,
      easing
    } = animateOptions;

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
        duration,
        easing
      };
      view.animate(finalOptions);
    } else {
      view.setZoom(zoom);
    }
  };

  const finalClassName = className
    ? `${className} ${defaultClassName}`
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

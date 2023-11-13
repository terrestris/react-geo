import _isNumber from 'lodash/isNumber';
import { easeOut } from 'ol/easing';
import OlMap from 'ol/Map';
import { AnimationOptions as OlViewAnimationOptions } from 'ol/View';
import * as React from 'react';

import { CSS_PREFIX } from '../../constants';
import SimpleButton, { SimpleButtonProps } from '../SimpleButton/SimpleButton';

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
class ZoomButton extends React.Component<ZoomButtonProps> {

  static defaultProps = {
    delta: 1,
    animate: true,
    animateOptions: {
      duration: 250,
      easing: easeOut
    }
  };

  /**
   * The className added to this component.
   * @private
   */
  _className = `${CSS_PREFIX}zoominbutton`;

  /**
   * Called when the button is clicked.
   *
   * @method
   */
  onClick() {
    const {
      map,
      animate,
      animateOptions: {
        duration,
        easing
      },
      delta
    } = this.props;

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
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      delta,
      animate,
      animateOptions,
      map,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this._className}`
      : this._className;

    return (
      <SimpleButton
        className={finalClassName}
        onClick={this.onClick.bind(this)}
        {...passThroughProps}
      />
    );
  }
}

export default ZoomButton;

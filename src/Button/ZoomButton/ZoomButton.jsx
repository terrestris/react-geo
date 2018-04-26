import React from 'react';
import PropTypes from 'prop-types';

import OlMap from 'ol/Map';
import easing from 'ol/easing';

import  {
  SimpleButton
} from '../../index';
import { CSS_PREFIX } from '../../constants';

/**
 * Class representing a zoom button.
 *
 * @class The ZoomButton
 * @extends React.Component
 */
class ZoomButton extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}zoominbutton`

  static propTypes = {
    /**
     * The className which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * Instance of OL map this component is bound to.
     *
     * @type {OlMap}
     */
    map: PropTypes.instanceOf(OlMap).isRequired,

    /**
     * The delta to zoom when clicked. Defaults to positive `1` essentially zooming-in.
     * Pass negative numbers to zoom out.
     */
    delta: PropTypes.number.isRequired,

    /**
     * Whether the zoom in shall be animated. Defaults to `true`.
     *
     * @type {Boolean}
     */
    animate: PropTypes.bool,

    /**
     * The options for the zoom in animation. By default zooming in will take
     * 250 milliseconds and an easing which starts fast and then slows down
     * will be used.
     */
    animateOptions: PropTypes.shape({
      duration: PropTypes.number,
      easing: PropTypes.func
    })
  }

  static defaultProps = {
    delta: 1,
    animate: true,
    animateOptions: {
      duration: 250,
      easing: easing.easeOut
    }
  }

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
    const currentZoom = view.getZoom();
    const zoom = currentZoom + delta;
    if (animate) {
      const finalOptions = {
        zoom,
        duration,
        easing
      };
      if (view.getAnimating()) {
        view.cancelAnimations();
      }
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
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

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

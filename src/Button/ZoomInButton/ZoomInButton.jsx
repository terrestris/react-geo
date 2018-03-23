import React from 'react';
import PropTypes from 'prop-types';

import OlMap from 'ol/map';
import easing from 'ol/easing';

import  {
  SimpleButton
} from '../../index';

/**
 * Class representating a zoom in button.
 *
 * @class The ZoomInButton
 * @extends React.Component
 */
class ZoomInButton extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = 'react-geo-zoominbutton'

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
     * Whether the zoom in shall be animated. Defaults to `true`.
     * 
     * @type {Boolean}
     */
    animate: PropTypes.bool,

    /**
     * The options for the zoom in animation. By default zooming in will take
     * 1000 milliseconds and an in-and-out easing (which starts slow, speeds up,
     * and then slows down again) will be used.
     */
    animateOptions: PropTypes.shape({
      duration: PropTypes.number,
      easing: PropTypes.function
    })
  }

  static defaultProps = {
    animate: true,
    animateOptions: {
      duration: 1000,
      easing: easing.inAndOut
    }
  }

  /**
   * Called when the button is clicked.
   *
   * @method
   */
  onClick() {
    const {map, animate, animateOptions: {duration, easing}} = this.props;
    const view = map.getView();
    const currentZoom = view.getZoom();
    const zoom = currentZoom + 1;
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

export default ZoomInButton;

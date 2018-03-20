import React from 'react';
import PropTypes from 'prop-types';

import OlMap from 'ol/map';

import  {
  SimpleButton
} from '../../index';

/**
 * Class representating a zoom in button.
 *
 * @class The ZoomOutButton
 * @extends React.Component
 */
class ZoomOutButton extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = 'react-geo-zoomoutbutton'

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
  }

  /**
   * Called when the button is clicked.
   *
   * @method
   */
  onClick = () => {
    const map = this.props.map;
    const view = map.getView();
    const currentZoom = view.getZoom();

    view.setZoom(currentZoom - 1);
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
        onClick={this.onClick}
        {...passThroughProps}
      />
    );
  }
}

export default ZoomOutButton;

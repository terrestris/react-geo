import React from 'react';
import PropTypes from 'prop-types';

import OlMap from 'ol/Map';
import OlSimpleGeometry from 'ol/geom/SimpleGeometry';
import { easeOut } from 'ol/easing';

import {
  SimpleButton
} from '../../index';
import { CSS_PREFIX } from '../../constants';

/**
 * Class representing a zoom to extent button.
 *
 *
 * @class The ZoomToExtentButton
 * @extends React.Component
 */
class ZoomToExtentButton extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}zoomtoextentbutton`

  static propTypes = {
    /**
     * The className which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * Instance of OL map this component is bound to.
     * @type {ol.Map}
     */
    map: PropTypes.instanceOf(OlMap).isRequired,

    /**
     * The extent `[minx, miny, maxx, maxy]` in the maps coordinate system or an
     * instance of ol.geom.SimpleGeometry that the map should zoom to.
     * @type {Array<Number>|OlSimpleGeometry}
     */
    extent: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.instanceOf(OlSimpleGeometry)
    ]).isRequired,

    /**
     * Options for fitting to the given extent. See
     * https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit
     * @type {Object}
     */
    fitOptions: PropTypes.object

  }

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    fitOptions: {
      constrainResolution: false,
      duration: 250,
      easing: easeOut
    }
  }

  /**
   * Called when the button is clicked.
   *
   * @method
   */
  onClick() {
    const{
      map,
      extent,
      fitOptions
    } = this.props;
    const view = map.getView();

    const {fitOptions: defaultFitOptions} = ZoomToExtentButton.defaultProps;

    if (!view) { // no view, no zooming
      return;
    }
    if (view.getAnimating()) {
      view.cancelAnimations();
    }

    const finalFitOptions = {
      ...defaultFitOptions,
      ...fitOptions
    };

    view.fit(extent, finalFitOptions);
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      fitOptions,
      ...passThroughProps
    } = this.props;
    const finalClassName = className ?
      `${className} ${this.className}` :
      this.className;

    return (
      <SimpleButton
        className = {finalClassName}
        onClick = {this.onClick.bind(this)}
        { ...passThroughProps}
      />
    );
  }
}

export default ZoomToExtentButton;

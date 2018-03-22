import React from 'react';
import PropTypes from 'prop-types';

import OlMap from 'ol/map';
import OlExtent from 'ol/extent';
import OlSimpleGeometry from 'ol/geom/simplegeometry';
import {
  SimpleButton
} from '../../index';
import { TestUtil } from '../../Util/TestUtil';


/**
 * Class representating an zoom to Extent button.
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
  className = 'react-geo-zoomtoextentbutton'

  static propTypes = {
    /**
     * The className which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * Instance of OL map this component is bound to.
     * 
     */
    map: PropTypes.instanceOf(OlMap).isRequired,
    
    /**
     * The array extent[minx, miny, maxx, maxy]  (the values must be in the maps coordination system)
     * or instance of Ol SimpleGeometry that the map should zoom to.
     * 
     */
    extent: PropTypes.oneOfType([
      PropTypes.array,//.instanceOf(OlExtent),
      PropTypes.instanceOf(OlSimpleGeometry)
    ]).isRequired
  }

  /**
   * Called when the button is clicked.
   *
   * @method
   */
  onClick = () => {
    const{map,extent} = this.props;
    const view = map.getView();
    view.fit(extent,{ constrainResolution: false});
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      ...passThroughProps
    } = this.props;
    const finalClassName = className ?
      `${className} ${this.className}` :
      this.className;

    return ( 
      <SimpleButton className = {
        finalClassName
      }
      onClick = {
        this.onClick
      } { ...passThroughProps}
      />
    );
  }
}

export default ZoomToExtentButton;

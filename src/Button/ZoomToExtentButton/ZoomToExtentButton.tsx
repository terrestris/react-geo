import React from 'react';

import OlMap from 'ol/Map';
import OlSimpleGeometry from 'ol/geom/SimpleGeometry';
import { easeOut } from 'ol/easing';

import SimpleButton from '../SimpleButton/SimpleButton';
import { CSS_PREFIX } from '../../constants';

interface ZoomToExtentButtonDefaultProps {
  /**
   * Options for fitting to the given extent. See
   * https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit
   * @type {Object}
   */
  fitOptions: {
    size?: [number, number];
    padding?: [number, number, number, number];
    nearest?: boolean;
    minResolution?: number;
    maxZoom?: number;
    duration?: number;
    easing?: () => number;
    callback?: () => void;
  };
  /**
   * If true, the view will always animate to the closest zoom level after an interaction.
   * False means intermediary zoom levels are allowed.
   * Default is false.
   */
  constrainViewResolution: boolean;
}

export interface ZoomToExtentButtonProps extends Partial<ZoomToExtentButtonDefaultProps> {
  /**
   * The className which should be added.
   */
  className?: string;
  /**
   * Instance of OL map this component is bound to.
   */
  map: OlMap;
  /**
   * The extent `[minx, miny, maxx, maxy]` in the maps coordinate system or an
   * instance of ol.geom.SimpleGeometry that the map should zoom to.
   */
  extent: number[] | OlSimpleGeometry;
}

/**
 * Class representing a zoom to extent button.
 *
 *
 * @class The ZoomToExtentButton
 * @extends React.Component
 */
class ZoomToExtentButton extends React.Component<ZoomToExtentButtonProps> {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  _className = `${CSS_PREFIX}zoomtoextentbutton`;

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps: ZoomToExtentButtonDefaultProps = {
    fitOptions: {
      duration: 250,
      easing: easeOut
    },
    constrainViewResolution: false
  };

  /**
   * Called when the button is clicked.
   *
   * @method
   */
  onClick() {
    const{
      map,
      extent,
      constrainViewResolution,
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

    view.setConstrainResolution(constrainViewResolution);

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
      constrainViewResolution,
      ...passThroughProps
    } = this.props;
    const finalClassName = className ?
      `${className} ${this._className}` :
      this._className;

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

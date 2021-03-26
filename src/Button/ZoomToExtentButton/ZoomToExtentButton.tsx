import * as React from 'react';

import _isFinite from 'lodash/isFinite';

import OlMap from 'ol/Map';
import OlSimpleGeometry from 'ol/geom/SimpleGeometry';
import { Coordinate as OlCoordinate } from 'ol/coordinate';
import { easeOut } from 'ol/easing';
import { Extent as OlExtent } from 'ol/extent';
import { FitOptions as OlViewFitOptions } from 'ol/View';

import SimpleButton, { SimpleButtonProps } from '../SimpleButton/SimpleButton';
import { CSS_PREFIX } from '../../constants';

import logger from '@terrestris/base-util/dist/Logger';

interface DefaultProps {
  /**
   * Options for fitting to the given extent. See
   * https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit
   */
  fitOptions: OlViewFitOptions;
  /**
   * If true, the view will always animate to the closest zoom level after an interaction.
   * False means intermediary zoom levels are allowed.
   * Default is false.
   */
  constrainViewResolution: boolean;
  /**
   * The extent `[minx, miny, maxx, maxy]` in the maps coordinate system or an
   * instance of ol.geom.SimpleGeometry that the map should zoom to.
   */
  extent?: OlExtent | OlSimpleGeometry;
  /**
   * The center `[x,y]` in the maps coordinate system or an
   * instance of ol.coordinate that the map should zoom to if no extent is given.
   */
  center?: OlCoordinate;
  /**
   *  The zoom level 'x' the map should zoom to if no extent is given.
   */
  zoom?: number;
}

interface BaseProps {
  /**
   * The className which should be added.
   */
  className?: string;
  /**
   * Instance of OL map this component is bound to.
   */
  map: OlMap;
}

export type ZoomToExtentButtonProps = BaseProps & Partial<DefaultProps> & SimpleButtonProps;

/**
 * Class representing a zoom to extent button.
 *
 *
 * @class The ZoomToExtentButton
 * @extends React.Component
 */
class ZoomToExtentButton extends React.Component<ZoomToExtentButtonProps> {

  /**
   * The default properties.
   */
  static defaultProps: DefaultProps = {
    fitOptions: {
      duration: 250,
      easing: easeOut
    },
    constrainViewResolution: false,
    extent: undefined,
    center: undefined,
    zoom: undefined
  };

  /**
   * The className added to this component.
   * @private
   */
  _className = `${CSS_PREFIX}zoomtoextentbutton`;

  /**
   * Called when the button is clicked.
   *
   * @method
   */
  onClick() {
    const {
      map,
      extent,
      constrainViewResolution,
      fitOptions,
      center,
      zoom
    } = this.props;
    const view = map.getView();

    const {fitOptions: defaultFitOptions} = ZoomToExtentButton.defaultProps;

    if (!view) { // no view, no zooming
      return;
    }
    if (!extent && (!center || !_isFinite(zoom))) {
      logger.error('zoomToExtentButton: You need to provide either an extent or a center and a zoom.');
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

    if (extent && (center && _isFinite(zoom))) {
      logger.warn('zoomToExtentButton: Both extent and center / zoom are provided. ' +
      'Extent will be used in favor of center / zoom');
    }
    if (extent) {
      view.fit(extent, finalFitOptions);
    }
    else if (center && _isFinite(zoom)) {
      view.setCenter(center);
      view.setZoom(zoom);
    }
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

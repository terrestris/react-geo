import logger from '@terrestris/base-util/dist/Logger';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import _isFinite from 'lodash/isFinite';
import { Coordinate as OlCoordinate } from 'ol/coordinate';
import { easeOut } from 'ol/easing';
import { Extent as OlExtent } from 'ol/extent';
import OlSimpleGeometry from 'ol/geom/SimpleGeometry';
import { FitOptions as OlViewFitOptions } from 'ol/View';
import * as React from 'react';

import { CSS_PREFIX } from '../../constants';
import SimpleButton, { SimpleButtonProps } from '../SimpleButton/SimpleButton';

interface OwnProps {
  /**
   * Options for fitting to the given extent. See
   * https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit
   */
  fitOptions?: OlViewFitOptions;
  /**
   * If true, the view will always animate to the closest zoom level after an interaction.
   * False means intermediary zoom levels are allowed.
   * Default is false.
   */
  constrainViewResolution?: boolean;
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
   * The zoom level 'x' the map should zoom to if no extent is given.
   */
  zoom?: number;
  /**
   * The className which should be added.
   */
  className?: string;
}

export type ZoomToExtentButtonProps = OwnProps & SimpleButtonProps;

// The class name for the component.
const defaultClassName = `${CSS_PREFIX}zoomtoextentbutton`;

const ZoomToExtentButton: React.FC<ZoomToExtentButtonProps> = ({
  fitOptions = {
    duration: 250,
    easing: easeOut
  },
  constrainViewResolution = false,
  extent,
  center,
  zoom,
  className,
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
    if (!extent && (!center || !_isFinite(zoom))) {
      logger.error('zoomToExtentButton: You need to provide either an extent or a center and a zoom.');
      return;
    }
    if (view.getAnimating()) {
      view.cancelAnimations();
    }

    view.setConstrainResolution(constrainViewResolution);

    if (extent && (center && _isFinite(zoom))) {
      logger.warn('zoomToExtentButton: Both extent and center / zoom are provided. ' +
      'Extent will be used in favor of center / zoom');
    }
    if (extent) {
      view.fit(extent, fitOptions);
    } else if (center && _isFinite(zoom)) {
      view.setCenter(center);
      view.setZoom(zoom!);
    }
  };

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <SimpleButton
      className = {finalClassName}
      onClick = {onClick}
      { ...passThroughProps}
    />
  );
};

export default ZoomToExtentButton;

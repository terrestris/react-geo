import useMap from '@terrestris/react-util/dist/hooks/useMap';
import { zoomTo } from '@terrestris/react-util/dist/Util/ZoomUtil';
import _isFinite from 'lodash/isFinite';
import { Coordinate as OlCoordinate } from 'ol/coordinate';
import { easeOut } from 'ol/easing';
import { Extent as OlExtent } from 'ol/extent';
import OlSimpleGeometry from 'ol/geom/SimpleGeometry';
import { FitOptions as OlViewFitOptions } from 'ol/View';
import * as React from 'react';
import { useEffect, useState } from 'react';

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
   *  The zoom level 'x' the map should zoom to if no extent is given.
   */
  zoom?: number | undefined;
  /**
   * The className which should be added.
   */
  className?: string;
}

export type ZoomToExtentButtonProps = OwnProps & SimpleButtonProps;

/**
 * Class representing a zoom to extent button.
 *
 *
 * @class The ZoomToExtentButton
 * @extends React.Component
 */
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
  const [targetExtent, setTargetExtent] = useState<any>(extent);
  const [targetZoom, setTargetZoom] = useState(zoom);
  const [targetCenter, setTargetCenter] = useState(center);

  useEffect(() => {
    zoomTo(map, {
      animate: !!fitOptions,
      zoom: targetZoom,
      animateOptions: fitOptions,
      constrainViewResolution,
      extent: targetExtent,
      center: targetCenter
    });
  }, [map, fitOptions, targetZoom, fitOptions, constrainViewResolution, targetExtent, center]);

  /**
   * Called when the button is clicked.
   *
   * @method
   */
  const onClick = () => {
    if (!map) {
      return;
    }
    const view = map.getView();
    const currentCenter: number[] = view.getCenter() as number[];
    const currentExtent = view.calculateExtent();
    if (view.getZoom() !== zoom || (
      currentCenter !== center && center && (center[0] !== currentCenter[0] || center[1] !== currentCenter[1])
    ) || extent && (currentExtent[0] !== extent[0] || currentExtent[1] !== extent[1] ||
      currentExtent[2] !== extent[2] || currentExtent[3] !== extent[3])) {
      if (targetExtent && extent) {
        if ((extent as OlSimpleGeometry).getExtent) {
          setTargetExtent((extent as OlSimpleGeometry).getExtent());
        } else {
          setTargetExtent((extent as []).slice());
        }
      } else {
        setTargetZoom(targetZoom);
        if (targetCenter) {
          setTargetCenter(targetCenter.slice());
        }
      }
    }
  };

  return (
    <SimpleButton
      className = {className ? `${className} ${CSS_PREFIX}zoomtoextentbutton` : `${CSS_PREFIX}zoomtoextentbutton`}
      onClick = {onClick.bind(this)}
      { ...passThroughProps}
    />
  );
};

export default ZoomToExtentButton;

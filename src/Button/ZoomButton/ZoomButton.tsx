import useMap from '@terrestris/react-util/dist/hooks/useMap';
import _isNumber from 'lodash/isNumber';
import { easeOut } from 'ol/easing';
import { AnimationOptions as OlViewAnimationOptions } from 'ol/View';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { zoomTo } from '@terrestris/react-util/dist/Util/ZoomUtil';

import { CSS_PREFIX } from '../../constants';
import SimpleButton, { SimpleButtonProps } from '../SimpleButton/SimpleButton';

interface OwnProps {
  /**
   * Whether the zoom in shall be animated.
   */
  animate?: boolean;
  /**
   * The delta to zoom when clicked. Defaults to positive `1` essentially zooming-in.
   * Pass negative numbers to zoom out.
   */
  delta?: number;
  /**
   * The options for the zoom animation. By default zooming will take 250
   * milliseconds and an easing which starts fast and then slows down will be
   * used.
   */
  animateOptions?: OlViewAnimationOptions;
  /**
   * The className which should be added.
   */
  className?: string;
}

export type ZoomButtonProps = OwnProps & SimpleButtonProps;

/**
 * Class representing a zoom button.
 *
 * @class The ZoomButton
 * @extends React.Component
 */
export const ZoomButton: React.FC<ZoomButtonProps> = ({
  delta = 1,
  animate = true,
  animateOptions = {
    duration: 250,
    easing: easeOut
  },
  className,
  ...passThroughProps
}) => {
  const [zoom, setZoom] = useState(1);
  const map = useMap();

  useEffect(() => {
    zoomTo(map, {
      animate,
      animateOptions,
      zoom,
      constrainViewResolution: true,
      center: undefined,
      extent: undefined
      });
  }, [map, animate, animateOptions, zoom]);

  useEffect(() => {
    if (map) {
      setZoom(map.getView().getZoom() || 1);
    }
  }, [map]);

  /**
   * Called when the button is clicked.
   *
   * @method
   */
  const onClick = () => {
    setZoom(zoom + delta);
  };

  return (
    <SimpleButton
      className={className ? `${className} ${CSS_PREFIX}zoominbutton` : `${CSS_PREFIX}zoominbutton`}
      onClick={onClick}
      {...passThroughProps}
    />
  );

};

export default ZoomButton;

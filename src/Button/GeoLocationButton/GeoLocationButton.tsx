import React, {
  FC
} from 'react';

import {
  type GeoLocation,
  useGeoLocation
} from '@terrestris/react-util/dist/Hooks/useGeoLocation/useGeoLocation';

import { CSS_PREFIX } from '../../constants';
import ToggleButton, { ToggleButtonProps } from '../ToggleButton/ToggleButton';

interface OwnProps {
  trackingOptions?: PositionOptions;
  /**
   * Will be called if geolocation fails.
   */
  onError?: () => void;
  /**
   * Will be called when position changes. Receives an object with the properties
   * position, accuracy, heading and speed
   */
  onGeoLocationChange?: (geolocation: GeoLocation) => void;
  /**
   * Whether to show a map marker at the current position.
   */
  showMarker?: boolean;
  /**
   * Whether to follow the current position.
   */
  follow?: boolean;
  /**
   * Enable tracking of GeoLocations
   */
  enableTracking?: boolean;
}

export type GeoLocationButtonProps = OwnProps & Partial<ToggleButtonProps>;

export const GeoLocationButton: FC<GeoLocationButtonProps> = ({
  className,
  follow = false,
  enableTracking = false,
  onGeoLocationChange = () => undefined,
  onError = () => undefined,
  showMarker = true,
  trackingOptions,
  pressed,
  ...passThroughProps
}) => {

  useGeoLocation({
    active: !!pressed,
    enableTracking: pressed && enableTracking,
    follow,
    onError,
    onGeoLocationChange,
    showMarker,
    trackingOptions
  });

  const finalClassName = className
    ? `${className} ${CSS_PREFIX}geolocationbutton`
    : `${CSS_PREFIX}geolocationbutton`;

  return (
    <ToggleButton
      pressed={pressed}
      className={finalClassName}
      {...passThroughProps}
    />
  );
};

export default GeoLocationButton;

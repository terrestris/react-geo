import React, { FC, useState } from 'react';

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
  /**
   * Boolean callback for when the button is toggled outside of a ToggleGroup
   */
  onPressedChange?: (pressed: boolean) => void;
}

export type GeoLocationButtonProps = OwnProps & Partial<ToggleButtonProps>;

export const GeoLocationButton: FC<GeoLocationButtonProps> = ({
  className,
  enableTracking = false,
  follow = false,
  onChange,
  onError = () => undefined,
  onGeoLocationChange = () => undefined,
  pressed,
  showMarker = true,
  trackingOptions,
  onPressedChange,
  ...passThroughProps
}) => {
  const [internalPressed, setInternalPressed] = useState(false);
  const isControlled = typeof pressed === 'boolean';
  const effectivePressed = isControlled ? !!pressed : internalPressed;

  useGeoLocation({
    active: effectivePressed,
    enableTracking: effectivePressed && enableTracking,
    follow,
    onError,
    onGeoLocationChange,
    showMarker,
    trackingOptions
  });

  const finalClassName = className
    ? `${className} ${CSS_PREFIX}geolocationbutton`
    : `${CSS_PREFIX}geolocationbutton`;

  const handleChange: ToggleButtonProps['onChange'] = (evt, value) => {
    if (!isControlled) {
      setInternalPressed(prevPressed => {
        const nextPressed = !prevPressed;
        onPressedChange?.(nextPressed);
        return nextPressed;
      });
    } else {
      onPressedChange?.(!effectivePressed);
    }
    onChange?.(evt, value);
  };

  return (
    <ToggleButton
      pressed={effectivePressed}
      className={finalClassName}
      onChange={handleChange}
      {...passThroughProps}
    />
  );
};

export default GeoLocationButton;

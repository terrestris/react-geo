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
  /**
   * Will be called when the button is toggled
   */
  onChange?: (pressed: boolean) => void;
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
  value,
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

  const handleToggleButtonChange = (evt: React.MouseEvent<HTMLButtonElement>, buttonValue?: string) => {
    if (onChange) {
      if (buttonValue !== undefined) {
        // ToggleGroup context
        (onChange as any)(evt, buttonValue);
      } else {
        // Standalone context
        const newPressed = buttonValue !== undefined || !pressed;
        onChange(newPressed);
      }
    }
  };

  return (
    <ToggleButton
      pressed={pressed}
      className={finalClassName}
      onChange={handleToggleButtonChange}
      value={value}
      {...passThroughProps}
    />
  );
};

export default GeoLocationButton;

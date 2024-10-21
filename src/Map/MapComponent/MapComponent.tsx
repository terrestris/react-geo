import React, {
  useCallback
} from 'react';

import OlMap from 'ol/Map';

export type MapComponentProps = React.ComponentProps<'div'> & {
  map: OlMap;
  mapDivId?: string;
};

export const MapComponent: React.FC<MapComponentProps> = ({
  map,
  mapDivId = 'map',
  ...passThroughProps
}): JSX.Element => {

  const refCallback = useCallback((ref: HTMLDivElement) => {
    if (!map) {
      return;
    }
    if (ref === null) {
      map.setTarget(undefined);
    } else {
      map.setTarget(ref);
    }
  }, [map]);

  if (!map) {
    return <></>;
  }

  return (
    <div
      id={mapDivId}
      ref={refCallback}
      className="map"
      role="presentation"
      {...passThroughProps}
    />
  );
};

export default MapComponent;

import React, {
  useCallback
} from 'react';

import OlMap from 'ol/Map';

import './index.less';

export interface MapComponentProps extends React.ComponentProps<'div'> {
  map: OlMap | undefined;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  id = 'map',
  map,
  ...passThroughProps
}): JSX.Element => {

  const refCallback = useCallback((ref: HTMLDivElement) => {
    if (!map) {
      return;
    }
    if (ref == null) {
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
      id={id}
      ref={refCallback}
      className="map"
      role="region"
      {...passThroughProps}
    />
  );
};

export default MapComponent;

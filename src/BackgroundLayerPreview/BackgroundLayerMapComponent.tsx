// BackgroundLayerMapComponent.tsx
import React from 'react';
import OlMap from 'ol/Map';
import MapComponent from '../Map/MapComponent/MapComponent';

type BackgroundLayerMapProps = {
  mapDivId: string;
  height: number;
  width: number;
  map: OlMap | null;
};

const BackgroundLayerMapComponent: React.FC<BackgroundLayerMapProps> = ({
  mapDivId,
  height,
  width,
  map
}) => {
  return map ? (
    <MapComponent
      mapDivId={mapDivId}
      style={{ height, width }}
      map={map}
    />
  ) : null;
};

export default BackgroundLayerMapComponent;

This demonstrates the use of the GeoLocation button.

```jsx
import GeoLocationButton from '@terrestris/react-geo/dist/Button/GeoLocationButton/GeoLocationButton';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import React, { useEffect, useState } from 'react';

const GeoLocationButtonExample = () => {

  const [map, setMap] = useState();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    setMap(new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOSM()
        })
      ],
      view: new OlView({
        center: fromLonLat([8, 50]),
        zoom: 9
      })
    }));
  }, []);

  const handleGeoLocationChange = (isPressed) => {
    setPressed(isPressed);
  };

  const handlePositionChange = (geolocation) => {
    if (map && geolocation.position) {
      map.getView().setCenter(geolocation.position);
    }
  };

  const handleError = () => {
    console.error('Geolocation failed');
    setPressed(false);
  };

  if (!map) {
    return null;
  }

  return (
    <MapContext.Provider value={map}>
      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />
      <GeoLocationButton
        showMarker={true}
        follow={true}
        enableTracking={true}
        pressed={pressed}
        onChange={handleGeoLocationChange}
        onGeoLocationChange={handlePositionChange}
        onError={handleError}
        trackingOptions={{
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }}
      >
        Track location
      </GeoLocationButton>
    </MapContext.Provider>
  );
}

<GeoLocationButtonExample />
```

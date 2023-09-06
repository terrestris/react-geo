This example shows the usage of the MapComponent in combination with the MapContext.Provider.

```jsx
import MapContext from '@terrestris/react-geo/dist/Context/MapContext/MapContext';
import NominatimSearch from '@terrestris/react-geo/dist/Field/NominatimSearch/NominatimSearch';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

const MapComponentExample = () => {

  const layer = new OlLayerTile({
    source: new OlSourceOsm()
  });

  const mapId = `map-${Math.random()}`;

  const map = new OlMap({
    target: mapId,
    view: new OlView({
      center: [
        135.1691495,
        34.6565482
      ],
      projection: 'EPSG:4326',
      zoom: 16,
    }),
    layers: [layer]
  });

  return (
    <MapContext.Provider value={map}>
      NominatimSearch:
      <NominatimSearch map={map} />
      <MapComponent
        map={map}
        id={mapId}
        style={{
          height: '400px'
        }}
      />
    </MapContext.Provider>
  );
}

<MapComponentExample />
```

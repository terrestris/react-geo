This example shows the usage of the MapComponent in combination with the MapContext.Provider.

```jsx
import * as React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';

import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import NominatimSearch from '@terrestris/react-geo/dist/Field/NominatimSearch/NominatimSearch';
import MapContext from '@terrestris/react-geo/dist/Context/MapContext/MapContext';

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

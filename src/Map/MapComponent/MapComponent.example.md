This example shows the usage of the MapComponent.

```jsx
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import {
  fromLonLat
} from 'ol/proj';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import React from 'react';

const MapComponentExample = () => {
  const map = new OlMap({
    view: new OlView({
      center: fromLonLat([
        7.1219992,
        50.729458
      ]),
      zoom: 11
    }),
    layers: [
      new OlLayerTile({
        source: new OlSourceOsm()
      })
    ]
  });

  return (
    <MapComponent
      map={map}
      style={{
        height: '400px'
      }}
    />
  );
}

<MapComponentExample />
```

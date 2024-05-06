This example shows the usage of the MapContext which uses the new React Context API introduced
with [react 16.3](https://reactjs.org/docs/context.html).

If you are using function-components head over to the `useMap` example in the "HOOKS" section.

```jsx
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

const MapContextExample = () => {

  const layer = new OlLayerTile({
    source: new OlSourceOsm()
  });
  const olMap = new OlMap({
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
    <MapContext.Provider value={olMap}>
      <MapComponent
        map={olMap}
        style={{
          height: '400px'
        }}
      />
    </MapContext.Provider>
  );
}

<MapContextExample />
```

This example shows the usage of the MapContext which uses the new React Context API introduced
with [react 16.3](https://reactjs.org/docs/context.html).

```jsx
import LayerTree from '@terrestris/react-geo/dist/LayerTree/LayerTree';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import { useMap } from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

const layer = new OlLayerTile({
  source: new OlSourceOsm(),
  name: 'OSM'
});
const openlayersMap = new OlMap({
  target: null,
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

function ComponentToUseTheMap() {
  const map = useMap();

  // This is example specific and usually not needed
  React.useEffect(() => {
    map.setTarget('usemap-map');
  }, [map]);

  return (
    <MapComponent
      id={'usemap-map'}
      map={map}
      style={{
        height: '400px'
      }}
    />
  );
}

function LayerTreeToUseTheMap() {
  const map = useMap();

  return (
    <LayerTree
      map={map}
    />
  );
}

function UseMapExample() {
  return (
    <MapContext.Provider value={openlayersMap}>
      <ComponentToUseTheMap />
      <LayerTreeToUseTheMap />
    </MapContext.Provider>
  );
}

<UseMapExample />
```

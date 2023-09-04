This example shows the usage of the DropTargetMap HOC by use of the onDropAware
function.

```jsx
import * as React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';

import onDropAware from '@terrestris/react-geo/dist/HigherOrderComponent/DropTargetMap/DropTargetMap';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-geo/dist/Context/MapContext/MapContext';
import { useMap } from '@terrestris/react-geo/dist/Hook/useMap';

const DropTargetMapExample = () => {

  const layer = new OlLayerTile({
    source: new OlSourceOSM()
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

  const mapComponent = () => {
    const map = useMap();
    return (
      <MapComponent
        map={map}
        style={{
          height: '512px'
        }}
      />
    );
  };

  const DropTargetMapComponent = onDropAware(mapComponent);

  return (
    <MapContext.Provider value={olMap}>
      <DropTargetMapComponent map={olMap}/>
    </MapContext.Provider>
  )
}

<DropTargetMapExample />
```

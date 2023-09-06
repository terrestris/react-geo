This example shows the usage of the DropTargetMap HOC by use of the onDropAware
function.

```jsx
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import onDropAware from '@terrestris/react-util/dist/HigherOrderComponent/DropTargetMap/DropTargetMap';
import { useMap } from '@terrestris/react-util/dist/hooks/useMap';
import MapComponent from '@terrestris/react-util/dist/Map/MapComponent/MapComponent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

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

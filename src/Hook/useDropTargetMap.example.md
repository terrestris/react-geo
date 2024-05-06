This example shows the usage of the DropTargetMap HOC by use of the onDropAware
function.

```jsx
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import useDropTargetMap from '@terrestris/react-util/dist/Hooks/useDropTargetMap/useDropTargetMap';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
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

  const ExampleMapComponent = () => {
    const map = useMap();
    const {
      onDrop,
      onDragOver
    } = useDropTargetMap();

    return (
      <MapComponent
        map={map}
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{
          height: '512px'
        }}
      />
    );
  };

  return (
    <MapContext.Provider value={olMap}>
      <ExampleMapComponent />
    </MapContext.Provider>
  )
}

<DropTargetMapExample />
```

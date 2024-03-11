The BackgroundLayerChooser

```jsx
import BackgroundLayerChooser from '@terrestris/react-geo/dist/BackgroundLayerChooser/BackgroundLayerChooser';
import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import { useMap } from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import * as React from 'react';

const layers = [
  new OlLayerTile({
    source: new OlSourceOsm(),
    properties: {
      name: 'OSM',
      isBackgroundLayer: true
    }
  }),
  new OlLayerTile({
    visible: false,
    source: new OlSourceTileWMS({
      url: 'https://sgx.geodatenzentrum.de/wms_topplus_open',
      params: {
        LAYERS: 'web',
      }
    }),
    properties: {
      name: 'BKG',
      isBackgroundLayer: true
    }
  })
];
const openlayersMap = new OlMap({
  view: new OlView({
    center: [801045, 6577113],
    zoom: 9
  }),
  layers
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

function BackgroundChooserExample() {
  return (
    <MapContext.Provider value={openlayersMap}>
      <ComponentToUseTheMap />
      <BackgroundLayerChooser
        layers={layers}
        allowEmptyBackground={true}
      />
    </MapContext.Provider>
  );
}

<BackgroundChooserExample />;
```

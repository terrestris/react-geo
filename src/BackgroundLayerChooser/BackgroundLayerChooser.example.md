The BackgroundlayerChooser

```jsx
import * as React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlSourceOsm from 'ol/source/OSM';

import BackgroundLayerChooser from '@terrestris/react-geo/BackgroundLayerChooser/BackgroundLayerChooser';
import MapComponent from '@terrestris/react-geo/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-geo/Context/MapContext/MapContext';
import { useMap } from '@terrestris/react-geo/Hook/useMap';

const layers = [
  new OlLayerTile({
    name: 'OSM',
    source: new OlSourceOsm(),
    isBackgroundLayer: true
  }),
  new OlLayerTile({
    name: 'BKG',
    isBackgroundLayer: true,
    visible: false,
    source: new OlSourceTileWMS({
      url: 'https://sgx.geodatenzentrum.de/wms_topplus_open',
      params: {
        'LAYERS': 'web',
        'TILED': true
      }
    })
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
  }, []);

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
      />
    </MapContext.Provider>
  );
}

<BackgroundChooserExample />;
```

The BackgroundLayerChooser

```jsx
import BackgroundLayerChooser from '@terrestris/react-geo/dist/BackgroundLayerChooser/BackgroundLayerChooser';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import { useMap } from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import * as React from 'react';

function BackgroundChooserExample() {
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
          LAYERS: 'web'
        },
        attributions: '© <a href="https://www.bkg.bund.de">Bundesamt für Kartographie und Geodäsie' +
          `(${new Date().getFullYear()})</a>, ` +
          '<a href="https://sgx.geodatenzentrum.de/web_public/gdz/datenquellen/Datenquellen_TopPlusOpen.html">' +
          'Datenquellen</a>'
      }),
      properties: {
        name: 'BKG',
        isBackgroundLayer: true
      }
    })
  ];

  const map = new OlMap({
    view: new OlView({
      center: [801045, 6577113],
      zoom: 9
    }),
    layers
  });

  return (
    <MapContext.Provider value={map}>
      <MapComponent
        map={map}
        style={{
          position: 'relative',
          height: '400px'
        }}
      >
        <BackgroundLayerChooser
          layers={layers}
          allowEmptyBackground={true}
        />
      </MapComponent>
    </MapContext.Provider>
  );
}

<BackgroundChooserExample />;
```

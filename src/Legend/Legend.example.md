This example demonstrates the Legend.

```jsx
import Legend from '@terrestris/react-geo/dist/Legend/Legend';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import {
  fromLonLat
} from 'ol/proj';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import React from 'react';

const LegendExample = () => {
  const backgroundLayer = new OlLayerTile({
    properties: {
      name: 'OSM-WMS'
    },
    source: new OlSourceTileWMS({
      url: 'https://ows.terrestris.de/osm-gray/service',
      params: {
        LAYERS: 'OSM-WMS',
        TILED: true
      }
    })
  });

  const statesLayer = new OlLayerTile({
    properties: {
      name: 'States (USA)'
    },
    source: new OlSourceTileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      params: {
        LAYERS: 'usa:states',
        TILED: true
      }
    })
  });

  const placesLayer = new OlLayerTile({
    properties: {
      name: 'Places'
    },
    legendUrl: 'https://terrestris.github.io/react-geo/assets/legend1.png',
    source: new OlSourceTileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      params: {
        LAYERS: 'ne:ne_10m_populated_places',
        TILED: true,
        TRANSPARENT: 'true'
      }
    })
  });

  const extraParams = {
    HEIGHT: 10,
    WIDTH: 10
  };

  const map = new OlMap({
    layers: [
      backgroundLayer,
      statesLayer,
      placesLayer
    ],
    view: new OlView({
      center: fromLonLat([-98.583333, 39.833333]),
      zoom: 4
    })
  });

  return (
    <>
      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />

      <div
        className="example-block"
      >
        <span>{`Layer ${backgroundLayer.get('name')}:`}</span>
        <Legend
          layer={backgroundLayer}
        />
      </div>

      <div
        className="example-block"
      >
        <span>{`Layer ${statesLayer.get('name')} with "extraParams":`}</span>
        <Legend
          layer={statesLayer}
          extraParams={this.extraParams}
        />
      </div>

      <div
        className="example-block"
      >
        <span>{`Layer ${placesLayer.get('name')} with custom "legendUrl":`}</span>
        <Legend
          layer={placesLayer}
        />
      </div>
    </>
  );
};

<LegendExample />
```

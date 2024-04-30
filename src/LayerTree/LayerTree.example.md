This example demonstrates the LayerTree.

```jsx
import LayerTree from '@terrestris/react-geo/dist/LayerTree/LayerTree';
import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerGroup from 'ol/layer/Group';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import * as React from 'react';

const LayerTreeExample = () => {

  const layerGroup = new OlLayerGroup({
    properties: {
      name: 'Layergroup'
    },
    layers: [
      new OlLayerTile({
        properties: {
          name: 'OSM-Overlay-WMS'
        },
        minResolution: 0,
        maxResolution: 200,
        source: new OlSourceTileWMS({
          url: 'https://ows.terrestris.de/osm/service',
          params: {
            LAYERS: 'OSM-Overlay-WMS'
          }
        })
      }),
      new OlLayerTile({
        properties: {
          name: 'SRTM30-Contour'
        },
        minResolution: 0,
        maxResolution: 10,
        visible: false,
        source: new OlSourceTileWMS({
          url: 'https://ows.terrestris.de/osm/service',
          params: {
            LAYERS: 'SRTM30-Contour'
          }
        })
      }),
      new OlLayerTile({
        properties: {
          name: 'SRTM30-Colored-Hillshade'
        },
        minResolution: 0,
        maxResolution: 10,
        visible: false,
        source: new OlSourceTileWMS({
          url: 'https://ows.terrestris.de/osm/service',
          params: {
            LAYERS: 'SRTM30-Colored-Hillshade'
          }
        })
      })
    ]
  });

  const anotherLayerGroup = new OlLayerGroup({
    properties: {
      name: 'Layergroup'
    },
    layers: [
      new OlLayerTile({
        properties: {
          name: 'OSM-Overlay-WMS A'
        },
        minResolution: 0,
        maxResolution: 200,
        source: new OlSourceTileWMS({
          url: 'https://ows.terrestris.de/osm/service',
          params: {
            LAYERS: 'OSM-Overlay-WMS'
          }
        })
      }),
      new OlLayerTile({
        properties: {
          name: 'OSM-Overlay-WMS B'
        },
        minResolution: 0,
        maxResolution: 200,
        source: new OlSourceTileWMS({
          url: 'https://ows.terrestris.de/osm/service',
          params: {
            LAYERS: 'OSM-Overlay-WMS'
          }
        })
      }),
      layerGroup
    ]
  });

  const map = new OlMap({
    layers: [
      new OlLayerTile({
        properties: {
          name: 'OSM'
        },
        source: new OlSourceOSM()
      }),
      anotherLayerGroup,
      new OlLayerGroup({
        properties: {
          name: 'Empty layergroup'
        },
        visible: true,
        layers: []
      })
    ],
    view: new OlView({
      center: fromLonLat([12.924, 47.551]),
      zoom: 13
    })
  });

  return (
    <MapContext.Provider value={map}>
      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />

      <span>{'Please note that the layers have resolution restrictions, please ' +
      ' zoom in and out to see how the trees react to this.'}</span>
      <div className="example-block">
        <span>{'Autoconfigured with topmost LayerGroup of passed map:'}</span>

        <LayerTree
          className="top"
          toggleOnClick={true}
        />

      </div>

      <div className="example-block">
        <span>{'A LayerTree configured with concrete layerGroup:'}</span>

        <LayerTree
          layerGroup={layerGroup}
          className="middle"
        />
      </div>

      <div className="example-block">
        <span>{'A LayerTree with a filterFunction (The OSM layer is filtered out):'}</span>

        <LayerTree
          filterFunction={layer => layer.get('name') !== 'OSM'}
          className="bottom"
          toggleOnClick={true}
        />
      </div>
    </MapContext.Provider>
  );
}

<LayerTreeExample />
```

This example shows the LayerSwitcher component.
Just click on the switcher to change the layer.
The passed layers are handled like only one of it can be visible.

```jsx
import LayerSwitcher from '@terrestris/react-geo/dist/LayerSwitcher/LayerSwitcher';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import {
  useEffect,
  useState
} from 'react';

const LayerSwitcherExample = () => {
  const [map, setMap] = useState();
  const [pressed, setPressed] = useState();

  useEffect(() => {
    const newMap = new OlMap({
      layers: [
        new OlLayerTile({
          properties: {
            name: 'OSM'
          },
          source: new OlSourceOsm()
        }),
        new OlLayerTile({
          properties: {
            name: 'OSM-WMS'
          },
          source: new OlSourceTileWMS({
            url: 'https://ows.terrestris.de/osm/service?',
            params: {
              LAYERS: 'OSM-WMS'
            }
          })
        })
      ],
      view: new OlView({
        center: fromLonLat([8, 50]),
        zoom: 9
      })
    });

    setMap(newMap);
  }, []);

  if (!map) {
    return null;
  }

  return (
    <div>
      <MapContext.Provider value={map}>
        <MapComponent
          map={map}
          style={{
            position: 'relative',
            height: '400px'
          }}
        >
          <LayerSwitcher
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              zIndex: 2
            }}
            map={map}
            layers={map.getLayers().getArray()}
          />
        </MapComponent>
      </MapContext.Provider>
    </div>
  );
}

<LayerSwitcherExample />
```

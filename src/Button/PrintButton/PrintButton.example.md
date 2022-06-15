This demonstrates the use of the PrintButton.

```jsx
import {useEffect, useState} from 'react';

import { fromLonLat, get as getProjection } from 'ol/proj';
import {getTopLeft, getWidth} from 'ol/extent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

import MapContext from '@terrestris/react-geo/Context/MapContext/MapContext'
import MapComponent from '@terrestris/react-geo/Map/MapComponent/MapComponent';
import PrintButton from '@terrestris/react-geo/Button/PrintButton/PrintButton';

const PrintButtonExample = () => {  
  const [map, setMap] = useState();

  useEffect(() => {
    const projection = getProjection('EPSG:3857');
    const projectionExtent = projection.getExtent();

    const newMap = new OlMap({
      layers: [
        new OlLayerTile({
          source: new OlSourceOsm(),
          opacity: 0.5
        }),
        new OlLayerTile({
          name: 'True Color Composite',
          opacity: 0.5,
          source: new OlSourceTileWMS({
            url: 'https://geoserver.mundialis.de/geoserver/wms',
            params: {'LAYERS': '1_040302', 'TILED': true},
            serverType: 'geoserver'
          })
        }),
        new OlLayerTile({
          opacity: 0.7,
          source: new WMTS({
            attributions:
              'Tiles © <a href="https://mrdata.usgs.gov/geology/state/"' +
              ' target="_blank">USGS</a>',
            url: 'https://mrdata.usgs.gov/mapcache/wmts',
            layer: 'sgmc2',
            matrixSet: 'GoogleMapsCompatible',
            format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
              origin: getTopLeft(projectionExtent),
              resolutions: [
                156543.03392804097,
                78271.51696402048,
                39135.75848201024,
                19567.87924100512,
                9783.93962050256,
                4891.96981025128,
                2445.98490512564,
                1222.99245256282,
                611.49622628141,
                305.748113140705,
                152.8740565703525,
                76.43702828517625,
                38.21851414258813,
                19.109257071294063,
                9.554628535647032,
                4.777314267823516,
                2.388657133911758,
                1.194328566955879,
                0.5971642834779395
              ],
              matrixIds: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
            }),
            style: 'default',
            wrapX: true,
          }),
        })
      ],
      view: new OlView({
        center: fromLonLat([8, 50]),
        zoom: 4
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
            height: '400px'
          }}
        />
        <PrintButton>
          Print map
        </PrintButton>
      </MapContext.Provider>
    </div>
  );
}

<PrintButtonExample />
```

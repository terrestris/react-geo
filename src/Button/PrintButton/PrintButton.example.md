This demonstrates the use of the PrintButton.

```jsx
import PrintButton from '@terrestris/react-geo/dist/Button/PrintButton/PrintButton';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext'
import { Progress } from 'antd';
import {getTopLeft, getWidth} from 'ol/extent';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import {Vector as VectorLayer} from 'ol/layer';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import {fromLonLat, get as getProjection} from 'ol/proj';
import {OSM, Vector as VectorSource} from 'ol/source';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import WMTS from 'ol/source/WMTS';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import OlView from 'ol/View';
import {useEffect, useMemo,useState} from 'react';

import A3Landscape from './A3Landscape.example.ts';
import A3Portrait from './A3Portrait.example.ts';
import A4Landscape from './A4Landscape.example.ts';
import A4Portrait from './A4Portrait.example.ts';

const PrintButtonExample = () => {
  const [map, setMap] = useState();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('pending');

  const geojson = useMemo(() => ({
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'EPSG:3857',
      },
    },
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [4e6, 2e6],
            [8e6, 4e6],
          ],
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [4e6, 2e6],
            [8e6, -2e6],
          ],
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-0.52e6, 7e6], [-0.8e6, 7.5e6]
          ],
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [2e6, 5e6],
              [2e6, 6e6],
              [2e6, 7e6],
              [0e6, 5e6]
            ],
          ],
        },
      }
    ]}
  ), []);

  const image = new CircleStyle({
    radius: 5,
    fill: null,
    stroke: new Stroke({color: 'red', width: 1}),
  });

  const styles = {
    Point: new Style({
      image: image,
    }),
    LineString: new Style({
      stroke: new Stroke({
        color: 'green',
        width: 1,
      }),
    }),
    Polygon: new Style({
      stroke: new Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3,
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)',
      }),
    }),
    Circle: new Style({
      stroke: new Stroke({
        color: 'red',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(255,0,0,0.2)',
      })
    })
  };

  const styleFunction = function (feature) {
    return styles[feature.getGeometry().getType()];
  };

  useEffect(() => {
    const projection = getProjection('EPSG:3857');
    const projectionExtent = projection.getExtent();

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojson),
    });

    const osm = new OlLayerTile({
      source: new OlSourceOsm(),
    });
    osm.set('name', 'OpenStreetMap');
    osm.set('legendUrl', 'https://terrestris.github.io/react-geo/assets/legend1.png');

    const newMap = new OlMap({
      layers: [
        osm,
        new OlLayerTile({
          name: 'True Color Composite',
          opacity: 0.5,
          source: new OlSourceTileWMS({
            url: 'https://geoserver.mundialis.de/geoserver/wms',
            params: {LAYERS: '1_040302', TILED: true},
            serverType: 'geoserver'
          })
        }),
        new OlLayerTile({
          opacity: 0.6,
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
            wrapX: true
          })
        }),
        new VectorLayer({
          source: vectorSource,
          style: [
            new Style({
              stroke: new Stroke({
                color: '#0000FF', // 'blue', todo: parser does not support named colors
                lineDash: [4],
                width: 3
              })
            }),
            new Style({
              fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)'
              })
            })
          ]
        })
      ],
      view: new OlView({
        center: fromLonLat([8, 50]),
        zoom: 4
      })
    });

    setMap(newMap);
  }, [geojson]);

  const extent = [-0.52e6, 7e6, -0.8e6, 7.5e6];

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
        <PrintButton
          style={{
            margin: '10px 10px 0 0'
          }}
          onProgressChange={setProgress}
          title='A4 Landscape'
          legendTitle='A4 Landscape Legend'
          format='pdf'
          northArrow={true}
          scaleBar={true}
          pdfPrintFunc={A4Landscape}
          mapSize={[277, 170, 'mm']}
        >
          Print map A4 Landscape
        </PrintButton>
        <PrintButton
          style={{
            margin: '10px 10px 0 0'
          }}
          onProgressChange={setProgress}
          title='A4 Portrait'
          legendTitle='A4 Portrait Legend'
          format='pdf'
          northArrow={true}
          scaleBar={true}
          pdfPrintFunc={A4Portrait}
          mapSize={[190, 247, 'mm']}
        >
          Print map A4 Portrait
        </PrintButton>
        <PrintButton
          style={{
            margin: '10px 10px 0 0'
          }}
          onProgressChange={setProgress}
          title='A3 Landscape'
          legendTitle='A3 Landscape Legend'
          format='pdf'
          northArrow={true}
          scaleBar={true}
          pdfPrintFunc={A3Landscape}
          mapSize={[400, 250, 'mm']}
        >
          Print map A3 Landscape
        </PrintButton>
        <PrintButton
          style={{
            margin: '10px 10px 0 0'
          }}
          onProgressChange={setProgress}
          title='A3 Portrait'
          legendTitle='A3 Portrait Legend'
          format='pdf'
          northArrow={true}
          scaleBar={true}
          pdfPrintFunc={A3Portrait}
          mapSize={[277, 370, 'mm']}
        >
          Print map A3 Portrait
        </PrintButton>
        <PrintButton
          extent={extent}
          format='pdf'
          legendTitle='A4 Portrait Legend'
          mapSize={[190, 247, 'mm']}
          northArrow={true}
          onProgressChange={setProgress}
          pdfPrintFunc={A4Portrait}
          scaleBar={true}
          style={{
            margin: '10px 10px 0 0'
          }}
          title='Print map A4 centered on line feature'
        >
          Print map A4 centered on line feature
        </PrintButton>
      </MapContext.Provider>
      <Progress percent={progress} />
    </div>
  );
}

<PrintButtonExample />
```

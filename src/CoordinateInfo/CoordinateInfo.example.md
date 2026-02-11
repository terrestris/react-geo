The `CoordinateInfo` component is only a very shallow wrapper around the `useCoordinateInfo` hook of react-util.
Often it might be easier to use the hook directly, see the second example on how it's done.
Layer filter (property `layerFilter`) is not needed here as the `useCoordinateInfo` hook is already configured to query all layers by default.

```jsx
import {faCopy} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import CoordinateInfo from '@terrestris/react-geo/dist/CoordinateInfo/CoordinateInfo';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import useCoordinateInfo from '@terrestris/react-util/dist/Hooks/useCoordinateInfo/useCoordinateInfo';
import {
  Button,
  Divider,
  Spin,
  Statistic,
  Tooltip
} from 'antd';
import * as copy from 'copy-to-clipboard';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
import OlMap from 'ol/Map';
import {fromLonLat} from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlSourceImageWMS from 'ol/source/ImageWMS';
import VectorSource from 'ol/source/Vector.js';
import OlView from 'ol/View';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import React, {useEffect, useState} from 'react';

const wmsLayer = new OlLayerTile({
  name: 'States (USA)',
  source: new OlSourceTileWMS({
    url: 'https://ahocevar.com/geoserver/wms',
    params: {
      LAYERS: 'usa:states',
      TILED: true
    },
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  })
});

const vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: function (extent) {
    return (
      'https://ows-demo.terrestris.de/geoserver/osm/wfs?service=WFS&' +
      'version=1.1.0&request=GetFeature&typename=osm:osm-country-borders&' +
      'outputFormat=application/json&srsname=EPSG:3857&' +
      'bbox=' +
      extent.join(',') +
      ',EPSG:3857'
    );
  },
  strategy: bboxStrategy,
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: {
    'stroke-width': 0.75,
    'stroke-color': 'white',
    'fill-color': 'rgba(100,100,100,0.25)',
  },
});

const queryLayers = [wmsLayer, vectorLayer];

const getValue = (feature, key) => {
  if (feature.getProperties().hasOwnProperty(key)) {
    return feature.get(key);
  }
  return null;
};

const FeatureInfo = ({
  features,
  loading,
  clickCoordinate
}) => {
  if (loading) {
    return <Spin
      spinning={loading}
    >
      Loading...
    </Spin>;
  }
  if (!features) {
    return <span>
      No features found at the clicked coordinate.
    </span>;
  }
  return !loading && features.length > 0 ?
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Spin
          spinning={loading}
        >
          <Statistic
            title="Coordinate"
            value={clickCoordinate.join(', ')}
          />
        </Spin>
        <Tooltip
          title="Copy to clipboard"
        >
          <Button
            style={{marginTop: 16}}
            type="primary"
            onClick={() => {
              copy(clickCoordinate.join(', '));
            }}
            icon={
              <FontAwesomeIcon
                icon={faCopy}
              />
            }
          />
        </Tooltip>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Spin
          spinning={loading}
        >
          <Statistic
            title="Determined value"
            value={getValue(features[0].feature, 'STATE_NAME')
              || getValue(features[0].feature, 'name') || getValue(features[0].feature, 'GRAY_INDEX')}
          />
        </Spin>
        <Tooltip
          title="Copy to clipboard"
        >
          <Button
            style={{marginTop: 16}}
            type="primary"
            onClick={() => {
              copy(features[0].feature.get('STATE_NAME'));
            }}
            icon={
              <FontAwesomeIcon
                icon={faCopy}
              />
            }
          />
        </Tooltip>
      </div>
    </div> :
    <span>
      Click on a state to get details about the clicked coordinate.
    </span>
};

const PointerRestResult = ({
  features,
  loading,
  clickCoordinate
}) => {
  if (loading) {
    return <Spin
      spinning={loading}
    >
      Loading...
    </Spin>;
  }

  if (!features || !Array.isArray(features) || features.length === 0 ) {
    return <span>
      No features found at the clicked coordinate.
    </span>;
  }

  return (
    <ul>
      {
        features.map(ft => {
          return (
            <li>
                Value for feature type { ft.featureType }: {ft.feature.get('STATE_NAME') || ft.feature.get('name') || ft.feature.get('GRAY_INDEX')}
            </li>
          )
        })
      }
    </ul>
  );
}

const CoordinateInfoExample = () => {

  const [map, setMap] = useState();
  const [map2, setMap2] = useState();

  useEffect(() => {
    setMap(new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOSM()
        }),
        vectorLayer,
        wmsLayer
      ],
      view: new OlView({
        center: fromLonLat([-99.4031637, 38.3025695]),
        zoom: 4
      })
    }));
    setMap2(new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOSM()
        }),
        wmsLayer
      ],
      view: new OlView({
        center: fromLonLat([-99.4031637, 38.3025695]),
        zoom: 4
      })
    }));
  }, []);

  const getInfoFormat = (layer) => {
    if (layer.get('featureInfoTemplates')) {
      return Object.keys(layer.get('featureInfoTemplates')) [0];
    }
    return 'application/json';
  };

  useEffect(() => {
    if (map2) {
    fetch('https://tiles.geoservice.dlr.de/service/wmts?request=getCapabilities')
      .then((response) => response.text())
      .then((text) => {
        const parser = new WMTSCapabilities();
        const capabilities = parser.read(text);
        const options = optionsFromCapabilities(capabilities, {
          layer: 'TDM90_AM2',
          matrixSet: 'EPSG:3857',
          projection: map.getView().getProjection()
        });
        const layer = new OlLayerTile({
            source: new WMTS(options),
            name: 'TDM90 Amplitude Min (AM2)'
          });

        const layerConfig = capabilities.Contents.Layer.find(l => l.Identifier === 'TDM90_AM2');
        const featureInfoFormat = layerConfig.ResourceURL.find(r => r.format.indexOf('gml') > -1);

        if (layer && layerConfig && featureInfoFormat) {
          layer.set('featureInfoTemplates', {
            [featureInfoFormat.format]: featureInfoFormat.template
          })
          map2.addLayer(layer);
        }
      });
    }
  }, [map2]);

  if (!map || !map2) {
    return null;
  }

  return (
    <>
      <MapContext.Provider value={map}>
        <MapComponent
          map={map}
          style={{
            height: '400px'
          }}
        />
        <Divider />
        <h3>
          Using `useCoordinateInfo` in a custom component - triggered on map click 
        </h3>
        <MyCoordinateInfo />
      </MapContext.Provider>
      <Divider />
      <MapContext.Provider value={map2}>
        <MapComponent
          map={map2}
          firePointerRest
          pointerRestInterval={250}
          style={{
            height: '400px'
          }}
        />
        <Divider />
        <h3>
          Using the `CoordinateInfo` component  - triggered on pointer rest event
        </h3>
        <CoordinateInfo
          active
          drillDown
          registerOnClick={false}
          registerOnPointerMove
          registerOnPointerRest
          getInfoFormat={getInfoFormat}
          resultRenderer={(results => <PointerRestResult {...results} />)}
        />
        <Divider />
      </MapContext.Provider>
    </>
  );
};

const MyCoordinateInfo = () => {
  // The useCoordinateInfo hook needs to run inside a map context
  const results = useCoordinateInfo({
    active: true,
    drillDown: true,
    registerOnClick: true,
    registerOnPointerMove: false,
    registerOnPointerRest: false
  });

  return <FeatureInfo
    {...results}
  />;
};

<CoordinateInfoExample />;
```


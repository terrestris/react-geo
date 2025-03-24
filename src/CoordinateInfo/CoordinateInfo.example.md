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
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
import OlMap from 'ol/Map';
import {fromLonLat} from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector.js';
import OlView from 'ol/View';
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
            title="State"
            value={getValue(features[0].feature, 'STATE_NAME')
              || getValue(features[0].feature, 'name')}
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

const CoordinateInfoExample = () => {

  const [map, setMap] = useState();

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
  }, []);

  if (!map) {
    return null;
  }

  return (
    <MapContext.Provider value={map}>
      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />
      <Divider />
      <h3>
        Using the `CoordinateInfo` component
      </h3>
      <CoordinateInfo
        active={true}
        resultRenderer={(results => <FeatureInfo {...results} />)}
      />
      <Divider />
      <h3>
        Using `useCoordinateInfo` in a custom component
      </h3>
      <MyCoordinateInfo />
    </MapContext.Provider>
  );
};

const MyCoordinateInfo = () => {
  // The useCoordinateInfo hook needs to run inside a map context
  const results = useCoordinateInfo({
    active: true
  });

  return <FeatureInfo
    {...results}
  />;
};

<CoordinateInfoExample />;
```


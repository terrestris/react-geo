This example shows the usage of the zoomTo function.

```jsx
import SimpleButton from '@terrestris/react-geo/dist/Button/SimpleButton/SimpleButton';
import LayerTree from '@terrestris/react-geo/dist/LayerTree/LayerTree';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import { useMap } from '@terrestris/react-util/dist/hooks/useMap';
import { zoomTo } from '@terrestris/react-util/dist/Util/ZoomUtil';
import MapComponent from '@terrestris/react-util/dist/Map/MapComponent/MapComponent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import { useState, useEffect } from 'react';

const layer = new OlLayerTile({
  source: new OlSourceOsm(),
  name: 'OSM'
});
const openlayersMap = new OlMap({
  target: null,
  view: new OlView({
    center: [
      135.1691495,
      34.6565482
    ],
    projection: 'EPSG:4326',
    zoom: 16,
  }),
  layers: [layer]
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

const ComponentWithZoom = ({ map }) => {
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    zoomTo(map, {
      animate: false,
      zoom,
      constrainViewResolution: false,
      animateOptions: {},
      center: undefined,
      extent: undefined
    });
  }, [map, zoom]);

  return (
    <>
      <SimpleButton onClick={() => setZoom(1)}>1</SimpleButton>
      <SimpleButton onClick={() => setZoom(10)}>10</SimpleButton>
    </>
  );
};

function LayerTreeToUseTheMap() {
  const map = useMap();

  return (
    <LayerTree
      map={map}
    />
  );
}

function UseMapExample() {
  return (
    <MapContext.Provider value={openlayersMap}>
      <ComponentToUseTheMap />
      <LayerTreeToUseTheMap />
      <ComponentWithZoom map={openlayersMap} />
    </MapContext.Provider>
  );
}

<UseMapExample />
```

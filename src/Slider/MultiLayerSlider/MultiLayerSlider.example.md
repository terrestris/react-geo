This example shows the usage of the MultiLayerSlider.
It takes an Array of layers that are already added to the map and makes
their opacity changeable by a single slider component.

This way you can slide through a set of layers, which e.g. is useful when using
layers showing the same area but different content or time.

```jsx
import MultiLayerSlider from '@terrestris/react-geo/dist/Slider/MultiLayerSlider/MultiLayerSlider';
import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import React from 'react';

const MultiLayerSliderExample = () => {

  const layer1 = new OlLayerTile({
    properties: {
      name: 'Land/Water'
    },
    source: new OlSourceTileWMS({
      url: 'https://geoserver.mundialis.de/geoserver/wms',
      params: {
        LAYERS: '1_8A1104',
        TILED: true
      }
    })
  });
  const layer2 = new OlLayerTile({
    properties: {
      name: 'True Color Composite'
    },
    source: new OlSourceTileWMS({
      url: 'https://geoserver.mundialis.de/geoserver/wms',
      params: {
        LAYERS: '1_040302',
        TILED: true
      }
    })
  });
  const layer3 = new OlLayerTile({
    properties: {
      name: 'Color Infrared (vegetation)'
    },
    source: new OlSourceTileWMS({
      url: 'https://geoserver.mundialis.de/geoserver/wms',
      params: {
        LAYERS: '1_080403',
        TILED: true
      }
    })
  });
  const layer4 = new OlLayerTile({
    properties: {
      name: 'Atmospheric Penetration'
    },
    source: new OlSourceTileWMS({
      url: 'https://geoserver.mundialis.de/geoserver/wms',
      params: {
        LAYERS: '1_12118A',
        TILED: true
      }
    })
  });
  const layer5 = new OlLayerTile({
    properties: {
      name: 'Vegetation'
    },
    source: new OlSourceTileWMS({
      url: 'https://geoserver.mundialis.de/geoserver/wms',
      params: {
        LAYERS: '1_118A04',
        TILED: true
      }
    })
  });

  const map = new OlMap({
    layers: [
      layer1,
      layer2,
      layer3,
      layer4,
      layer5
    ],
    view: new OlView({
      center: fromLonLat([
        36.8331537,
        -4.0962687
      ]),
      zoom: 13
    })
  });

  map.on('change:zoom')

  return (
    <>
      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />

      <div>
        <span>{'Move the slider to change the layer\'s opacity:'}</span>
        <MultiLayerSlider
          layers={[
            layer1,
            layer2,
            layer3,
            layer4,
            layer5
          ]}
        />
      </div>
    </>
  );
};

<MultiLayerSliderExample />
```

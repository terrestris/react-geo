This example demonstrates the LayerTransparencySlider.

```jsx
import LayerTransparencySlider from '@terrestris/react-geo/dist/Slider/LayerTransparencySlider/LayerTransparencySlider';
import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import React from 'react';

const LayerTransparencySliderExample = () => {
  const layer = new OlLayerTile({
    source: new OlSourceOSM()
  });

  const map = new OlMap({
    layers: [
      layer
    ],
    view: new OlView({
      center: fromLonLat([0, 0]),
      zoom: 0
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

      <div>
        <span>{'Move the slider to change the layer\'s opacity:'}</span>

        <LayerTransparencySlider
          layer={layer}
        />
      </div>
    </>
  );
};

<LayerTransparencySliderExample />
```

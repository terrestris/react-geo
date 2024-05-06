This demonstrates the use of ZoomToExtentButton.

```jsx
import ZoomToExtentButton from '@terrestris/react-geo/dist/Button/ZoomToExtentButton/ZoomToExtentButton';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

const ZoomToExtentButtonExample = () => {

  const map = new OlMap({
    layers: [
      new OlLayerTile({
        name: 'OSM',
        source: new OlSourceOSM()
      })
    ],
    view: new OlView({
      center: fromLonLat([37.40570, 8.81566]),
      zoom: 10
    })
  });

  const extent1 = [588948, 6584461, 1053685, 6829060];
  const extent2 = [608948, 6484461, 1253685, 6629060];
  const extent3 = [628948, 6384461, 1453685, 6429060];

  return (
    <div>
      <MapContext.Provider value={map}>
        <MapComponent
          map={map}
          style={{
            height: '400px'
          }}
        />

        <div>
          <ZoomToExtentButton
            extent={extent1}
          >
            Zoom to extent (standard, animated)
          </ZoomToExtentButton>
          <ZoomToExtentButton
            extent={extent2}
            fitOptions={{
              duration: 0
            }}
          >
            Zoom to extent (no animation)
          </ZoomToExtentButton>
          <ZoomToExtentButton
            extent={extent3}
            fitOptions={{
              duration: 3000
            }}
          >
            Zoom to extent (slow animation)
          </ZoomToExtentButton>
          <ZoomToExtentButton
            center={fromLonLat([36.40570, 10.81566])}
            zoom={8}
          >
            Zoom to extent providing center and zoom (standard, animated)
          </ZoomToExtentButton>
        </div>
      </MapContext.Provider>
    </div>
  );
}

<ZoomToExtentButtonExample />
```

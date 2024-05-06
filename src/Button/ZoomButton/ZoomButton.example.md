This example demonstrates some uses of of the `ZoomButton` to zoom in and out of the map, animated by default.

```jsx
import ZoomButton from '@terrestris/react-geo/dist/Button/ZoomButton/ZoomButton';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

const ZoomButtonExample = () => {

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
          <br />
          <ZoomButton>
            Zoom in (standard, animated)
          </ZoomButton>
          <ZoomButton
            delta={0.5}
          >
            Zoom in (0.5 zoomlevels, animated)
          </ZoomButton>
          <ZoomButton
            animate={false}
          >
            Zoom in (no animation)
          </ZoomButton>
          <ZoomButton
            animateOptions={{duration: 1500}}
          >
            Zoom in (1.5 seconds animation)
          </ZoomButton>
          <br />
          <br />
          <ZoomButton
            delta={-1}
          >
            Zoom out (standard, animated)
          </ZoomButton>
          <ZoomButton
            delta={-2}
          >
            Zoom out (2 zoomlevels, animated)
          </ZoomButton>
          <ZoomButton
            delta={-1}
            animate={false}
          >
            Zoom out (no animation)
          </ZoomButton>
          <ZoomButton
            delta={-1}
            animateOptions={{duration: 1500}}
          >
            Zoom out (1.5 seconds animation)
          </ZoomButton>
        </div>
      </MapContext.Provider>
    </div>
  );
}

<ZoomButtonExample />
```

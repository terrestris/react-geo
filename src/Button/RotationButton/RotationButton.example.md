This demonstrates the use of the RotationButton

```jsx
import { useEffect, useState } from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import MapContext from '@terrestris/react-geo/dist/Context/MapContext/MapContext'
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import RotationButton from '@terrestris/react-geo/dist/Button/RotationButton/RotationButton';

const RotationButtonExample = () => {

  const [map, setMap] = useState();

  useEffect(() => {

    setMap(new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOsm()
        })
      ],
      view: new OlView({
        center: fromLonLat([8, 50]),
        zoom: 4
      })
    }));
  },[] );

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
        <RotationButton/>
      </MapContext.Provider>
    </div>
  );
}

<RotationButtonExample />
```

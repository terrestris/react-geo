This demonstrates the use of the PrintButton.

```jsx
import {useEffect, useState} from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import MapContext from '@terrestris/react-geo/Context/MapContext/MapContext'
import MapComponent from '@terrestris/react-geo/Map/MapComponent/MapComponent';
import PrintButton from '@terrestris/react-geo/Button/PrintButton/PrintButton';

const PrintButtonExample = () => {
  const [map, setMap] = useState();

  useEffect(() => {
    const newMap = new OlMap({
      layers: [
        new OlLayerTile({
          source: new OlSourceOsm()
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

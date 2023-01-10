This demonstrates the usage of the NominatimSearch.

```jsx
import {useEffect, useState} from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';

import MapComponent from '@terrestris/react-geo/Map/MapComponent/MapComponent';
import NominatimSearch from '@terrestris/react-geo/Field/NominatimSearch/NominatimSearch';

const NominatimSearchExample = () => {
  const [map, setMap] = useState();

  useEffect(() => {
    const newMap = new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOSM()
        })
      ],
      view: new OlView({
        center: fromLonLat([37.40570, 8.81566]),
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
      <div className="example-block">
        <label>The NominatimSearch<br />
          <NominatimSearch map={map} />
        </label>
      </div>

      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />
    </div>
  );
};

<NominatimSearchExample />
```

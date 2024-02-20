This demonstrates the usage of the NominatimSearch.

```jsx
import NominatimSearch from '@terrestris/react-geo/dist/Field/NominatimSearch/NominatimSearch';
import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import {fromLonLat} from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import {useEffect, useState} from 'react';

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
    <MapContext.Provider value={map}>

      <div className="example-block">
        <label>The NominatimSearch<br />
          <NominatimSearch />
        </label>
      </div>

      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />
    </MapContext.Provider>
  );
};

<NominatimSearchExample />
```

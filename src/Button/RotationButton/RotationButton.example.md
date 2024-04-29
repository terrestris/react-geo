This demonstrates the use of the RotationButton

```jsx
import RotationButton from '@terrestris/react-geo/dist/Button/RotationButton/RotationButton';
import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import { useEffect, useState } from 'react';

const RotationButtonExample = () => {
  const [map, setMap] = useState();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    setMap(
      new OlMap({
        layers: [
          new OlLayerTile({
            name: 'OSM',
            source: new OlSourceOsm(),
          }),
        ],
        view: new OlView({
          center: fromLonLat([8, 50]),
          zoom: 4,
        }),
      })
    );
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
            height: '400px',
          }}
        />
        <RotationButton
          onChange={() => setPressed(!pressed)}
          pressed={pressed}
        />
      </MapContext.Provider>
    </div>
  );
};

<RotationButtonExample />;
```

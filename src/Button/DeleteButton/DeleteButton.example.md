This demonstrates the use of the DeleteButton.

```jsx
import { DeleteButton } from '@terrestris/react-geo/dist/Button/DeleteButton/DeleteButton';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext'
import MapComponent from '@terrestris/react-util/dist/Map/MapComponent/MapComponent';
import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import { useEffect, useState } from 'react';

import federalStates from '../../../assets/federal-states-ger.json';

const format = new OlFormatGeoJSON();
const features = format.readFeatures(federalStates);

const DeleteButtonExample = () => {
  const [map, setMap] = useState();

  useEffect(() => {
    const newMap = new OlMap({
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
    });

    const digitizeLayer = DigitizeUtil.getDigitizeLayer(newMap);
    digitizeLayer.getSource().addFeatures(features);

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
        <DeleteButton>
          Delete feature
        </DeleteButton>
      </MapContext.Provider>
    </div>
  );
}

<DeleteButtonExample />
```

This demonstrates the use of the CopyButton.

```jsx
import CopyButton from '@terrestris/react-geo/dist/Button/CopyButton/CopyButton';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import {DigitizeUtil} from '@terrestris/react-util/dist/Util/DigitizeUtil';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import {fromLonLat} from 'ol/proj';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import {useEffect, useState} from 'react';

import featuresJson from '../../../assets/simple-geometries.json';

const format = new OlFormatGeoJSON({
  featureProjection: 'EPSG:3857'
});
const features = format.readFeatures(featuresJson);

const CopyButtonExample = () => {
  const [map, setMap] = useState();
  const [pressed, setPressed] = useState();

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

        <CopyButton
          onChange={() => setPressed(!pressed)}
          pressed={pressed}
        >
          Copy feature
        </CopyButton>
      </MapContext.Provider>
    </div>
  );
}

<CopyButtonExample />
```

This demonstrates the use of the ModifyButton.

```jsx
import {ModifyButton} from '@terrestris/react-geo/dist/Button/ModifyButton/ModifyButton';
import MapContext from '@terrestris/react-geo/dist/Context/MapContext/MapContext'
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import {DigitizeUtil} from '@terrestris/react-geo/dist/Util/DigitizeUtil';
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

const ModifyButtonExample = () => {

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

        <ModifyButton>
          Select feature
        </ModifyButton>
      </MapContext.Provider>
    </div>
  );
}

<ModifyButtonExample />
```

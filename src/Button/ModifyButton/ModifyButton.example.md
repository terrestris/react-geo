This demonstrates the use of the ModifyButton.

```jsx
import {useEffect, useState} from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import {fromLonLat} from 'ol/proj';

import MapContext from '@terrestris/react-geo/Context/MapContext/MapContext'
import MapComponent from '@terrestris/react-geo/Map/MapComponent/MapComponent';
import SelectFeaturesButton from '@terrestris/react-geo/Button/SelectFeaturesButton/SelectFeaturesButton';
import {ModifyButton} from '@terrestris/react-geo/Button/ModifyButton/ModifyButton';
import {DigitizeUtil} from '@terrestris/react-geo/Util/DigitizeUtil';

import featuresJson from '../../../assets/simple-geometries.json';

const format = new OlFormatGeoJSON({
  featureProjection: 'EPSG:3857'
});
const features = format.readFeatures(featuresJson);

const ModifyButtonExample = () => {

  const [map, setMap] = useState();
  const [layer, setLayer] = useState();
  const [feature, setFeature] = useState();

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

<ModifyButtonExample/>
```

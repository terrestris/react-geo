This demonstrates the use of the SelectFeaturesButton.

```jsx
import SelectFeaturesButton from '@terrestris/react-geo/dist/Button/SelectFeaturesButton/SelectFeaturesButton';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext'
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlLayerTile from 'ol/layer/Tile';
import OlVectorLayer from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOsm from 'ol/source/OSM';
import OlVectorSource from 'ol/source/Vector';
import OlView from 'ol/View';
import { useEffect, useState } from 'react';

import federalStates from '../../../assets/federal-states-ger.json';

const format = new OlFormatGeoJSON();
const features = format.readFeatures(federalStates);

const SelectFeaturesButtonExample = () => {

  const [map, setMap] = useState();
  const [layers, setLayers] = useState();
  const [feature, setFeature] = useState();
  const [pressed, setPressed] = useState();

  useEffect(() => {
    const layer = new OlVectorLayer({
      source: new OlVectorSource({
        features
      })
    });

    setLayers([layer]);

    setMap(new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOsm()
        }),
        layer
      ],
      view: new OlView({
        center: fromLonLat([8, 50]),
        zoom: 4
      })
    }));
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

        <SelectFeaturesButton
          layers={layers}
          onFeatureSelect={e => setFeature(e.selected[0])}
          onChange={() => setPressed(!pressed)}
          pressed={pressed}
        >
          Select feature
        </SelectFeaturesButton>

        { feature && feature.get('GEN') }

      </MapContext.Provider>
    </div>
  );
}

<SelectFeaturesButtonExample />
```

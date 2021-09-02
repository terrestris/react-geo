This demonstrates the use of the SelectFeaturesButton.

```jsx
import { useEffect, useState } from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';

import MapContext from '@terrestris/react-geo/Context/MapContext/MapContext'
import MapComponent from '@terrestris/react-geo/Map/MapComponent/MapComponent';
import SelectFeaturesButton from '@terrestris/react-geo/Button/SelectFeaturesButton/SelectFeaturesButton';

import federalStates from '../../../assets/federal-states-ger.json';

const format = new OlFormatGeoJSON();
const features = format.readFeatures(federalStates);

const SelectFeaturesButtonExample = () => {
    
  const [map, setMap] = useState();
  const [layer, setLayer] = useState();
    
  useEffect(() => {
    const layer = new OlVectorLayer({
      source: new OlVectorSource({
        features      
      })    
    });

    setLayer(layer);

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
  }, [])
    
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
    
        <SelectFeaturesButton layers={[layer]}>
          Select feature
        </SelectFeaturesButton>
      </MapContext.Provider>
    </div>
  );
}

<SelectFeaturesButtonExample />
```

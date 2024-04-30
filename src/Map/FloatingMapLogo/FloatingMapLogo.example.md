This is a example containing a map component and a floating map logo

```jsx
import FloatingMapLogo from '@terrestris/react-util/dist/Components/FloatingMapLogo/FloatingMapLogo';
import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import {
  fromLonLat
} from 'ol/proj';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import React from 'react';

import logo from '../../../assets/user.png';

const FloatingMapLogoExample = () => {

  const map = new OlMap({
    view: new OlView({
      center: fromLonLat([
        7.1219992,
        50.729458
      ]),
      zoom: 11
    }),
    layers: [
      new OlLayerTile({
        source: new OlSourceOsm()
      })
    ]
  });

  return (
    <MapComponent
      map={map}
      style={{
        position: 'relative',
        height: '400px'
      }}
    >
      <FloatingMapLogo
        imageSrc={logo}
      />
    </MapComponent>
  );

};

<FloatingMapLogoExample />
```

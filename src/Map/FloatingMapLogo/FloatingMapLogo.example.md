This is a example containing a map component and a floating map logo

```jsx
import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';

import FloatingMapLogo from '@terrestris/react-geo/Map/FloatingMapLogo/FloatingMapLogo';

import logo from '../../../assets/user.png';

class FloatingMapLogoExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.map = new OlMap({
      view: new OlView({
        center: [801045, 6577113],
        zoom: 9
      }),
      layers: [
        new OlLayerTile({
          source: new OlSourceOsm()
        })
      ]
    });
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    return(
      <div
        id={this.mapDivId}
        style={{
          position: 'relative',
          height: '200px'
        }}
      >
        <FloatingMapLogo
          imageSrc={logo}
        />
      </div>
    )
  }
}

<FloatingMapLogoExample />
```
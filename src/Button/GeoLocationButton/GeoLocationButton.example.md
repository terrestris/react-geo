This demonstrates the use of the geolocation button.

```jsx
import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import GeoLocationButton from '@terrestris/react-geo/Button/GeoLocationButton/GeoLocationButton';
import ToggleGroup from '@terrestris/react-geo/Button/ToggleGroup/ToggleGroup';

class GeoLocationButtonExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.map = new OlMap({
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
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    return(
      <div>
        <div
          id={this.mapDivId}
          style={{
            height: '400px'
          }}
        />
        <ToggleGroup>
          <GeoLocationButton
            onGeolocationChange={() => undefined}
            map={this.map}
            showMarker={true}
            follow={true}
          >
          Track location
          </GeoLocationButton>
        </ToggleGroup>
      </div>
    );
  }
}

<GeoLocationButtonExample />

```

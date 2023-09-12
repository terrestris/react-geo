This demonstrates the use of the geolocation button.


```jsx
import ZoomButton from '@terrestris/react-geo/dist/Button/ZoomButton/ZoomButton';
import ToggleGroup from '@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup';
import GeoLocationButton from '@terrestris/react-geo/dist/Button/GeoLocationButton/GeoLocationButton';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

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
        center: fromLonLat([8, 50]),
        zoom: 9
      })
    });
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    return (
      <MapContext.Provider value={this.map}>
        <div>
          <div
            id={this.mapDivId}
            style={{
              height: '400px'
            }}
          />
          <GeoLocationButton
            showMarker={true}
            follow={true}
          >
            Enable GeoLocation
          </GeoLocationButton>
        </div>
      </MapContext.Provider>
    );
  }
}

<GeoLocationButtonExample />
```

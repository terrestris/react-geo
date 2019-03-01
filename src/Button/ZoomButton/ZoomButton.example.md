This example demonstrates some uses of of the `ZoomButton` to zoom in and out of the map, animated by default.

```jsx
import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import ZoomButton from '@terrestris/react-geo/Button/ZoomButton/ZoomButton';

class ZoomButtonExample extends React.Component {

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
        zoom: 10
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

        <div>
          <br />
          <ZoomButton map={this.map}>
            Zoom in (standard, animated)
          </ZoomButton>
          <ZoomButton map={this.map} delta={0.5}>
            Zoom in (0.5 zoomlevels, animated)
          </ZoomButton>
          <ZoomButton map={this.map} animate={false}>
            Zoom in (no animation)
          </ZoomButton>
          <ZoomButton map={this.map} animateOptions={{duration: 1500}}>
            Zoom in (1.5 seconds animation)
          </ZoomButton>
          <br />
          <br />
          <ZoomButton map={this.map} delta={-1}>
            Zoom out (standard, animated)
          </ZoomButton>
          <ZoomButton map={this.map} delta={-2}>
            Zoom out (2 zoomlevels, animated)
          </ZoomButton>
          <ZoomButton map={this.map} delta={-1} animate={false}>
            Zoom out (no animation)
          </ZoomButton>
          <ZoomButton map={this.map} delta={-1} animateOptions={{duration: 1500}}>
            Zoom out (1.5 seconds animation)
          </ZoomButton>
        </div>
      </div>
    )
  }
}

<ZoomButtonExample />
```

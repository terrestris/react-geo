This demonstrates the use of ZoomToExtentButton.

```jsx
import ZoomToExtentButton from '@terrestris/react-geo/dist/Button/ZoomToExtentButton/ZoomToExtentButton';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

class ZoomToExtentButtonExample extends React.Component {

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

    this.extent1 = [588948, 6584461, 1053685, 6829060];
    this.extent2 = [608948, 6484461, 1253685, 6629060];
    this.extent3 = [628948, 6384461, 1453685, 6429060];
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    return (
      <div>
        <div
          id={this.mapDivId}
          style={{
            height: '400px'
          }}
        />

        <ZoomToExtentButton
          map={this.map}
          extent={this.extent1}
        >
          Zoom to extent (standard, animated)
        </ZoomToExtentButton>
        <ZoomToExtentButton
          map={this.map}
          extent={this.extent2}
          fitOptions={{
            duration: 0
          }}
        >
          Zoom to extent (no animation)
        </ZoomToExtentButton>
        <ZoomToExtentButton
          map={this.map}
          extent={this.extent3}
          fitOptions={{
            duration: 3000
          }}
        >
          Zoom to extent (slow animation)
        </ZoomToExtentButton>
        <ZoomToExtentButton
          map={this.map}
          center={fromLonLat([36.40570, 10.81566])}
          zoom={8}
        >
          Zoom to extent providing center and zoom (standard, animated)
        </ZoomToExtentButton>
      </div>
    );
  }
}

<ZoomToExtentButtonExample />
```

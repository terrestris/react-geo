This demonstrates the use of ZoomToExtentButton.

```jsx
const React = require('react');
const OlMap = require('ol/Map').default;
const OlView = require('ol/View').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlSourceOsm = require('ol/source/OSM').default;
const fromLonLat = require('ol/proj').fromLonLat;

const {
  ZoomToExtentButton
} = require('../../index');

class ZoomToExtentButtonExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.map = new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOsm()
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
    return(
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
      </div>
    );
  }
}

<ZoomToExtentButtonExample />
```

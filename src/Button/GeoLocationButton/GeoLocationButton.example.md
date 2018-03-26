This demonstrates the use of the geolocation button.

```jsx
const React = require('react');
const OlMap = require('ol/map').default;
const OlView = require('ol/view').default;
const OlLayerTile = require('ol/layer/tile').default;
const OlSourceOsm = require('ol/source/osm').default;
const OlProj = require('ol/proj').default;

const {
  GeoLocationButton,
  ToggleGroup
} = require('../../index');

class GeoLocationButtonExample extends React.Component {

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
        center: OlProj.fromLonLat([37.40570, 8.81566]),
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

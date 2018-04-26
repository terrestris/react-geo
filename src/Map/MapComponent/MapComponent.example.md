This example shows the usage of the MapComponent in combination with the MapProvider.
It makes use of the `mappify` HOC function to supply the provided map to the MapComponent
and the NominatimSearch.

This way you can share the same mapobject across the whole application without passing
it as prop to the whole rendertree.

The map can be created asynchronusly so that every child of the MapProvider is just
rendered when the map is ready.

```jsx
const React = require('react');
const OlSourceOsm = require('ol/source/OSM').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlView = require('ol/View').default;
const OlMap = require('ol/Map').default;

const {
  MapComponent,
  MapProvider,
  NominatimSearch,
  mappify
} = require('../../index.js');

const Map = mappify(MapComponent);
const Search = mappify(NominatimSearch);

class MapComponentExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.mapPromise = new Promise(resolve => {
      const layer = new OlLayerTile({
        source: new OlSourceOsm()
      });

      const map = new OlMap({
        target: null,
        view: new OlView({
          center: [
            135.1691495,
            34.6565482
          ],
          projection: 'EPSG:4326',
          zoom: 16,
        }),
        layers: [layer]
      });

      this.map = map;

      resolve(map);
    });
  }

  componentDidMount() {
    window.setTimeout(() => {
      this.map.setTarget(this.mapDivId);
    }, 100);
  }

  render() {
    return(
      <MapProvider map={this.mapPromise}>
        NominatimSearch:
        <Search />
        <Map
          id={this.mapDivId}
          style={{
            height: '400px'
          }}
        />
      </MapProvider>
    )
  }
}

<MapComponentExample />
```
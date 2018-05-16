This demonstrates the use of The `LoadifiedComponent` HOC (High Order Component).

The example below you see a `SimpleButton` that changes the `Titlebar`'s loading status:
```jsx
const { loadify, Titlebar, SimpleButton } = require('../../index.js');
const React = require('react');
const LoadingPanel = loadify(Titlebar);

class LoadingTitleBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  loadingChange() {
    const { loading } = this.state
    this.setState({
      loading: !loading
    })
  }

  render() {
    const { loading } = this.state
    return(
      <div>
        <LoadingPanel
          spinning={loading}
          style={{position: 'relative'}}
        > A simple Titlebar
        </LoadingPanel>
        <SimpleButton
          onClick={this.loadingChange.bind(this)}>
          start/stop loading
        </SimpleButton>
      </div>
    )
  }
}
<LoadingTitleBar />
```
This shows the use of the component with the `LayerTree` component.
Changing the layer orders in the `layerTree` will trigger the loading status to change.
```jsx
const { loadify, LayerTree } = require('../../index.js');
const React = require('react');
const OlMap  = require('ol/Map').default;
const OlView  = require('ol/View').default;
const OlLayerGroup  = require('ol/layer/Group').default;
const OlLayerTile  = require('ol/layer/Tile').default;
const OlSourceTileJson  = require('ol/source/TileJSON').default;
const OlSourceOsm  = require('ol/source/OSM').default;
const fromLonLat  = require('ol/proj').fromLonLat;

const LoadingTree = loadify(LayerTree);

class LoadingTreeExample extends React.Component {

  constructor(props) {
    super(props);

    this.mapDivId = `map-${Math.random()}`;
    this.layerGroup = new OlLayerGroup({
      name: 'Layergroup',
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOsm()
        }),
        new OlLayerTile({
          name: 'Food insecurity layer',
          minResolution: 2000,
          maxResolution: 8000,
          source: new OlSourceTileJson({
            url: 'https://api.tiles.mapbox.com/v3/mapbox.20110804-hoa-foodinsecurity-3month.json?secure',
            crossOrigin: 'anonymous'
          })
        }),
        new OlLayerTile({
          name: 'World borders layer',
          minResolution: 2000,
          maxResolution: 20000,
          source: new OlSourceTileJson({
            url: 'https://api.tiles.mapbox.com/v3/mapbox.world-borders-light.json?secure',
            crossOrigin: 'anonymous'
          })
        })
      ]
    });
    this.map = new OlMap({
      layers: [this.layerGroup],
      view: new OlView({
        center: fromLonLat([37.40570, 8.81566]),
        zoom: 4
      })
    });
    this.state = {
      loading: false
    };
  }

  loadingStart() {
    this.setState({
      loading: true
    })
  }

  loadingEnd() {
    this.setState({
      loading: false
    })
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    return(
      <div
        id={this.mapDivId}
        style={{
          height: '400px'
        }}
      >
        <LoadingTree
          spinning={this.state.loading}
          tip={'Loading...'}
          onDragStart={this.loadingStart.bind(this)}
          onDragEnd={this.loadingEnd.bind(this)}
          layerGroup={this.layerGroup}
          map={this.map}
        />
      </div>
    )
  }
}
<LoadingTreeExample />
```

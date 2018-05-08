This demonstrates the use of The  `Loadify` Component.
A simple `Titlebar` set to be loading: 
```jsx
const { Loadify, Titlebar } = require('../../index.js');
const LoadingPanel = Loadify(Titlebar);

<LoadingPanel 
  spinning={true}
  style={{position: 'relative'}}
> A simple Titlebar 
</LoadingPanel>
```
This shows the use of the component with the `LayerTree` component.
```jsx
const { Loadify, LayerTree } = require('../../index.js');
const React = require('react');
const OlMap  = require('ol/map').default;
const OlView  = require('ol/view').default;
const OlLayerGroup  = require('ol/layer/group').default;
const OlLayerTile  = require('ol/layer/tile').default;
const OlSourceTileJson  = require('ol/source/tilejson').default;
const OlSourceOsm  = require('ol/source/osm').default;
const OlProj  = require('ol/proj').default;

const LoadingTree = Loadify(LayerTree);

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
        center: OlProj.fromLonLat([37.40570, 8.81566]),
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
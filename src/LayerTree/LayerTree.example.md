This example demonstrates the LayerTree.

```jsx
const React = require('react');
const OlMap  = require('ol/Map').default;
const OlView  = require('ol/View').default;
const OlLayerGroup  = require('ol/layer/Group').default;
const OlLayerTile  = require('ol/layer/Tile').default;
const OlSourceTileJson  = require('ol/source/TileJSON').default;
const OlSourceOsm  = require('ol/source/OSM').default;
const fromLonLat = require('ol/proj').fromLonLat;

class LayerTreeExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.layerGroup = new OlLayerGroup({
      name: 'Layergroup',
      layers: [
        new OlLayerTile({
          name: 'Food insecurity layer',
          minResolution: 200,
          maxResolution: 2000,
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
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOsm()
        }),
        this.layerGroup
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

        <span>{'Please note that the layers have resolution restrictions, please zoom in and out to see how the trees react to this.'}</span>
        <div className="example-block">
          <span>{'Autoconfigured with topmost LayerGroup of passed map:'}</span>

          <LayerTree
            map={this.map}
          />

        </div>

        <div className="example-block">
          <span>{'A LayerTree configured with concrete layerGroup:'}</span>

          <LayerTree
            layerGroup={this.layerGroup}
            map={this.map}
          />
        </div>

        <div className="example-block">
          <span>{'A LayerTree with a filterFunction (The OSM layer is filtered out):'}</span>

          <LayerTree
            map={this.map}
            filterFunction={(layer) => layer.get('name') != 'OSM'}
          />
        </div>
      </div>
    )
  }
}

<LayerTreeExample />
```

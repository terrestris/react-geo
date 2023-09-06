This example demonstrates the Legend.

```jsx
import Legend from '@terrestris/react-geo/dist/Legend/Legend';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import * as React from 'react';

class LegendExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.background = new OlLayerTile({
      name: 'OSM-WMS',
      source: new OlSourceTileWMS({
        url: 'https://ows.terrestris.de/osm-gray/service',
        params: {LAYERS: 'OSM-WMS', TILED: true},
        serverType: 'geoserver'
      })
    });

    this.usa = new OlLayerTile({
      name: 'States (USA)',
      source: new OlSourceTileWMS({
        url: 'https://ahocevar.com/geoserver/wms',
        params: {LAYERS: 'usa:states', TILED: true},
        serverType: 'geoserver'
      })
    });

    this.places =  new OlLayerTile({
      name: 'Places',
      legendUrl: 'https://terrestris.github.io/react-geo/assets/legend1.png',
      source: new OlSourceTileWMS({
        url: 'https://ahocevar.com/geoserver/wms',
        params: {LAYERS: 'ne:ne_10m_populated_places', TILED: true, TRANSPARENT: 'true'},
        serverType: 'geoserver'
      })
    });

    this.extraParams = {
      HEIGHT: 10,
      WIDTH: 10
    };

    this.map = new OlMap({
      layers: [
        this.background,
        this.usa,
        this.places
      ],
      view: new OlView({
        center: fromLonLat([-98.583333, 39.833333]),
        zoom: 4
      })
    });
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
            height: '200px'
          }}
        />

        <div className="example-block">
          <span>{`Layer ${this.background.get('name')}:`}</span>
          <Legend layer={this.background} />
        </div>

        <div className="example-block">
          <span>{`Layer ${this.usa.get('name')} with "extraParams":`}</span>
          <Legend layer={this.usa} extraParams={this.extraParams} />
        </div>

        <div className="example-block">
          <span>{`Layer ${this.places.get('name')} with custom "legendUrl":`}</span>
          <Legend layer={this.places} />
        </div>
      </div>
    );
  }
}

<LegendExample />
```

This example demonstrates the LayerTree.

```jsx
import * as React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerGroup from 'ol/layer/Group';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import { fromLonLat } from 'ol/proj';

import LayerTree from '@terrestris/react-geo/LayerTree/LayerTree';

class LayerTreeExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.layerGroup = new OlLayerGroup({
      name: 'Layergroup',
      layers: [
        new OlLayerTile({
          name: 'OSM-Overlay-WMS',
          minResolution: 0,
          maxResolution: 200,
          source: new OlSourceTileWMS({
            url: 'https://ows.terrestris.de/osm/service',
            params: {
              'LAYERS': 'OSM-Overlay-WMS'
            }
          })
        }),
        new OlLayerTile({
          name: 'SRTM30-Contour',
          minResolution: 0,
          maxResolution: 10,
          source: new OlSourceTileWMS({
            url: 'https://ows.terrestris.de/osm/service',
            params: {
              'LAYERS': 'SRTM30-Contour'
            }
          })
        })
      ]
    });

    this.map = new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOSM()
        }),
        this.layerGroup
      ],
      view: new OlView({
        center: fromLonLat([12.924, 47.551]),
        zoom: 13
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
    );
  }
}

<LayerTreeExample />
```

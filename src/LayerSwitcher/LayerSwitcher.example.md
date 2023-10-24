This example shows the LayerSwitcher component.
Just click on the switcher to change the layer.
The passed layers are handled like only one of it can be visible.

```jsx
import LayerSwitcher from '@terrestris/react-geo/dist/LayerSwitcher/LayerSwitcher';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import * as React from 'react';

class LayerSwitcherExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.layers = [
      new OlLayerTile({
        name: 'OSM',
        source: new OlSourceOsm()
      }),
      new OlLayerTile({
        source: new OlSourceTileWMS({
          url: 'https://ows.terrestris.de/osm/service?'
        })
      })
    ];

    this.map = new OlMap({
      view: new OlView({
        center: [801045, 6577113],
        zoom: 9
      }),
      layers: this.layers
    });
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    return (
      <div
        id={this.mapDivId}
        style={{
          position: 'relative',
          height: '200px'
        }}
      >
        <LayerSwitcher
          style={{
            position: 'absolute',
            bottom: 0,
            left: '10px',
            zIndex: 2
          }}
          map={this.map}
          layers={this.layers}
        />
      </div>
    );
  }
}

<LayerSwitcherExample />
```

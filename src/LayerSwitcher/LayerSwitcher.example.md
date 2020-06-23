This example shows the LayerSwitcher component.
Just click on the switcher to change the layer.
The passed layers are handled like only one of it can be visible.

```jsx
import * as React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceStamen from 'ol/source/Stamen';
import OlSourceOsm from 'ol/source/OSM';

import LayerSwitcher from '@terrestris/react-geo/LayerSwitcher/LayerSwitcher';

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
        name: 'Stamen',
        source: new OlSourceStamen({
          layer: 'watercolor'
        })
      }),
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
    return(
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

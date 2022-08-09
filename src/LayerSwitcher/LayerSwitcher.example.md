This example shows the LayerSwitcher component.
Just click on the switcher to change the layer.
The passed layers are handled like only one of it can be visible.

```jsx
import * as React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import OlSourceStamen from 'ol/source/Stamen';
import OlSourceImage from 'ol/source/Image';
import OlSourceOsm from 'ol/source/OSM';

import LayerSwitcher from '@terrestris/react-geo/LayerSwitcher/LayerSwitcher';

class LayerSwitcherExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    const projectLayerExtent = [724219, 6.64842e+06, 1.30845e+06, 7.19825e+06];

    const dop20 = new OlLayerImage({
      extent: projectLayerExtent,
      visible: false,
      source: new OlSourceImage({
        url: 'https://www.geobasisdaten.niedersachsen.de/doorman/noauth/wms_ni_dop',
        params: {
          'LAYERS': 'dop20'
        },
        ratio: 1,
        serverType: 'geoserver',
        // eslint-disable-next-line max-len
        attributions: '© LGLN, Datenlizenz Deutschland Namensnennung 2.0 (dl-de/by-2-, www.govdata.de/dl-de/by-2-0). Quelle: https://opengeodata.lgln.niedersachsen.de/#dop'
      })
    });
    dop20.set('name', 'Luftbilder');

    this.layers = [
      new OlLayerTile({
        name: 'OSM',
        source: new OlSourceOsm()
      }),
      dop20
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

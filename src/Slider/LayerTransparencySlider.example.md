This example demonstrates the LayerTransparencySlider.

```jsx
import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import LayerTransparencySlider from '@terrestris/react-geo/Slider/LayerTransparencySlider';

class LayerTransparencySliderExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.layer = new OlLayerTile({
      name: 'OSM',
      source: new OlSourceOSM()
    });

    this.map = new OlMap({
      layers: [
        this.layer
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
        />

        <div>
          <span>{'Move the slider to change the layer\'s opacity:'}</span>

          <LayerTransparencySlider
            layer={this.layer}
          />
        </div>
      </div>
    )
  }
}

<LayerTransparencySliderExample />
```

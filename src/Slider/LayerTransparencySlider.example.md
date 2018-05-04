This example demonstrates the LayerTransparencySlider.

```jsx
const React = require('react');
const OlMap = require('ol/Map').default;
const OlView = require('ol/View').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlSourceOsm = require('ol/source/OSM').default;
const fromLonLat = require('ol/proj').fromLonLat;

class LayerTransparencySliderExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.layer = new OlLayerTile({
      name: 'OSM',
      source: new OlSourceOsm()
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

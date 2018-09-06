This example shows the usage of the MultiLayerSlider.
It takes an Array of layers that are already added to the map and makes
their opacity changeable by a single slider component.

This way you can slide through a set of layers, which e.g. is useful when using
layers showing the same area but different content or time.

```jsx
const React = require('react');
const OlMap = require('ol/Map').default;
const OlView = require('ol/View').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlSourceTileWMS = require('ol/source/TileWMS').default;

const {
  MultiLayerSlider
} = require('../../index');

class MultiLayerSliderExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.layer1 = new OlLayerTile({
      name: 'Land/Water',
      source: new OlSourceTileWMS({
        url: 'https://geoserver.mundialis.de/geoserver/wms',
        params: {'LAYERS': '1_8A1104', 'TILED': true},
        serverType: 'geoserver'
      })
    });
    this.layer2 = new OlLayerTile({
      name: 'True Color Composite',
      source: new OlSourceTileWMS({
        url: 'https://geoserver.mundialis.de/geoserver/wms',
        params: {'LAYERS': '1_040302', 'TILED': true},
        serverType: 'geoserver'
      })
    });
    this.layer3 = new OlLayerTile({
      name: 'Color Infrared (vegetation)',
      source: new OlSourceTileWMS({
        url: 'https://geoserver.mundialis.de/geoserver/wms',
        params: {'LAYERS': '1_080403', 'TILED': true},
        serverType: 'geoserver'
      })
    });
    this.layer4 = new OlLayerTile({
      name: 'Atmospheric Penetration',
      source: new OlSourceTileWMS({
        url: 'https://geoserver.mundialis.de/geoserver/wms',
        params: {'LAYERS': '1_12118A', 'TILED': true},
        serverType: 'geoserver'
      })
    });
    this.layer5 = new OlLayerTile({
      name: 'Vegetation',
      source: new OlSourceTileWMS({
        url: 'https://geoserver.mundialis.de/geoserver/wms',
        params: {'LAYERS': '1_118A04', 'TILED': true},
        serverType: 'geoserver'
      })
    });

    this.map = new OlMap({
      layers: [
        this.layer1,
        this.layer2,
        this.layer3,
        this.layer4,
        this.layer5
      ],
      view: new OlView({
        center: [4100247.903296841, -456383.49866892234],
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

        <div>
          <span>{'Move the slider to change the layer\'s opacity:'}</span>
          <MultiLayerSlider
            layers={[
              this.layer1,
              this.layer2,
              this.layer3,
              this.layer4,
              this.layer5
            ]}
          />
        </div>
      </div>
    );
  }
}

<MultiLayerSliderExample />
```

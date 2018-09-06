This demonstrates the usage of the CircleMenu.

CircleMenu in a Map (click the red feature):

```jsx
const React = require('react');
const OlSourceOsm = require('ol/source/OSM').default;
const OlSourceVector = require('ol/source/Vector').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlLayerVector = require('ol/layer/Vector').default;
const OlFeature = require('ol/Feature').default;
const OlGeomPoint = require('ol/geom/Point').default;
const OlView = require('ol/View').default;
const OlMap = require('ol/Map').default;
const OlStyleStyle = require('ol/style/Style').default;
const OlStyleCircle = require('ol/style/Circle').default;
const OlStyleFill = require('ol/style/Fill').default;
const {
  CircleMenu,
  SimpleButton
} = require('../index.js');

class CircleMenuExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    const osmLayer = new OlLayerTile({
      source: new OlSourceOsm()
    });
    const featureLayer = new OlLayerVector({
      source: new OlSourceVector({
        features: [new OlFeature({
          geometry: new OlGeomPoint([
            135.1691495,
            34.6565482
          ])
        })]
      }),
      style: new OlStyleStyle({
        image: new OlStyleCircle({
          radius: 10,
          fill: new OlStyleFill({
            color: '#C62148'
          })
        })
      })
    });

    this.map = new OlMap({
      view: new OlView({
        center: [
          135.1691495,
          34.6565482
        ],
        projection: 'EPSG:4326',
        zoom: 16,
      }),
      layers: [
        osmLayer,
        featureLayer
      ],
      interactions: []
    });

    this.map.on('singleclick', evt => {
      const map = evt.map;
      const mapEl = document.getElementById(this.mapDivId);
      const pixel = map.getPixelFromCoordinate([135.1691495, 34.6565482]);
      const evtPixel = map.getPixelFromCoordinate(evt.coordinate);
      let visibleMap;
      let mapMenuCoords;

      if (map.hasFeatureAtPixel(evtPixel)) {
        visibleMap = true;
        mapMenuCoords = [
          pixel[0] + mapEl.offsetLeft,
          pixel[1] + mapEl.offsetTop,
        ];
      } else {
        visibleMap = false;
      }

      this.setState({
        mapMenuCoords,
        visibleMap
      });
    });

    this.state = {
      mapMenuCoords: [],
      visibleMap: false
    };
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    const {
      mapMenuCoords,
      visibleMap
    } = this.state;

    return (
      <div>
        <div
          id={this.mapDivId}
          style={{
            height: '400px'
          }}
        />
        {
          visibleMap ?
            <CircleMenu
              position={mapMenuCoords}
              diameter={80}
              animationDuration={500}
            >
              <SimpleButton icon="pencil" shape="circle" />
              <SimpleButton icon="line-chart" shape="circle" />
              <SimpleButton icon="link" shape="circle" />
              <SimpleButton icon="thumbs-o-up" shape="circle" />
              <SimpleButton icon="bullhorn" shape="circle" />
            </CircleMenu> :
            null
        }
      </div>
    )
  }
}

<CircleMenuExample />
```
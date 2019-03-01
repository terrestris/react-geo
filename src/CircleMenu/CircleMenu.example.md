This demonstrates the usage of the CircleMenu.

CircleMenu in a Map (click the red feature):

```jsx
import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
const OlLayerVector = require('ol/layer/Vector').default;
// import OlLayerVector from 'ol/layer/Vector';
import OlSourceOSM from 'ol/source/OSM';
import OlSourceVector from 'ol/source/Vector';
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';
import OlStyleStyle from 'ol/style/Style';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleFill from 'ol/style/Fill';

import CircleMenu from '@terrestris/react-geo/CircleMenu/CircleMenu';
import SimpleButton from '@terrestris/react-geo/Button/SimpleButton/SimpleButton';

class CircleMenuExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    const osmLayer = new OlLayerTile({
      source: new OlSourceOSM()
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
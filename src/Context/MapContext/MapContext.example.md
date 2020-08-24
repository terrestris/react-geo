This example shows the usage of the MapContext which uses the new React Context API introduced
with [react 16.3](https://reactjs.org/docs/context.html).

It replaces the old `MapProvider` and `mappify` HOC.

If you are using function-components head over to the `useMap` example in the "HOOKS" section.


```jsx
import * as React from 'react';

import MapContext from '@terrestris/react-geo/Context/MapContext/MapContext';
import MapComponent from '@terrestris/react-geo/Map/MapComponent/MapComponent';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';

class MapContextExample extends React.Component {

  constructor(props) {
    super(props);
    this.mapDivId = 'mapcontext-example';
    const layer = new OlLayerTile({
      source: new OlSourceOsm()
    });
    const olMap = new OlMap({
      target: null,
      view: new OlView({
        center: [
          135.1691495,
          34.6565482
        ],
        projection: 'EPSG:4326',
        zoom: 16,
      }),
      layers: [layer]
    });
    this.map = olMap;
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    return(
      <MapContext.Provider value={this.map}>
        <MapContext.Consumer>
          {(map) => {
            return <MapComponent
              map={map}
              style={{
                height: '400px'
              }}
            />
          }}
        </MapContext.Consumer>
      </MapContext.Provider>
    );
  }
}

<MapContextExample />
```

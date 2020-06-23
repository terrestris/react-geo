This demonstrates the use of The `LoadifiedComponent` HOC (High Order Component).

The example below you see a `SimpleButton` that changes the `Titlebar`'s loading status:
```jsx
import * as React from 'react';

import SimpleButton from '@terrestris/react-geo/Button/SimpleButton/SimpleButton';
import Titlebar from '@terrestris/react-geo/Panel/Titlebar/Titlebar';
import { loadify } from '@terrestris/react-geo/HigherOrderComponent/LoadifiedComponent/LoadifiedComponent';

const LoadingPanel = loadify(Titlebar);

class LoadingTitleBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  loadingChange() {
    const { loading } = this.state;
    this.setState({
      loading: !loading
    });
  }

  render() {
    const { loading } = this.state;
    return(
      <div>
        <LoadingPanel
          spinning={loading}
          style={{position: 'relative'}}
        > A simple Titlebar
        </LoadingPanel>
        <SimpleButton
          onClick={this.loadingChange.bind(this)}>
          start/stop loading
        </SimpleButton>
      </div>
    );
  }
}
<LoadingTitleBar />

```
This shows the use of the component with the `LayerTree` component.
Changing the layer orders in the `layerTree` will trigger the loading status to change.
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
import { loadify } from '@terrestris/react-geo/HigherOrderComponent/LoadifiedComponent/LoadifiedComponent';

const LoadingTree = loadify(LayerTree);

class LoadingTreeExample extends React.Component {

  constructor(props) {
    super(props);

    this.mapDivId = `map-${Math.random()}`;
    this.layerGroup = new OlLayerGroup({
      name: 'Layergroup',
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOSM()
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
      layers: [this.layerGroup],
      view: new OlView({
        center: fromLonLat([12.924, 47.551]),
        zoom: 13
      })
    });

    this.state = {
      loading: false
    };
  }

  loadingStart() {
    this.setState({
      loading: true
    });
  }

  loadingEnd() {
    this.setState({
      loading: false
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
          height: '400px'
        }}
      >
        <LoadingTree
          spinning={this.state.loading}
          tip={'Loading...'}
          onDragStart={this.loadingStart.bind(this)}
          onDragEnd={this.loadingEnd.bind(this)}
          layerGroup={this.layerGroup}
          map={this.map}
        />
      </div>
    );
  }
}
<LoadingTreeExample />
```

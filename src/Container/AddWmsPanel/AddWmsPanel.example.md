In this example layers of a WMS can be added to a map.
The capabilities of this WMS are fetched and parsed to OL layer instances using the `CapabilitiesUtil`.
An `AddWmsPanel` shows a list of the parsed layers and each checked layer (or the entire set) can be added to the map.

```jsx
import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import AddWmsPanel from '@terrestris/react-geo/Container/AddWmsPanel/AddWmsPanel';
import SimpleButton from '@terrestris/react-geo/Button/SimpleButton/SimpleButton';

import CapabilitiesUtil from '@terrestris/ol-util/dist/CapabilitiesUtil/CapabilitiesUtil';

// Please note: CORS headers must be set on server providing capabilities document. Otherwise proxy needed.
const WMS_CAPABILITIES_URL = 'https://ows.terrestris.de/osm/service?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities';

class AddWmsPanelExample extends React.Component {

  constructor(props) {
    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.map = new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOSM()
        })
      ],
      view: new OlView({
        center: fromLonLat([7.40570, 53.81566]),
        zoom: 4
      })
    });

    this.state = {
      layers: []
    }
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  onClick() {
    CapabilitiesUtil.parseWmsCapabilities(WMS_CAPABILITIES_URL)
      .then(CapabilitiesUtil.getLayersFromWmsCapabilities)
      .then(layers => {
        this.setState({
          layers: layers
        });
      })
      .catch(() => alert('Could not parse capabilities document.'));
  }

  render() {
    const {
      layers
    } = this.state;

    return(
      <div>
        <div
          id={this.mapDivId}
          style={{
            height: '400px'
          }}
        />
        <div>
          <SimpleButton
            onClick={this.onClick.bind(this)}
          >
            Fetch capabilities of OWS terrestris
          </SimpleButton>
          <AddWmsPanel
            style={{
              position: 'relative',
              height: '500px'
            }}
            key="1"
            map={this.map}
            wmsLayers={layers}
            draggable={true}
            width={500}
            height={400}
            x={0}
            y={100}
          />
        </div>
      </div>
    );
  }
}

<AddWmsPanelExample />
```

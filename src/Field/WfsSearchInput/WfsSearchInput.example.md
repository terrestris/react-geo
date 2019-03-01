This demonstrates the usage of the WfsSearchInput with presentation of found
results in AgFeatureGrid component.


```jsx
import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';

import AgFeatureGrid from '@terrestris/react-geo/Grid/AgFeatureGrid/AgFeatureGrid';
import WfsSearchInput from '@terrestris/react-geo/Field/WfsSearchInput/WfsSearchInput';

class WfsSearchInputExample extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      data: []
    }

    this.mapDivId = `map-${Math.random()}`;

    this.map = new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOSM()
        })
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

  onFetchSuccess(data) {
    const format = new OlFormatGeoJSON();
    const features = data.map(d => format.readFeature(d));
    this.setState({
      data: features
    });
  }

  onClearClick() {
    this.setState({
      data: []
    });
  }

  render() {
    return(
      <div>
        <div className="example-block">
          <label>WFS Search Input:<br />
            <WfsSearchInput
              placeholder="Type a countryname in its own language…"
              baseUrl='https://ows.terrestris.de/geoserver/osm/wfs'
              featureTypes={['osm:osm-country-borders']}
              searchAttributes={{
                'osm:osm-country-borders': ['name']
              }}
              map={this.map}
              style={{
                width: '80%'
              }}
              onFetchSuccess={this.onFetchSuccess.bind(this)}
              onClearClick={this.onClearClick.bind(this)}
            />
            {
              this.state.data.length > 0 &&
              <AgFeatureGrid
                features={this.state.data}
                map={this.map}
                enableSorting={true}
                enableFilter={true}
                enableColResize={true}
                attributeBlacklist={['osm_id', 'admin_level', 'administrative']}
                columnDefs={{
                  'id': {
                    headerName: 'ID'
                  },
                  'name': {
                    headerName: 'Country name'
                  },
                  'admin_level': {
                    headerName: 'Administrative level'
                  }
                }}
                zoomToExtent={true}
                selectable={true}
              />
            }
          </label>
        </div>
        <div
          id={this.mapDivId}
          style={{
            height: '400px'
          }}
        />
      </div>
    )
  }
}

<WfsSearchInputExample />
```

This demonstrates the usage of the WfsSearch.

```jsx
import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import WfsSearch from '@terrestris/react-geo/Field/WfsSearch/WfsSearch';

class WfsSearchExample extends React.Component {

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
        <div className="example-block">
          <label>WFS Search:<br />
            <WfsSearch
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
            />
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

<WfsSearchExample />
```

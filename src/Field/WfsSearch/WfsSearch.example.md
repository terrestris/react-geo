This demonstrates the usage of the WfsSearch.

```jsx
import WfsSearch from '@terrestris/react-geo/dist/Field/WfsSearch/WfsSearch';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

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
    return (
      <div>
        <div className="example-block">
          <label>WFS Search:<br />
            <WfsSearch
              placeholder="Type a countryname in its own language…"
              baseUrl='https://ows-demo.terrestris.de/geoserver/osm/wfs'
              featureTypes={['osm:osm-country-borders']}
              maxFeatures={3}
              attributeDetails={{
                'osm:osm-country-borders': {
                  name: {
                    type: 'string',
                    exactSearch: false,
                    matchCase: false
                  }
                }
              }}
              map={this.map}
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
    );
  }
}

<WfsSearchExample />
```

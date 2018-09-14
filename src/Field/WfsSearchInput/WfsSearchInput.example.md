This demonstrates the usage of the WfsSearchInput with presentation of found
results in AgFeatureGrid component.


```jsx
const React = require('react');
const OlMap = require('ol/Map').default;
const OlView = require('ol/View').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlSourceOsm = require('ol/source/OSM').default;
const fromLonLat = require('ol/proj').fromLonLat;
const OlFormatGeoJson = require('ol/format/GeoJSON').default;

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
          source: new OlSourceOsm()
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
    const format = new OlFormatGeoJson();
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

This demonstrates the usage of the CoordinateReferenceSystemCombo.

```jsx
const React = require('react');
const proj4 = require('proj4').default;

const register = require('ol/proj/proj4').register;

const OlMap = require('ol/Map').default;
const OlView = require('ol/View').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlSourceOsm = require('ol/source/OSM').default;
const fromLonLat = require('ol/proj').fromLonLat;
const getTransform = require('ol/proj').getTransform;
const get = require('ol/proj').get;
const applyTransform = require('ol/extent').applyTransform;

const predefinedCrsDefinitions = [{
  code: '25832',
  value: 'ETRS89 / UTM zone 32N'
}, {
  code: '31466',
  value: 'DHDN / 3-degree Gauss-Kruger zone 2'
}, {
  code: '31467',
  value: 'DHDN / 3-degree Gauss-Kruger zone 3'
}, {
  code: '4326',
  value: 'WGS 84'
}];

class CoordinateReferenceSystemComboExample extends React.Component {

  constructor(props) {

    super(props);

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

    register(proj4);
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  /**
   * Set map projection and perform client-side raster reprojection from
   * OSM (EPSG:3857) to arbitrary projection given in crsObj.
   *
   * original code of setProjection can be found here:
   * https://openlayers.org/en/latest/examples/reprojection-by-code.html
   */
  setProjection(crsObj) {
    const {
      code,
      value,
      proj4def,
      bbox
    } = crsObj;

    if (code === null || value === null || proj4def === null || bbox === null) {
      return;
    }

    const newProjCode = 'EPSG:' + code;
    proj4.defs(newProjCode, proj4def);
    register(proj4);
    const newProj = get(newProjCode);
    const fromLonLat = getTransform('EPSG:4326', newProj);

    // very approximate calculation of projection extent
    const extent = applyTransform(
      [bbox[1], bbox[2], bbox[3], bbox[0]], fromLonLat);
    newProj.setExtent(extent);
    const newView = new OlView({
      projection: newProj
    });
    this.map.setView(newView);
    newView.fit(extent);
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

        <div className="example-block">
          <span>
            A <code>CoordinateReferenceSystemCombo</code> with autocomplete mode
            where CRS are fetched from <a href="https://epsg.io/">epsg.io/</a>.
            If a CRS is selected (prop <code>onSelect</code>), the projection is
            used to perform client-side raster reprojection of OSM layer in map.
          </span>

          <br />

          <CoordinateReferenceSystemCombo
            emptyTextPlaceholderText="Type to fetch definitions dynamically"
            onSelect={this.setProjection.bind(this)}
          />
        </div>

        <div className="example-block">
          <span>
            A <code>CoordinateReferenceSystemCombo</code> with predefined definitions
            of four CRS. Selecting an option does not affect the map.
          </span>

          <br />

          {/* A CoordinateReferenceSystemCombo having predefinedCrsDefinitions*/}
          <CoordinateReferenceSystemCombo
            predefinedCrsDefinitions={predefinedCrsDefinitions}
          />
        </div>
      </div>
    );
  }
}

<CoordinateReferenceSystemComboExample />
```

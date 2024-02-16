This demonstrates the usage of the CoordinateReferenceSystemCombo.

```jsx
import CoordinateReferenceSystemCombo from
  '@terrestris/react-geo/dist/Field/CoordinateReferenceSystemCombo/CoordinateReferenceSystemCombo';
import { applyTransform } from 'ol/extent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import {
  fromLonLat,
  get,
  getTransform
} from 'ol/proj';
import { register } from 'ol/proj/proj4';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import proj4 from 'proj4';
import * as React from 'react';

const predefinedCrsDefinitions = [{
  code: '25832',
  value: 'ETRS89 / UTM zone 32N',
  proj4def: '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  bbox: [83.92, 6, 38.76, 12]
}, {
  code: '31466',
  value: 'DHDN / 3-degree Gauss-Kruger zone 2',
  proj4def: '+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel ' +
    '+towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs',
  bbox: [53.81, 5.86, 49.11, 7.5]
}, {
  code: '31467',
  value: 'DHDN / 3-degree Gauss-Kruger zone 3',
  proj4def: '+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel ' +
    '+towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs',
  bbox: [55.09, 7.5, 47.27, 10.51]
}, {
  code: '4326',
  value: 'WGS 84',
  proj4def: '+proj=longlat +datum=WGS84 +no_defs',
  bbox: [90, -180, -90, 180]
}];

class CoordinateReferenceSystemComboExample extends React.Component {

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
    const fromLL = getTransform('EPSG:4326', newProj);

    // very approximate calculation of projection extent
    const extent = applyTransform(
      [bbox[1], bbox[2], bbox[3], bbox[0]], fromLL);
    newProj.setExtent(extent);
    const newView = new OlView({
      projection: newProj
    });
    this.map.setView(newView);
    newView.fit(extent);
  }

  render() {
    return (
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
            onSelect={this.setProjection.bind(this)}
          />
        </div>
      </div>
    );
  }
}

<CoordinateReferenceSystemComboExample />
```

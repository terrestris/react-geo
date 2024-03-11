This demonstrates the usage of the CoordinateReferenceSystemCombo.

```jsx
import CoordinateReferenceSystemCombo from
  '@terrestris/react-geo/dist/Field/CoordinateReferenceSystemCombo/CoordinateReferenceSystemCombo';
import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
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
import React, { useEffect, useState } from 'react';

const predefinedCrsDefinitions = [{
  code: '25832',
  name: 'ETRS89 / UTM zone 32N',
  proj4: '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  bbox: [83.92, 6, 38.76, 12]
}, {
  code: '31466',
  name: 'DHDN / 3-degree Gauss-Kruger zone 2',
  proj4: '+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel ' +
    '+towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs',
  bbox: [53.81, 5.86, 49.11, 7.5]
}, {
  code: '31467',
  name: 'DHDN / 3-degree Gauss-Kruger zone 3',
  proj4: '+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel ' +
    '+towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs',
  bbox: [55.09, 7.5, 47.27, 10.51]
}, {
  code: '4326',
  name: 'WGS 84',
  proj4: '+proj=longlat +datum=WGS84 +no_defs',
  bbox: [90, -180, -90, 180]
}];

const CoordinateReferenceSystemComboExample = () => {

  const [map, setMap] = useState();

  useEffect(() => {
    setMap(new OlMap({
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
    }));

    register(proj4);
  }, []);

  if (!map) {
    return null;
  }

  /**
   * Set map projection and perform client-side raster reprojection from
   * OSM (EPSG:3857) to arbitrary projection given in crsObj.
   *
   * original code of setProjection can be found here:
   * https://openlayers.org/en/latest/examples/reprojection-by-code.html
   */
  setProjection = function(crsObj) {
    const {
      code,
      name,
      proj4: proj4str,
      bbox
    } = crsObj;

    if (code === null || name === null || proj4str === null || bbox === null) {
      return;
    }

    const newProjCode = 'EPSG:' + code;
    proj4.defs(newProjCode, proj4str);

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
    map.setView(newView);
    newView.fit(extent);
  }

  return (
    <MapContext.Provider value={map}>
      <MapComponent
        map={map}
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
          onSelect={setProjection}
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
          onSelect={setProjection}
        />
      </div>
    </MapContext.Provider>
  );
}

<CoordinateReferenceSystemComboExample />
```

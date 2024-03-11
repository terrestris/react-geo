This demonstrates the usage of the WfsSearch.
Type a country name in its own language…

```jsx
import WfsSearch from '@terrestris/react-geo/dist/Field/WfsSearchField/WfsSearchField';
import AgFeatureGrid from '@terrestris/react-geo/dist/Grid/AgFeatureGrid/AgFeatureGrid';
import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import { useEffect, useState } from 'react';

const WfsSearchFieldExample = () => {

  const [map, setMap] = useState();
  const [inputFeatures, setInputFeatures] = useState([]);

  useEffect(() => {
    const newMap = new OlMap({
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
    setMap(newMap);
  }, []);

  if (!map) {
    return null;
  }

  const onFeaturesChange = f => setInputFeatures(f);

  return (
    <MapContext.Provider value={map}>
      <div className="example-block">
        <label>WFS Search als AutoComplete (default):<br />
          <WfsSearch
            placeholder="Type a countryname in its own language…"
            baseUrl='https://ows-demo.terrestris.de/geoserver/osm/wfs'
            featureTypes={['osm:osm-country-borders']}
            featureNS={'osm'}
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
          />
        </label>
      </div>
      <div className="example-block">
        <label>WFS Search as Input<br />
          <WfsSearch
            placeholder="Type a countryname in its own language…"
            baseUrl='https://ows-demo.terrestris.de/geoserver/osm/wfs'
            featureTypes={['osm:osm-country-borders']}
            attributeDetails={{
              'osm:osm-country-borders': {
                name: {
                  type: 'string',
                  exactSearch: false,
                  matchCase: false
                }
              }
            }}
            asInput
            onChange={onFeaturesChange}
          />
          {
            inputFeatures && inputFeatures.length > 0 &&
            <AgFeatureGrid
              features={inputFeatures}
              map={map}
              enableSorting={true}
              enableFilter={true}
              enableColResize={true}
              attributeBlacklist={['osm_id', 'admin_level', 'administrative']}
              columnDefs={{
                id: {
                  headerName: 'ID'
                },
                name: {
                  headerName: 'Country name'
                },
                // eslint-disable-next-line camelcase
                admin_level: {
                  headerName: 'Administrative level'
                }
              }}
              zoomToExtent={true}
              selectable={true}
            />
          }
        </label>
      </div>
      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />
    </MapContext.Provider>
  );
};
<WfsSearchFieldExample />
```

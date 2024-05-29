This demonstrates the usage of the SearchField with nominatim and wfs examples.

```jsx
import SearchField from '@terrestris/react-geo/dist/Field/SearchField/SearchField';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import {fromLonLat} from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import {useCallback, useEffect, useState} from 'react';
import {
  createNominatimSearchFunction,
  createNominatimGetValueFunction,
  createNominatimGetExtentFunction,
  createWfsSearchFunction
} from "@terrestris/react-util";

const SearchFieldExample = () => {
  const [map, setMap] = useState();

  const nominatimSearchFunction = useCallback(createNominatimSearchFunction({}), []);
  const nominatimGetValue = useCallback(createNominatimGetValueFunction(), []);
  const nominatimGetExtent = useCallback(createNominatimGetExtentFunction(), []);

  const wfsSearchFunction = useCallback(createWfsSearchFunction({
    baseUrl: 'https://ows-demo.terrestris.de/geoserver/osm/wfs',
    featureTypes: ['osm:osm-country-borders'],
    featureNS: 'osm',
    maxFeatures: 3,
    attributeDetails: {
      'osm:osm-country-borders': {
        name: {
        type: 'string',
          exactSearch: false,
          matchCase: false
        }
      }
    }
  }), []);
  const wfsGetValue = useCallback(f => f.properties.name, []);

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

  return (
    <MapContext.Provider value={map}>

      <div className="example-block" style={{ margin: '10px' }}>
        <label>The NominatimSearch<br/>
          <SearchField
            searchFunction={nominatimSearchFunction}
            getValue={nominatimGetValue}
            getExtent={nominatimGetExtent}
            placeholder="Ortsname, Straßenname, Stadtteilname, POI usw."
          />
        </label>
      </div>

      <div className="example-block" style={{ margin: '10px' }}>
        <label>The WfsSearch<br/>
          <SearchField
            searchFunction={wfsSearchFunction}
            getValue={wfsGetValue}
            placeholder="Type a countryname in its own language…"
          />
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

<SearchFieldExample/>
```

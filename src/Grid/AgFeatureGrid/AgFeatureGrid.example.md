This example demonstrates the usage of the AgFeatureGrid:

```jsx
import AgFeatureGrid from '@terrestris/react-geo/dist/Grid/AgFeatureGrid/AgFeatureGrid';
import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

import federalStates from '../../../assets/federal-states-ger.json';

const format = new OlFormatGeoJSON();
const features = format.readFeatures(federalStates);

const AgFeatureGridExample = () => {

  const nameColumnRenderer = cellRendererParams => {
    const value = cellRendererParams.value;
    return <a target="_blank" href={`https://en.wikipedia.org/wiki/${value}`}>{value}</a>;
  };

  const mathRoundRenderer = cellRendererParams => {
    const value = cellRendererParams.value;
    return (
      <>
        {Math.round(value)}
      </>
    )
  };

  const map = new OlMap({
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

  const colDefs = [{
    cellRenderer: nameColumnRenderer,
    field: 'GEN',
    filter: true,
    headerName: 'Name',
    resizable: true,
    sortable: true
  }, {
    cellRenderer: mathRoundRenderer,
    field: 'SHAPE_LENG',
    filter: true,
    headerName: 'Length',
    resizable: true,
    sortable: true
  }, {
    cellRenderer: mathRoundRenderer,
    field: 'SHAPE_AREA',
    filter: true,
    headerName: 'Area',
    resizable: true,
    sortable: true
  }];

  return (
    <MapContext.Provider value={map}>
      <AgFeatureGrid
        attributeBlacklist={['gml_id', 'USE', 'RS', 'RS_ALT']}
        columnDefs={colDefs}
        features={features}
        selectable={true}
        zoomToExtent={true}
      />
      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />
    </MapContext.Provider>
  );
}

<AgFeatureGridExample />
```

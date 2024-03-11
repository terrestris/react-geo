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

const NameColumnRenderer = value => {
  return <a href={`https://en.wikipedia.org/wiki/${value}`}>{value}</a>;
};

const MathRoundRenderer = value => {
  return (
    <>
      {Math.round(value)}
    </>
  )
};

const AgFeatureGridExample = () => {

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

  return (
    <MapContext.Provider value={map}>
      <AgFeatureGrid
        features={features}
        map={this.map}
        attributeBlacklist={['gml_id', 'USE', 'RS', 'RS_ALT']}
        columnDefs={{
          GEN: {
            headerName: 'Name',
            cellRenderer: 'nameColumnRenderer',
            sortable: true,
            filter: true,
            resizable: true
          },
          SHAPE_LENG: {
            headerName: 'Length',
            cellRenderer: 'mathRoundRenderer',
            sortable: true,
            filter: true,
            resizable: true
          },
          SHAPE_AREA: {
            headerName: 'Area',
            cellRenderer: 'mathRoundRenderer',
            sortable: true,
            filter: true,
            resizable: true
          }
        }}
        zoomToExtent={true}
        selectable={true}
        frameworkComponents={{
          nameColumnRenderer: NameColumnRenderer,
          mathRoundRenderer: MathRoundRenderer
        }}
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

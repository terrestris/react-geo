In this example layers of a WMS can be added to a map.
The capabilities of this WMS are fetched and parsed to OL layer instances using the `CapabilitiesUtil`.
An `AddWmsPanel` shows a list of the parsed layers and each checked layer (or the entire set) can be added to the map.

```jsx
import { WmsLayer } from '@terrestris/ol-util';
import CapabilitiesUtil from '@terrestris/ol-util/dist/CapabilitiesUtil/CapabilitiesUtil';
import SimpleButton from '@terrestris/react-geo/dist/Button/SimpleButton/SimpleButton';
import AddWmsPanel from '@terrestris/react-geo/dist/Container/AddWmsPanel/AddWmsPanel';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import useMap from '@terrestris/react-util/dist/Hooks/useMap/useMap';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import {
  useEffect,
  useState
} from 'react';

// Please note: CORS headers must be set on server providing capabilities document. Otherwise proxy needed.
const CAPABILITIES_URL = 'https://ows.terrestris.de/osm/service?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities';

const AddWmsPanelExample = () => {

  const [map, setMap] = useState();
  const [wmsLayers, setWmsLayers] = useState();

  useEffect(() => {
    const olMap = new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOSM()
        })
      ],
      view: new OlView({
        center: fromLonLat([7.40570, 53.81566]),
        zoom: 4
      })
    });
    setMap(olMap);
  }, []);

  const onClick = async () => {
    try {
      const capabilities = await CapabilitiesUtil.getWmsCapabilities(CAPABILITIES_URL);
      const capaLayers = await CapabilitiesUtil.getLayersFromWmsCapabilities(capabilities);
      if (capaLayers) {
        setWmsLayers(capaLayers);
      }
    } catch (error) {
      alert('Could not extract layers from capabilities document.')
    }
  };

  if (!map) {
    return null;
  }

  return (
    <MapContext.Provider value={map}>
      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />
      <div>
        <SimpleButton
          onClick={onClick}
        >
          Fetch capabilities of OWS terrestris
        </SimpleButton>
        <AddWmsPanel
          wmsLayers={wmsLayers}
        />
      </div>
    </MapContext.Provider>
  );
};

<AddWmsPanelExample />
```

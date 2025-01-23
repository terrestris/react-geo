This example demonstrates the usage of the TimeLayerSliderPanel
(Data: IEM generated CONUS composite of NWS NEXRAD WSR-88D level III base reflectivity, Iowa State University)

```jsx
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import TimeLayerSliderPanel from '@terrestris/react-geo/dist/Panel/TimeLayerSliderPanel/TimeLayerSliderPanel';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import dayjs from 'dayjs';
import { getCenter } from 'ol/extent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { transformExtent } from 'ol/proj'
import OlSourceOSM from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import {
  useEffect,
  useMemo,
  useState
} from 'react';

const TimeLayerSliderPanelExample = () => {

  var extent = useMemo(() => transformExtent([-126, 24, -66, 50], 'EPSG:4326', 'EPSG:3857'), []);

  const [value, setValue] = useState();
  const [map, setMap] = useState();

  const timeLayer = useMemo(() => new OlLayerTile({
    extent: extent,
    type: 'WMSTime',
    timeFormat: 'YYYY-MM-DDTHH:mm',
    source: new OlSourceTileWMS({
      attributions: ['Iowa State University'],
      url: '//mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi',
      params: {LAYERS: 'nexrad-n0r-wmst'}
    })
  }), [extent]);

  useEffect(() => {
    const newMap = new OlMap({
      layers: [
        new OlLayerTile({
          properties: {
            name: 'OSM'
          },
          source: new OlSourceOSM()
        }),
        timeLayer
      ],
      view: new OlView({
        center: getCenter(extent),
        zoom: 4
      })
    });

    setMap(newMap);
  }, [extent, timeLayer]);

  const tooltips = {
    setToNow: 'Set to now',
    hours: 'Hours',
    minutes: 'Minutes',
    days: 'Days',
    weeks: 'Weeks',
    months: 'Months',
    years: 'Years',
    dataRange: 'Set data range'
  };

  const initStartDate = dayjs().subtract(3, 'hours');
  const initEndDate = dayjs();

  const onTimeChanged = (newTimeValue) => setValue(newTimeValue);

  useEffect(() => {
    setValue(dayjs().subtract(1, 'hours'))
  }, []);

  return (
    <div>
      <MapContext.Provider value={map}>
        <MapComponent
          map={map}
          style={{
            position: 'relative',
            height: '400px'
          }}
        />
        <TimeLayerSliderPanel
          autoPlaySpeedOptions={[0.5, 1, 2, 3, 5]}
          dateFormat='YYYY-MM-DD HH:mm'
          max={initEndDate}
          min={initStartDate}
          onChangeComplete={onTimeChanged}
          timeAwareLayers={[timeLayer]}
          tooltips={tooltips}
          value={value}
        />
      </MapContext.Provider>
    </div>
  );
}

<TimeLayerSliderPanelExample />
```

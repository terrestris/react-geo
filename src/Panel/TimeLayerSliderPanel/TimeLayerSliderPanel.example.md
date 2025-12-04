This example demonstrates the usage of the TimeLayerSliderPanel
(Data: IEM generated CONUS composite of NWS NEXRAD WSR-88D level III base reflectivity, Iowa State University)

```jsx
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import TimeLayerSliderPanel from '@terrestris/react-geo/dist/Panel/TimeLayerSliderPanel/TimeLayerSliderPanel';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import dayjs from 'dayjs';
import {getCenter} from 'ol/extent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import {transformExtent} from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import {
  useEffect,
  useMemo,
  useState
} from 'react';

const TimeLayerSliderPanelExample = () => {

  var extent = useMemo(() => [
    792437.4772329496,
    6527288.589210699,
    870547.0180349117,
    6561926.966506469
  ], []);

  const [value, setValue] = useState();
  const [valueExample2, setValueExample2] = useState();
  const [map, setMap] = useState();
  const [mapWithDuration, setMapWithDuration] = useState();

  const actualTime = dayjs();
  const actualTimeFloored = actualTime.minute() >= 30
    ? actualTime.add(1, 'hour').startOf('hour')
    : actualTime.startOf('hour');

  const timeLayer = useMemo(() => new OlLayerTile({
    extent: transformExtent([-126, 24, -66, 50], 'EPSG:4326', 'EPSG:3857'),
    type: 'WMSTime',
    timeFormat: 'YYYY-MM-DDTHH:mm',
    source: new OlSourceTileWMS({
      attributions: ['Iowa State University'],
      url: '//mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi',
      params: {LAYERS: 'nexrad-n0r-wmst'}
    })
  }), [extent]);

  const timeLayerDuration = useMemo(() => new OlLayerTile({
    extent: extent,
    type: 'WMSTime',
    timeFormat: 'ISO8601',
    duration: 'PT1H',
    startDate: actualTimeFloored.subtract(1, 'day').toISOString(),
    endDate: actualTimeFloored.add(1, 'day').toISOString(),
    source: new OlSourceTileWMS({
      url: 'https://maps.dwd.de/geoserver/wms',
      params: {LAYERS: 'dwd:Icon_reg025_fd_sl_T2M'}
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
        center: getCenter(transformExtent([-126, 24, -66, 50], 'EPSG:4326', 'EPSG:3857')),
        zoom: 4
      })
    });

    setMap(newMap);
  }, [extent, timeLayer]);

  useEffect(() => {
    const newMap = new OlMap({
      layers: [
        new OlLayerTile({
          properties: {
            name: 'OSM'
          },
          source: new OlSourceOSM()
        }),
        timeLayerDuration
      ],
      view: new OlView({
        center: getCenter(extent),
        zoom: 9
      })
    });

    setMapWithDuration(newMap);
  }, [extent, timeLayerDuration]);

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

  const initStartDate = dayjs('2006-06-23T03:10:00Z');
  const initEndDate = dayjs('2006-06-23T03:10:00Z').add(2, 'hours');

  const onTimeChanged = (newTimeValue) => setValue(newTimeValue);
  const onTimeChanged2 = (newTimeValue) => setValueExample2(newTimeValue);

  useEffect(() => {
    setValue(dayjs('2006-06-23T03:10:00Z').subtract(1, 'hours'))
  }, []);

  useEffect(() => {
    setValueExample2(actualTimeFloored)
  }, []);

  return (
    <div>
      <div>
        <h1>Example with predefined dateformat</h1>
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
            onChangeComplete={onTimeChanged}
            formatString='ISO8601'
            markFormatString="DD.MM.YYYY HH:mm"
            max={initEndDate}
            min={initStartDate}
            timeAwareLayers={[timeLayer]}
            tooltips={tooltips}
            value={value}
          />
        </MapContext.Provider>
      </div>
      <br/>
      <hr/>
      <br/>
      <h1>Example including duration</h1>
      <div>
        <MapContext.Provider value={mapWithDuration}>
          <MapComponent
            map={mapWithDuration}
            style={{
              position: 'relative',
              height: '400px'
            }}
          />
          <TimeLayerSliderPanel
            autoPlaySpeedOptions={[0.5, 1, 2, 3, 5]}
            markFormatString="DD.MM.YYYY HH:mm"
            maxNumberOfMarks={5}
            onChangeComplete={onTimeChanged2}
            timeAwareLayers={[timeLayerDuration]}
            value={valueExample2}
          />
        </MapContext.Provider>
      </div>
      <br/>
      <hr/>
      <br/>
      <h1>Example with default values for playback speed and time unit</h1>
      <div>
        <MapContext.Provider value={mapWithDuration}>
          <MapComponent
            map={mapWithDuration}
            style={{
              position: 'relative',
              height: '400px'
            }}
          />
          <TimeLayerSliderPanel
            autoPlaySpeedOptions={[0.5, 1, 2, 3, 5]}
            onChangeComplete={onTimeChanged}
            formatString='ISO8601'
            markFormatString="DD.MM.YYYY HH:mm"
            max={initEndDate}
            min={initStartDate}
            playbackSpeedDefaultUnit="minutes"
            playbackSpeedDefaultValue={3}
            timeAwareLayers={[timeLayer]}
            tooltips={tooltips}
            value={value}
          />
        </MapContext.Provider>
      </div>
    </div>
  );
}

<TimeLayerSliderPanelExample/>
```

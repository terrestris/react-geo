This example demonstrates the usage of the TimeLayerSliderPanel
(Data: IEM generated CONUS composite of NWS NEXRAD WSR-88D level III base reflectivity, Iowa State University)

```jsx
import TimeLayerSliderPanel from '@terrestris/react-geo/dist/Panel/TimeLayerSliderPanel/TimeLayerSliderPanel';
import moment from 'moment';
import { getCenter } from 'ol/extent';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { transformExtent } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import * as React from 'react';

class TimeLayerSliderPanelExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;
    var extent = transformExtent([-126, 24, -66, 50], 'EPSG:4326', 'EPSG:3857');
    this.layers = [
      new OlLayerTile({
        extent: extent,
        type: 'WMSTime',
        timeFormat: 'YYYY-MM-DDTHH:mm:ss.sssZ',
        roundToFullHours: true,
        source: new OlSourceTileWMS({
          attributions: ['Iowa State University'],
          url: '//mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi',
          params: {LAYERS: 'nexrad-n0r-wmst'}
        })
      })
    ];

    this.map = new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOSM()
        }),
        ...this.layers
      ],
      view: new OlView({
        center: getCenter(extent),
        zoom: 4
      })
    });
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    const tooltips = {
      setToNow: 'Set to now',
      hours: 'Hours',
      days: 'Days',
      weeks: 'Weeks',
      months: 'Months',
      years: 'Years',
      dataRange: 'Set data range'
    };

    return (
      <div>
        <div
          id={this.mapDivId}
          style={{
            height: '400px'
          }}
        />
        <TimeLayerSliderPanel
          initStartDate={moment().subtract(3, 'hours')}
          initEndDate={moment()}
          timeAwareLayers={this.layers}
          tooltips={tooltips}
          autoPlaySpeedOptions={[0.5, 1, 2, 3, 4, 5, 600]}
        />
      </div>
    );
  }
}

<TimeLayerSliderPanelExample />
```

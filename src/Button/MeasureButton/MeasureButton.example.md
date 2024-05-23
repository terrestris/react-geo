This demonstrates the use of MeasureButton with different measure types.

```jsx
import MeasureButton from '@terrestris/react-geo/dist/Button/MeasureButton/MeasureButton';
import ToggleGroup from '@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import React, { useEffect,useState } from 'react';

const MeasureButtonExample = () => {

  const [map, setMap] = useState();
  const [selected, setSelected] = useState();

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
  }, []);

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

      <span>Select a measure type:</span>

      <ToggleGroup
        selected={selected}
        onChange={(evt, value) => {
          setSelected(value)
        }}
      >
        <MeasureButton
          value="line"
          measureType="line"
        >
          Distance
        </MeasureButton>

        <MeasureButton
          value="steps"
          measureType="line"
          showMeasureInfoOnClickedPoints
        >
          Distance with step labels
        </MeasureButton>

        <MeasureButton
          value="multi"
          measureType="line"
          multipleDrawing
        >
          Distance with multiple drawing
        </MeasureButton>

        <MeasureButton
          value="poly"
          measureType="polygon"
        >
          Area (polygon)
        </MeasureButton>

        <MeasureButton
          value="circle"
          measureType="circle"
        >
          Area (circle)
        </MeasureButton>

        <MeasureButton
          value="angle"
          measureType="angle"
        >
          Angle
        </MeasureButton>
      </ToggleGroup>
    </MapContext.Provider>
  );
}

<MeasureButtonExample />
```

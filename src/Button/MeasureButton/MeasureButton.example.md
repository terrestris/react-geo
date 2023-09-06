This demonstrates the use of MeasureButton with different measure types.

```jsx
import MeasureButton from '@terrestris/react-geo/dist/Button/MeasureButton/MeasureButton';
import ToggleGroup from '@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
import MapComponent from '@terrestris/react-util/dist/Components/MapComponent/MapComponent';
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
          map={map}
          measureType="line"
        >
          Distance
        </MeasureButton>

        <MeasureButton
          value="steps"
          map={map}
          measureType="line"
          showMeasureInfoOnClickedPoints
        >
          Distance with step labels
        </MeasureButton>

        <MeasureButton
          value="multi"
          map={map}
          measureType="line"
          multipleDrawing
        >
          Distance with multiple drawing
        </MeasureButton>

        <MeasureButton
          value="poly"
          map={map}
          measureType="polygon"
        >
          Area
        </MeasureButton>

        <MeasureButton
          value="angle"
          map={map}
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

This demonstrates the use of the DrawButton.

```jsx
import DrawButton from '@terrestris/react-geo/dist/Button/DrawButton/DrawButton';
import ToggleGroup from '@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext'
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';
import { useEffect, useState } from 'react';

const DrawButtonExample = () => {

  const [selected, setSelected] = useState();
  const [map, setMap] = useState();

  useEffect(() => {
    setMap(new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOsm()
        })
      ],
      view: new OlView({
        center: fromLonLat([37.40570, 8.81566]),
        zoom: 4
      })
    }));
  }, [])

  if (!map) {
    return null;
  }

  return (
    <div>
      <MapContext.Provider value={map}>
        <MapComponent
          map={map}
          style={{
            height: '400px'
          }}
        />
        <div>
          <span>Select a digitize type:</span>
          <ToggleGroup
            selected={selected}
            onChange={(evt, value) => {
              setSelected(value)
            }}
            orientation="horizontal"
          >
            <DrawButton
              value="drawPoint"
              drawType="Point"
            >
              Draw point
            </DrawButton>

            <DrawButton
              value="drawLine"
              drawType="LineString"
            >
              Draw line
            </DrawButton>

            <DrawButton
              value="drawPolygon"
              drawType="Polygon"
            >
              Draw polygon
            </DrawButton>

            <DrawButton
              value="drawCircle"
              drawType="Circle"
            >
              Draw circle
            </DrawButton>

            <DrawButton
              value="drawRectangle"
              drawType="Rectangle"
            >
              Draw rectangle
            </DrawButton>

            <DrawButton
              value="drawText"
              drawType="Text"
            >
              Draw text label
            </DrawButton>
          </ToggleGroup>
        </div>
      </MapContext.Provider>
    </div>
  );
}

<DrawButtonExample />
```

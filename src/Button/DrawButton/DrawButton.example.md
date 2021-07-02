This demonstrates the use of the DrawButton.

```jsx
import { useEffect, useState } from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import MapContext from '@terrestris/react-geo/Context/MapContext/MapContext'
import DrawButton from '@terrestris/react-geo/Button/DrawButton/DrawButton';
import ToggleGroup from '@terrestris/react-geo/Button/ToggleGroup/ToggleGroup';
import MapComponent from '@terrestris/react-geo/Map/MapComponent/MapComponent';

const DrawButtonExample = () => {
    
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
          <ToggleGroup>
            <DrawButton
              name="drawPoint"
              drawType="Point"
            >
              Draw point
            </DrawButton>

            <DrawButton
              name="drawLine"
              drawType="LineString"
            >
              Draw line
            </DrawButton>

            <DrawButton
              name="drawPolygon"
              drawType="Polygon"
            >
              Draw polygon
            </DrawButton>

            <DrawButton
              name="drawCircle"
              drawType="Circle"
            >
              Draw circle
            </DrawButton>

            <DrawButton
              name="drawRectangle"
              drawType="Rectangle"
            >
              Draw rectangle
            </DrawButton>

            <DrawButton
              name="drawText"
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

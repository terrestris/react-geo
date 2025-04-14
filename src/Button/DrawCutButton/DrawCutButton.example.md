This demonstrates the use of the DrawCutButton.
  
```jsx
import { useEffect, useState } from 'react';

import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOsm from 'ol/source/OSM';
import OlView from 'ol/View';

import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext'
import { DigitizeUtil } from '@terrestris/react-util/dist/Util/DigitizeUtil';

import DrawButton from '@terrestris/react-geo/dist/Button/DrawButton/DrawButton';
import ToggleGroup from '@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup';
import { DrawCutButton } from '@terrestris/react-geo/dist/Button/DrawCutButton/DrawCutButton';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';

import federalStates from '../../../assets/federal-states-ger.json';

const format = new OlFormatGeoJSON();
const features = format.readFeatures(federalStates);

const DrawCutButtonExample = () => {
  const [map, setMap] = useState();
  const [selected, setSelected] = useState();

  useEffect(() => {
    const newMap = new OlMap({
      layers: [
        new OlLayerTile({
          name: 'OSM',
          source: new OlSourceOsm()
        })
      ],
      view: new OlView({
        center: fromLonLat([8, 50]),
        zoom: 4
      })
    });

    const digitizeLayer = DigitizeUtil.getDigitizeLayer(newMap);
    digitizeLayer.getSource().addFeatures(features);

    setMap(newMap);
  }, []);

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
        <ToggleGroup
          orientation="horizontal"
          selected={selected}
          onChange={(evt, value) => {
            setSelected(value)
          }}
        >
          <DrawCutButton
            value="drawCut"
            type="primary"
          >
            Cutout geometry
          </DrawCutButton>

          <DrawButton
            value="drawPoint"
            drawType="Point"
            type="default"
          >
            Draw point
          </DrawButton>

          <DrawButton
            value="drawLine"
            drawType="LineString"
            type="default"
          >
            Draw line
          </DrawButton>

          <DrawButton
            value="drawPolygon"
            drawType="Polygon"
            type="default"
          >
            Draw polygon
          </DrawButton>

          <DrawButton
            value="drawCircle"
            drawType="Circle"
            type="default"
          >
            Draw circle
          </DrawButton>

          <DrawButton
            value="drawRectangle"
            drawType="Rectangle"
            type="default"
          >
            Draw rectangle
          </DrawButton>

          <DrawButton
            value="drawText"
            drawType="Text"
            type="default"
          >
            Draw text label
          </DrawButton>
        </ToggleGroup>
      </MapContext.Provider>
    </div>
  );
}

<DrawCutButtonExample />
```

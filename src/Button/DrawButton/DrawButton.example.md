This demonstrates the use of the DrawButton.

```jsx
import * as React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import DrawButton from '@terrestris/react-geo/Button/DrawButton/DrawButton';
import ToggleGroup from '@terrestris/react-geo/Button/ToggleGroup/ToggleGroup';

class DigitizeButtonExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.map = new OlMap({
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
    });
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    return(
      <div>
        <div
          id={this.mapDivId}
          style={{
            height: '400px'
          }}
        />

        <div>
          <span>Select a digitize type:</span>
          <ToggleGroup>
            <DrawButton
              name="drawPoint"
              map={this.map}
              drawType="Point"
            >
            Draw point
            </DrawButton>

            <DrawButton
              name="drawLine"
              map={this.map}
              drawType="LineString"
            >
            Draw line
            </DrawButton>

            <DrawButton
              name="drawPolygon"
              map={this.map}
              drawType="Polygon"
            >
            Draw polygon
            </DrawButton>

            <DrawButton
              name="drawCircle"
              map={this.map}
              drawType="Circle"
            >
            Draw circle
            </DrawButton>

            <DrawButton
              name="drawRectangle"
              map={this.map}
              drawType="Rectangle"
            >
            Draw rectangle
            </DrawButton>

            <DrawButton
              name="drawText"
              map={this.map}
              drawType="Text"
            >
            Draw text label
            </DrawButton>
          </ToggleGroup>
        </div>
      </div>
    );
  }
}

<DigitizeButtonExample />
```

This demonstrates the use of DigitizeButton with different interactions.

```jsx
import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import DigitizeButton from '@terrestris/react-geo/Button/DigitizeButton/DigitizeButton';
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
            <DigitizeButton
              name="drawPoint"
              map={this.map}
              drawType="Point"
            >
            Draw point
            </DigitizeButton>

            <DigitizeButton
              name="drawLine"
              map={this.map}
              drawType="LineString"
            >
            Draw line
            </DigitizeButton>

            <DigitizeButton
              name="drawPolygon"
              map={this.map}
              drawType="Polygon"
            >
            Draw polygon
            </DigitizeButton>

            <DigitizeButton
              name="drawCircle"
              map={this.map}
              drawType="Circle"
            >
            Draw circle
            </DigitizeButton>

            <DigitizeButton
              name="drawRectangle"
              map={this.map}
              drawType="Rectangle"
            >
            Draw rectangle
            </DigitizeButton>

            <DigitizeButton
              name="drawText"
              map={this.map}
              drawType="Text"
            >
            Draw text label
            </DigitizeButton>

            <DigitizeButton
              name="selectAndModify"
              map={this.map}
              editType="Edit"
            >
            Select and modify features
            </DigitizeButton>

            <DigitizeButton
              name="copyFeature"
              map={this.map}
              editType="Copy"
            >
            Copy features
            </DigitizeButton>

            <DigitizeButton
              name="deleteFeature"
              map={this.map}
              editType="Delete"
            >
            Delete features
            </DigitizeButton>

          </ToggleGroup>
        </div>
      </div>
    );
  }
}

<DigitizeButtonExample />
```

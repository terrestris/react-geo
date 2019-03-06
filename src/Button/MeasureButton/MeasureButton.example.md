This demonstrates the use of MeasureButton with different measure types.

```jsx
import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import MeasureButton from '@terrestris/react-geo/Button/MeasureButton/MeasureButton';
import ToggleGroup from '@terrestris/react-geo/Button/ToggleGroup/ToggleGroup';

class MeasureButtonExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.map = new OlMap({
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
    });
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    return (
      <div>
        <div
          id={this.mapDivId}
          style={{
            height: '400px'
          }}
        />

        <div>
          <span>Select a measure type:</span>
          <ToggleGroup>
            <MeasureButton
              name="line"
              map={this.map}
              measureType="line"
            >
            Distance
            </MeasureButton>

            <MeasureButton
              name="steps"
              map={this.map}
              measureType="line"
              showMeasureInfoOnClickedPoints
            >
            Distance with step labels
            </MeasureButton>

            <MeasureButton
              name="multi"
              map={this.map}
              measureType="line"
              multipleDrawing
            >
            Distance with multiple drawing
            </MeasureButton>

            <MeasureButton
              name="poly"
              map={this.map}
              measureType="polygon"
            >
            Area
            </MeasureButton>

            <MeasureButton
              name="angle"
              map={this.map}
              measureType="angle"
            >
            Angle
            </MeasureButton>
          </ToggleGroup>
        </div>
      </div>
    );
  }
}

<MeasureButtonExample />
```

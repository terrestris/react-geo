This demonstrates the use of MeasureButton with different measure types.

```jsx
const React = require('react');
const OlMap = require('ol/Map').default;
const OlView = require('ol/View').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlSourceOsm = require('ol/source/OSM').default;
const OlProj = require('ol/proj').default;

const {
  MeasureButton,
  ToggleGroup
} = require('../../index');

class MeasureButtonExample extends React.Component {

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
        center: OlProj.fromLonLat([37.40570, 8.81566]),
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
This example demonstrates the usage of the AgFeatureGrid:

```jsx
const React = require('react');
const PropTypes = require('prop-types');
const OlMap = require('ol/Map').default;
const OlView = require('ol/View').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlSourceOsm = require('ol/source/OSM').default;
const OlProj = require('ol/proj').default;
const OlFormatGeoJson = require('ol/format/GeoJSON').default;

const federalStates = require('../../../assets/federal-states-ger.json');

const format = new OlFormatGeoJson();
const features = format.readFeatures(federalStates);

class NameColumnRenderer extends React.Component {
  render() {
    const {
      value
    } = this.props;
    return <a href={`https://en.wikipedia.org/wiki/${value}`}>{value}</a>;
  }
}

NameColumnRenderer.propTypes = {
  value: PropTypes.any
};

class MathRoundRenderer extends React.Component {
  render() {
    const {
      value
    } = this.props;
    return Math.round(value);
  }
}

MathRoundRenderer.propTypes = {
  value: PropTypes.any
};

class AgFeatureGridExample extends React.Component {

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
    return(
      <div>
        <AgFeatureGrid
          features={features}
          map={this.map}
          enableSorting={true}
          enableFilter={true}
          enableColResize={true}
          attributeBlacklist={['gml_id', 'USE', 'RS', 'RS_ALT']}
          columnDefs={{
            'GEN': {
              headerName: 'Name',
              cellRenderer: 'nameColumnRenderer'
            },
            'SHAPE_LENG': {
              headerName: 'Length',
              cellRenderer: 'mathRoundRenderer'
            },
            'SHAPE_AREA': {
              headerName: 'Area',
              cellRenderer: 'mathRoundRenderer'
            }
          }}
          zoomToExtent={true}
          selectable={true}
          frameworkComponents={{
            nameColumnRenderer: NameColumnRenderer,
            mathRoundRenderer: MathRoundRenderer
          }}
        />
        <div
          id={this.mapDivId}
          style={{
            height: '400px'
          }}
        />
      </div>
    )
  }
}

<AgFeatureGridExample />
```

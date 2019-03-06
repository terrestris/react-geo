This example demonstrates the usage of the AgFeatureGrid:

```jsx
import React from 'react';

import PropTypes from 'prop-types';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';

import AgFeatureGrid from '@terrestris/react-geo/Grid/AgFeatureGrid/AgFeatureGrid';

import federalStates from '../../../assets/federal-states-ger.json';

const format = new OlFormatGeoJSON();
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
    return(
      <div>
        <AgFeatureGrid
          features={features}
          map={this.map}
          attributeBlacklist={['gml_id', 'USE', 'RS', 'RS_ALT']}
          columnDefs={{
            'GEN': {
              headerName: 'Name',
              cellRenderer: 'nameColumnRenderer',
              sortable: true,
              filter: true,
              resizable: true
            },
            'SHAPE_LENG': {
              headerName: 'Length',
              cellRenderer: 'mathRoundRenderer',
              sortable: true,
              filter: true,
              resizable: true
            },
            'SHAPE_AREA': {
              headerName: 'Area',
              cellRenderer: 'mathRoundRenderer',
              sortable: true,
              filter: true,
              resizable: true
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

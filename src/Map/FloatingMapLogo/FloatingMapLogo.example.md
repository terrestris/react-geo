This is a example containing a map component and a floating map logo

```jsx
const React = require('react');
const OlSourceOsm = require('ol/source/OSM').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlView = require('ol/View').default;
const OlMap = require('ol/Map').default;

const logo = require('../../../assets/user.png');

class FloatingMapLogoExample extends React.Component {

  constructor(props) {

    super(props);

    this.mapDivId = `map-${Math.random()}`;

    this.map = new OlMap({
      view: new OlView({
        center: [801045, 6577113],
        zoom: 9
      }),
      layers: [
        new OlLayerTile({
          source: new OlSourceOsm()
        })
      ]
    });
  }

  componentDidMount() {
    this.map.setTarget(this.mapDivId);
  }

  render() {
    return(
      <div
        id={this.mapDivId}
        style={{
          position: 'relative',
          height: '200px'
        }}
      >
        <FloatingMapLogo
          imageSrc={logo}
        />
      </div>
    )
  }
}

<FloatingMapLogoExample />
```
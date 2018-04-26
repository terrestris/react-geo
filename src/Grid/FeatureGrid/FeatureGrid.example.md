This example demonstrates the usage of the FeatureGrid:

```jsx
const React = require('react');
const OlMap = require('ol/Map').default;
const OlView = require('ol/View').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlSourceOsm = require('ol/source/OSM').default;
const OlProj = require('ol/proj').default;
const OlFormatGeoJson = require('ol/format/GeoJSON').default;

const federalStates = require('../../../assets/federal-states-ger.json');

const format = new OlFormatGeoJson();
const features = format.readFeatures(federalStates);

const nameColumnRenderer = val => <a href={`https://en.wikipedia.org/wiki/${val}`}>{val}</a>;

class FeatureGridExample extends React.Component {

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
        <FeatureGrid
          features={features}
          map={this.map}
          zoomToExtent={true}
          selectable={true}
          attributeBlacklist={['gml_id', 'USE', 'RS', 'RS_ALT']}
          columnDefs={{
            'GEN': {
              title: 'Name',
              render: nameColumnRenderer,
              sorter: (a, b) => {
                const nameA = a.GEN.toUpperCase();
                const nameB = b.GEN.toUpperCase();
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }

                return 0;
              },
              defaultSortOrder: 'ascend'
            },
            'SHAPE_LENG': {
              title: 'Length',
              render: val => Math.round(val)
            },
            'SHAPE_AREA': {
              title: 'Area',
              render: val => Math.round(val)
            }
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

<FeatureGridExample />
```

An example with a remote feature source.

```jsx
const React = require('react');
const PropTypes = require('prop-types');
const OlMap = require('ol/Map').default;
const OlView = require('ol/View').default;
const OlLayerTile = require('ol/layer/Tile').default;
const OlSourceOsm = require('ol/source/OSM').default;
const OlProj = require('ol/proj').default;
const OlFormatGeoJson = require('ol/format/GeoJSON').default;
const OlStyle = require('ol/style/Style').default;
const OlStyleIcon = require('ol/style/Icon').default;
const OlStyleText = require('ol/style/Text').default;
const OlStyleFill = require('ol/style/Fill').default;
const OlStyleStroke = require('ol/style/Stroke').default;
const {
  Input
} = require('antd');

const {
  UrlUtil
} = require('../../index.js');

// Credits to Maps Icons Collection https://mapicons.mapsmarker.com.
const mapMarker = require('../../../assets/bus-map-marker.png');

class RemoteFeatureGrid extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      features: [],
      pagination: {
        pageSize: 10,
        current: 1
      },
      sorter: {
        field: 'name',
        order: 'ascend'
      },
      nameFilterText: '',
      filterDropdownVisible: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const {
      url
    } = this.props;

    const {
      pagination,
      sorter,
      nameFilterText
    } = this.state;

    const format = new OlFormatGeoJson();

    this.setState({
      loading: true
    });

    const queryParams = {
      SERVICE: 'WFS',
      VERSION: '1.1.0',
      REQUEST: 'GetFeature',
      TYPENAME: 'osm:osm-busstops',
      MAXFEATURES: pagination.pageSize,
      STARTINDEX: (pagination.current - 1) * pagination.pageSize,
      OUTPUTFORMAT: 'application/json',
      CQL_FILTER: 'BBOX(geometry, 814276,6697003,846762,6727578)'
    };

    const sortDir = sorter.order === 'ascend' ? ' A' : ' D';
    if (sorter.field) {
      queryParams.SORTBY = `${sorter.field}${sortDir}`;
    }

    if (nameFilterText) {
      queryParams.CQL_FILTER += ` AND name like '%${nameFilterText}%'`;
    }

    const query = UrlUtil.objectToRequestString(queryParams);

    fetch(`${url}?${query}`)
      .then(response => response.json())
      .then(response => {
        this.setState({
          loading: false
        });

        const features = format.readFeatures(response);

        if (features.length === 0) {
          alert('No matches found!');
          this.setState({
            nameFilterText: ''
          });
          return;
        }

        this.setState({
          features: features,
          pagination: {
            ...pagination,
            total: response.totalFeatures
          }
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
        alert('Could not fetch data!');
      });
  }

  onTableChange(pagination, filters, sorter) {
    this.setState({
      sorter: {
        ...this.state.sorter,
        ...sorter
      },
      pagination: {
        ...this.state.pagination,
        current: pagination.current
      },
    }, () => this.fetchData());
  }

  onNameFilterTextChange(evt) {
    this.setState({
      nameFilterText: evt.target.value
    });
  }

  onNameFilterSearch() {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: 1
      },
      filterDropdownVisible: false
    }, () => this.fetchData());
  }

  getFeatureStyle(feature, color) {
    return new OlStyle({
      image: new OlStyleIcon(({
        anchor: [0.5, 1.1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: mapMarker,
        color: color
      })),
      text: new OlStyleText({
        text: feature ? feature.get('name') : '',
        fill: new OlStyleFill({
          color: 'rgb(0, 0, 0)'
        }),
        stroke: new OlStyleStroke({
          color: 'rgb(255, 255, 255)',
          width: 2
        })
      })
    });
  }

  render() {
    const {
      map
    } = this.props;

    const {
      loading,
      features,
      pagination,
      nameFilterText,
      filterDropdownVisible,
    } = this.state;

    const getFeatureStyle = this.getFeatureStyle;

    return (
      <FeatureGrid
        features={features}
        map={map}
        loading={loading}
        zoomToExtent={true}
        selectable={true}
        pagination={pagination}
        featureStyle={function(feature) {
          return getFeatureStyle(feature);
        }}
        highlightStyle={function(/*resolution*/) {
          return getFeatureStyle(this, 'rgb(230, 247, 255)');
        }}
        selectStyle={function(/*resolution*/) {
          return getFeatureStyle(this, 'rgb(24, 144, 255)');
        }}
        onChange={this.onTableChange.bind(this)}
        columnDefs={{
          'name': {
            sorter: true,
            filterDropdown: (
              <div style={{
                padding: '8px',
                borderRadius: '6px',
                background: '#fff',
                boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'
              }}>
                <Input
                  ref={el => this.searchInput = el}
                  placeholder="Search name"
                  value={nameFilterText}
                  onChange={this.onNameFilterTextChange.bind(this)}
                  onPressEnter={this.onNameFilterSearch.bind(this)}
                />
              </div>
            ),
            filterDropdownVisible: filterDropdownVisible,
            onFilterDropdownVisibleChange: visible => {
              this.setState({
                filterDropdownVisible: visible
              }, () => {
                this.searchInput.focus();
              });
            }
          }
        }}
      />
    );
  }
}

RemoteFeatureGrid.propTypes = {
  map: PropTypes.instanceOf(OlMap),
  url: PropTypes.string
};

class RemoteFeatureGridExample extends React.Component {

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
        <RemoteFeatureGrid
          map={this.map}
          url='https://ows.terrestris.de/geoserver/osm/wfs'
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

<RemoteFeatureGridExample />
```
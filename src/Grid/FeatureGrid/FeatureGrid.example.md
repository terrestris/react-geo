This example demonstrates the usage of the FeatureGrid:

```jsx
import FeatureGrid from '@terrestris/react-geo/dist/Grid/FeatureGrid/FeatureGrid';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlView from 'ol/View';
import * as React from 'react';

import federalStates from '../../../assets/federal-states-ger.json';

const format = new OlFormatGeoJSON();
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
        <FeatureGrid
          features={features}
          map={this.map}
          zoomToExtent={true}
          selectable={true}
          attributeBlacklist={['gml_id', 'USE', 'RS', 'RS_ALT']}
          columnDefs={{
            GEN: {
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
            SHAPE_LENG: {
              title: 'Length',
              render: val => Math.round(val)
            },
            SHAPE_AREA: {
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
    );
  }
}

<FeatureGridExample />
```

An example with a remote feature source.

```jsx
import UrlUtil from '@terrestris/base-util/dist/UrlUtil/UrlUtil';
import FeatureGrid from '@terrestris/react-geo/dist/Grid/FeatureGrid/FeatureGrid';
import Input from 'antd/lib/input';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OlSourceOSM from 'ol/source/OSM';
import OlStyleFill from 'ol/style/Fill';
import OlStyleIcon from 'ol/style/Icon';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyle from 'ol/style/Style';
import OlStyleText from 'ol/style/Text';
import OlView from 'ol/View';
import * as PropTypes from 'prop-types';
import * as React from 'react';

// Credits to Maps Icons Collection https://mapicons.mapsmarker.com.
import mapMarker from '../../../assets/bus-map-marker.png';

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
      filterDropdownOpen: false
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

    const format = new OlFormatGeoJSON();

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
      CQL_FILTER: 'BBOX(the_geom, 342395,6206125,352395,6216125)'
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
      filterDropdownOpen: false
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
      filterDropdownOpen,
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
        highlightStyle={function(feature) {
          return getFeatureStyle(feature, 'rgb(230, 247, 255)');
        }}
        selectStyle={function(feature) {
          return getFeatureStyle(feature, 'rgb(24, 144, 255)');
        }}
        onChange={this.onTableChange.bind(this)}
        columnDefs={{
          name: {
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
            filterDropdownOpen: filterDropdownOpen,
            onFilterDropdownOpenChange: visible => {
              this.setState({
                filterDropdownOpen: visible
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
        <RemoteFeatureGrid
          map={this.map}
          url='https://ows-demo.terrestris.de/geoserver/osm/wfs'
        />
        <div
          id={this.mapDivId}
          style={{
            height: '400px'
          }}
        />
      </div>
    );
  }
}

<RemoteFeatureGridExample />
```

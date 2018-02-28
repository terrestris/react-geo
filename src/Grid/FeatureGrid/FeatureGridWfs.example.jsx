/* eslint-disable require-jsdoc */
import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlLayerTile from 'ol/layer/tile';
import OlSourceOsm from 'ol/source/osm';
import OlProj from 'ol/proj';
import OlFormatGeoJson from 'ol/format/geojson';
import OlStyle from 'ol/style/style';
import OlStyleIcon from 'ol/style/icon';
import OlStyleText from 'ol/style/text';
import OlStyleFill from 'ol/style/fill';
import OlStyleStroke from 'ol/style/stroke';
import {
  Input,
  message
} from 'antd';

import {
  FeatureGrid,
  UrlUtil
} from '../../index.js';

// Credits to Maps Icons Collection https://mapicons.mapsmarker.com.
import mapMarker from '../../../assets/bus-map-marker.png';

class RemoteFeatureGrid extends React.Component {

  static propTypes = {
    map: PropTypes.instanceOf(OlMap),
    url: PropTypes.string
  }

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

  fetchData = () => {
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
          message.warning('No matches found!');
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
        message.error('Could not fetch data from remote source!');
      });
  }

  onTableChange = (pagination, filters, sorter) => {
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

  onNameFilterTextChange = evt => {
    this.setState({
      nameFilterText: evt.target.value
    });
  }

  onNameFilterSearch = () => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: 1
      },
      filterDropdownVisible: false
    }, () => this.fetchData());
  }

  getFeatureStyle = (feature, color) => {
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
        featureStyle={function(/*resolution*/) {
          return getFeatureStyle(this);
        }}
        highlightStyle={function(/*resolution*/) {
          return getFeatureStyle(this, 'rgb(230, 247, 255)');
        }}
        selectStyle={function(/*resolution*/) {
          return getFeatureStyle(this, 'rgb(24, 144, 255)');
        }}
        onChange={this.onTableChange}
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
                  onChange={this.onNameFilterTextChange}
                  onPressEnter={this.onNameFilterSearch}
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

const map = new OlMap({
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

render(
  <div>
    <div
      className="example-block"
    >
      <RemoteFeatureGrid
        map={map}
        url='https://ows.terrestris.de/geoserver/osm/wfs'
      />
    </div>
    <div
      id="map"
      style={{
        height: '400px'
      }}
    />
  </div>,

  // Target
  document.getElementById('exampleContainer'),

  // Callback
  () => {
    map.setTarget('map');
  }
);

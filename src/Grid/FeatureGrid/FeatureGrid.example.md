This example demonstrates the usage of the FeatureGrid:

```jsx
import FeatureGrid from '@terrestris/react-geo/dist/Grid/FeatureGrid/FeatureGrid';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
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

const FeatureGridExample = () => {
  const map = new OlMap({
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

  return (
    <MapContext.Provider value={map}>
      <FeatureGrid
        features={features}
        zoomToExtent={true}
        selectable={true}
        attributeBlacklist={['gml_id', 'USE', 'RS', 'RS_ALT']}
        columns={[{
          dataIndex: 'GEN',
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
        }, {
          dataIndex: 'SHAPE_LENG',
          title: 'Length',
          render: val => Math.round(val)
        }, {
          dataIndex: 'SHAPE_AREA',
          title: 'Area',
          render: val => Math.round(val)
        }]}
      />
      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />
    </MapContext.Provider>
  );
}

<FeatureGridExample />
```

An example with a remote feature source.

```jsx
import UrlUtil from '@terrestris/base-util/dist/UrlUtil/UrlUtil';
import FeatureGrid from '@terrestris/react-geo/dist/Grid/FeatureGrid/FeatureGrid';
import MapComponent from '@terrestris/react-geo/dist/Map/MapComponent/MapComponent';
import MapContext from '@terrestris/react-util/dist/Context/MapContext/MapContext';
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
import React, {
  useCallback,
  useEffect,
  useRef,
  useState} from 'react';

// Credits to Maps Icons Collection https://mapicons.mapsmarker.com.
import mapMarker from '../../../assets/bus-map-marker.png';

const RemoteFeatureGrid = ({
  url
}) => {

  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFeatures, setTotalFeatures] = useState();
  const [sorter, setSorter] = useState({
    field: 'name',
    order: 'ascend'
  });
  const [nameFilterText, setNameFilterText] = useState();
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const searchInput = useRef();

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const queryParams = {
        SERVICE: 'WFS',
        VERSION: '1.1.0',
        REQUEST: 'GetFeature',
        TYPENAME: 'osm:osm-busstops',
        MAXFEATURES: pageSize,
        STARTINDEX: (currentPage - 1) * pageSize,
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

      const response = await fetch(`${url}?${query}`);

      if (!response.ok) {
        throw new Error('No successful response while requesting the features');
      }

      const responseJson = await response.json();

      const format = new OlFormatGeoJSON();

      const feats = format.readFeatures(responseJson);

      if (feats.length === 0) {
        alert('No features found!');
        setNameFilterText('')
        return;
      }

      setFeatures(feats);

      setTotalFeatures(responseJson.totalFeatures);
    } catch (error) {
      logger.error(error);
      alert('Could not fetch data!');
    } finally {
      setLoading(false);
    }
  }, [url, currentPage, pageSize, sorter, nameFilterText]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (searchInput.current && filterDropdownOpen) {
      window.setTimeout(() => {
        searchInput.current.focus();
      }, 100)
    }
  }, [filterDropdownOpen]);

  const onTableChange = (page, filters, sort) => {
    setSorter({
      field: sort.field,
      order: sort.order
    });

    setCurrentPage(page.current);
    setPageSize(page.pageSize);
  };

  const onNameFilterSearch = (evt) => {
    setCurrentPage(1);
    setFilterDropdownOpen(false);
    setNameFilterText(evt.target.value);
  };

  const onFilterDropdownOpenChange = (visible) => {
    setFilterDropdownOpen(visible);
  };

  const getFeatureStyle = (feature, color) => {
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

  return (
    <FeatureGrid
      features={features}
      map={map}
      loading={loading}
      zoomToExtent={true}
      selectable={true}
      pagination={{
        pageSize: pageSize,
        current: currentPage,
        total: totalFeatures,
        showTotal: a => `Total: ${a}`
      }}
      featureStyle={feat => getFeatureStyle(feat)}
      highlightStyle={feat => getFeatureStyle(feat, 'rgb(230, 247, 255)')}
      selectStyle={feat => getFeatureStyle(feature, 'rgb(24, 144, 255)')}
      onChange={onTableChange}
      columns={[{
        dataIndex: 'name',
        sorter: true,
        sortOrder: sorter.order,
        filterDropdown: (
          <div style={{
            padding: '8px',
            borderRadius: '6px',
            background: '#fff',
            boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'
          }}>
            <Input
              ref={searchInput}
              placeholder="Search name"
              onPressEnter={onNameFilterSearch}
            />
          </div>
        ),
        filterDropdownOpen: filterDropdownOpen,
        onFilterDropdownOpenChange: onFilterDropdownOpenChange
      }]}
    />
  );
}

const RemoteFeatureGridExample = () => {

  const map = new OlMap({
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

  return (
    <MapContext.Provider value={map}>
      <RemoteFeatureGrid
        url='https://ows-demo.terrestris.de/geoserver/osm/wfs'
      />
      <MapComponent
        map={map}
        style={{
          height: '400px'
        }}
      />
    </MapContext.Provider>
  );
}

<RemoteFeatureGridExample />
```

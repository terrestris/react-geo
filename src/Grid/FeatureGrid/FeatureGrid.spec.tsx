import {MapBrowserEvent} from 'ol';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import OlGeomGeometryCollection from 'ol/geom/GeometryCollection';
import OlLayerVector from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import OlSourceVector from 'ol/source/Vector';
import {
  act
} from 'react-dom/test-utils';

import TestUtil from '../../Util/TestUtil';
import FeatureGrid from './FeatureGrid';

describe('<FeatureGrid />', () => {
  let map: OlMap;
  let features: OlFeature[];

  beforeEach(() => {
    map = TestUtil.createMap();
    features = [
      {id: 1, name: 'Shinji Kagawa'},
      {id: 2, name: 'Marco Reus'},
      {id: 3, name: 'Roman Weidenfeller'}
    ].map((prop) => TestUtil.generatePointFeature(prop));

  });

  afterEach(() => {
    TestUtil.removeMap(map);
    features = [];
  });

  it('is defined', () => {
    expect(FeatureGrid).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid);
    expect(wrapper).not.toBeUndefined();
  });

  it('initializes a vector layer on mount (if map prop is given)', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map});

    const layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === wrapper.prop('layerName'));

    expect(layerCand).toHaveLength(1);
    expect(layerCand[0]).toBeInstanceOf(OlLayerVector);
    expect((wrapper.instance() as FeatureGrid)._source).toBeInstanceOf(OlSourceVector);
    expect((wrapper.instance() as FeatureGrid)._layer).toBeInstanceOf(OlLayerVector);

    const wrapperWithoutMap = TestUtil.mountComponent(FeatureGrid);

    expect((wrapperWithoutMap.instance() as FeatureGrid)._source).toBeNull();
    expect((wrapperWithoutMap.instance() as FeatureGrid)._layer).toBeNull();
  });

  it('initializes a vector layer if it\'s not already added to the map only', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map});

    (wrapper.instance() as FeatureGrid).initVectorLayer(map);

    const layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === wrapper.prop('layerName'));

    expect(layerCand).toHaveLength(1);
    expect(layerCand[0]).toBeInstanceOf(OlLayerVector);
    expect((wrapper.instance() as FeatureGrid)._source).toBeInstanceOf(OlSourceVector);
    expect((wrapper.instance() as FeatureGrid)._layer).toBeInstanceOf(OlLayerVector);
  });

  it('sets the given featureStyle to the featurelayer', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});
    expect((wrapper.instance() as FeatureGrid)._layer?.getStyle()).toEqual(wrapper.prop('featureStyle'));
  });

  it('removes the vector layer from the map on unmount', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map});

    const layerName = wrapper.prop('layerName');

    wrapper.unmount();

    const layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === layerName);

    expect(layerCand).toHaveLength(0);
  });

  it('registers a pointermove and singleclick map event handler on mount', () => {
    const mapOnSpy = jest.spyOn(map, 'on');

    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, selectable: true});

    const onPointerMove = (wrapper.instance() as FeatureGrid).onMapPointerMove;
    const onMapSingleClick = (wrapper.instance() as FeatureGrid).onMapSingleClick;

    expect(mapOnSpy).toHaveBeenCalledTimes(2);
    expect(mapOnSpy).toHaveBeenCalledWith('pointermove', onPointerMove);
    expect(mapOnSpy).toHaveBeenCalledWith('singleclick', onMapSingleClick);

    mapOnSpy.mockRestore();
  });

  it('unregisters a pointermove and singleclick map event handler on unmount', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, selectable: true});

    const mapUnSpy = jest.spyOn(map, 'un');
    const onPointerMove = (wrapper.instance() as FeatureGrid).onMapPointerMove;
    const onMapSingleClick = (wrapper.instance() as FeatureGrid).onMapSingleClick;

    wrapper.unmount();

    expect(mapUnSpy).toHaveBeenCalledTimes(2);
    expect(mapUnSpy).toHaveBeenCalledWith('pointermove', onPointerMove);
    expect(mapUnSpy).toHaveBeenCalledWith('singleclick', onMapSingleClick);

    mapUnSpy.mockRestore();
  });

  it('generates the column definition out of the given features and takes attributeBlacklist into account', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    const got = (wrapper.instance() as FeatureGrid).getColumnDefs();

    const exp = [{
      dataIndex: 'id',
      key: 'id',
      title: 'id'
    }, {
      dataIndex: 'name',
      key: 'name',
      title: 'name'
    }];

    expect(got).toEqual(exp);

    wrapper.setProps({
      attributeBlacklist: ['id']
    });

    const gotBlacklisted = (wrapper.instance() as FeatureGrid).getColumnDefs();

    const expBlacklisted = [{
      dataIndex: 'name',
      key: 'name',
      title: 'name'
    }];

    expect(gotBlacklisted).toEqual(expBlacklisted);
  });

  it('generates the appropriate data to render', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    const got = (wrapper.instance() as FeatureGrid).getTableData();

    const expRows = [{
      id: 1,
      name: 'Shinji Kagawa'
    }, {
      id: 2,
      name: 'Marco Reus'
    }, {
      id: 3,
      name: 'Roman Weidenfeller'
    }];

    expRows.forEach((row, idx) => {
      expect(row.id).toEqual(got[idx].id);
      expect(row.name).toEqual(got[idx].name);
    });
  });

  it('fits the map to show all given features', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    const mapViewFitSpy = jest.spyOn(map.getView(), 'fit');

    (wrapper.instance() as FeatureGrid).zoomToFeatures(features);

    const featGeometries: OlGeometry[] = [];
    features.forEach(feature => {
      if (feature.getGeometry()) {
        featGeometries.push(feature.getGeometry()!);
      }
    });

    expect(mapViewFitSpy).toHaveBeenCalledWith(new OlGeomGeometryCollection(featGeometries).getExtent());
  });

  it('highlights all given features', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    (wrapper.instance() as FeatureGrid).highlightFeatures(features);

    features.forEach(feature => {
      expect(feature.getStyle()).toEqual(wrapper.prop('highlightStyle'));
    });
  });

  it('unhighlight all given features, but takes selection into account', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});
    // @ts-ignore
    const selectedFeatureUid = features[0].ol_uid;

    act(() => {
      wrapper.setState({selectedRowKeys: [selectedFeatureUid]});
    });
    act(() => {
      (wrapper.instance() as FeatureGrid).unhighlightFeatures(features);
    });

    features.forEach(feature => {
      // @ts-ignore
      if (feature.ol_uid === selectedFeatureUid) {
        expect(feature.getStyle()).toEqual(wrapper.prop('selectStyle'));
      } else {
        expect(feature.getStyle()).toBe(undefined);
      }
    });
  });

  it('selects all given features', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    (wrapper.instance() as FeatureGrid).selectFeatures(features);

    features.forEach(feature => {
      expect(feature.getStyle()).toEqual(wrapper.prop('selectStyle'));
    });
  });

  it('resets all given features to default feature style', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    (wrapper.instance() as FeatureGrid).resetFeatureStyles();

    features.forEach(feature => {
      expect(feature.getStyle()).toBe(undefined);
    });
  });

  it('sets the appropriate select style to a feature if selection in grid changes', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});
    // @ts-ignore
    const selectedRowKeys = [features[0].ol_uid, features[1].ol_uid];

    act(() => {
      (wrapper.instance() as FeatureGrid).onSelectChange(selectedRowKeys);
    });

    features.forEach(feature => {
      // @ts-ignore
      if (selectedRowKeys.includes(feature.ol_uid)) {
        expect(feature.getStyle()).toEqual(wrapper.prop('selectStyle'));
      } else {
        expect(feature.getStyle()).toBe(undefined);
      }
    });

    expect(wrapper.state('selectedRowKeys')).toEqual(selectedRowKeys);
  });

  it('returns the feature for a given row key', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});
    // @ts-ignore
    const rowKey = features[1].ol_uid;

    expect((wrapper.instance() as FeatureGrid).getFeatureFromRowKey(rowKey)).toEqual(features[1]);
  });

  it('selects the feature on row click', () => {
    const onRowClickSpy = jest.fn();
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features, onRowClick: onRowClickSpy});
    const clickedRow = {
      // @ts-ignore
      key: features[0].ol_uid
    };
    const zoomToFeaturesSpy = jest.spyOn((wrapper.instance() as FeatureGrid), 'zoomToFeatures');

    (wrapper.instance() as FeatureGrid).onRowClick(clickedRow);

    expect(onRowClickSpy).toHaveBeenCalled();
    expect(zoomToFeaturesSpy).toHaveBeenCalled();

    onRowClickSpy.mockRestore();
    zoomToFeaturesSpy.mockRestore();
  });

  it('highlights the feature on row mouse over', () => {
    const onRowMouseOverSpy = jest.fn();
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features, onRowMouseOver: onRowMouseOverSpy});
    const clickedRow = {
      // @ts-ignore
      key: features[0].ol_uid
    };
    const highlightFeaturesSpy = jest.spyOn((wrapper.instance() as FeatureGrid), 'highlightFeatures');

    (wrapper.instance() as FeatureGrid).onRowMouseOver(clickedRow);

    expect(onRowMouseOverSpy).toHaveBeenCalled();
    expect(highlightFeaturesSpy).toHaveBeenCalled();

    onRowMouseOverSpy.mockRestore();
    highlightFeaturesSpy.mockRestore();
  });

  it('unhighlights the feature on row mouse out', () => {
    const onRowMouseOutSpy = jest.fn();
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features, onRowMouseOut: onRowMouseOutSpy});
    const clickedRow = {
      // @ts-ignore
      key: features[0].ol_uid
    };
    const unhighlightFeaturesSpy = jest.spyOn((wrapper.instance() as FeatureGrid), 'unhighlightFeatures');

    (wrapper.instance() as FeatureGrid).onRowMouseOut(clickedRow);

    expect(onRowMouseOutSpy).toHaveBeenCalled();
    expect(unhighlightFeaturesSpy).toHaveBeenCalled();

    onRowMouseOutSpy.mockRestore();
    unhighlightFeaturesSpy.mockRestore();
  });

  it('handles the change of props', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid);

    expect((wrapper.instance() as FeatureGrid)._source).toBeNull();
    expect((wrapper.instance() as FeatureGrid)._layer).toBeNull();

    wrapper.setProps({
      map: map
    });

    expect((wrapper.instance() as FeatureGrid)._source).toBeInstanceOf(OlSourceVector);
    expect((wrapper.instance() as FeatureGrid)._layer).toBeInstanceOf(OlLayerVector);

    expect((wrapper.instance() as FeatureGrid)._source?.getFeatures()).toEqual([]);

    const zoomToFeaturesSpy = jest.spyOn((wrapper.instance() as FeatureGrid), 'zoomToFeatures');

    wrapper.setProps({
      features: features,
      zoomToExtent: true
    });

    expect((wrapper.instance() as FeatureGrid)._source?.getFeatures()).toEqual(features);
    expect(zoomToFeaturesSpy).toHaveBeenCalled();

    zoomToFeaturesSpy.mockRestore();

    const mapOnSpy = jest.spyOn(map, 'on');

    wrapper.setProps({
      selectable: true
    });

    expect(mapOnSpy).toHaveBeenCalled();

    mapOnSpy.mockRestore();

    const mapUnSpy = jest.spyOn(map, 'un');

    wrapper.setProps({
      selectable: false
    });

    expect(mapUnSpy).toHaveBeenCalled();
    expect(wrapper.state('selectedRowKeys')).toEqual([]);

    mapUnSpy.mockRestore();
  });

  it('sets the highlight style to any hovered feature', () => {
    const getFeaturesAtPixelSpy = jest.spyOn(map, 'getFeaturesAtPixel')
      .mockImplementation(() => [features[0]]);

    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    (wrapper.instance() as FeatureGrid).onMapPointerMove({
      pixel: [19, 19]
    } as unknown as MapBrowserEvent<MouseEvent>);

    expect(features[0].getStyle()).toEqual(wrapper.prop('highlightStyle'));

    expect(features[1].getStyle()).toEqual(undefined);
    expect(features[2].getStyle()).toEqual(undefined);

    getFeaturesAtPixelSpy.mockRestore();
  });

  it('sets the select style to any clicked/selected feature', () => {
    const getFeaturesAtPixelSpy = jest.spyOn(map, 'getFeaturesAtPixel')
      .mockImplementation(() => [features[0]]);

    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    (wrapper.instance() as FeatureGrid).onMapSingleClick({
      pixel: [19, 19]
    } as unknown as MapBrowserEvent<MouseEvent>);

    expect(features[0].getStyle()).toEqual(wrapper.prop('selectStyle'));

    getFeaturesAtPixelSpy.mockRestore();
  });

});

/*eslint-env jest*/
import OlSourceVector from 'ol/source/vector';
import OlLayerVector from 'ol/layer/vector';
import OlGeomGeometryCollection from 'ol/geom/geometrycollection';

import TestUtil from '../../Util/TestUtil';

import { FeatureGrid } from '../../index';

describe('<FeatureGrid />', () => {
  let map;
  let features;

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
    expect(wrapper.instance()._source).toBeInstanceOf(OlSourceVector);
    expect(wrapper.instance()._layer).toBeInstanceOf(OlLayerVector);

    const wrapperWithoutMap = TestUtil.mountComponent(FeatureGrid);

    expect(wrapperWithoutMap.instance()._source).toBeNull();
    expect(wrapperWithoutMap.instance()._layer).toBeNull();
  });

  it('sets the given featureStyle to each feature in the given features array', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    features.forEach(feature => {
      expect(feature.getStyle()).toEqual(wrapper.prop('featureStyle'));
    });
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

    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, selectableRows: true});

    const onPointerMove = wrapper.instance().onMapPointerMove;
    const onMapSingleClick = wrapper.instance().onMapSingleClick;

    expect(mapOnSpy).toHaveBeenCalledTimes(2);
    expect(mapOnSpy).toHaveBeenCalledWith('pointermove', onPointerMove);
    expect(mapOnSpy).toHaveBeenCalledWith('singleclick', onMapSingleClick);

    mapOnSpy.mockReset();
    mapOnSpy.mockRestore();
  });

  it('unregisters a pointermove and singleclick map event handler on unmount', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, selectableRows: true});

    const mapUnSpy = jest.spyOn(map, 'un');
    const onPointerMove = wrapper.instance().onMapPointerMove;
    const onMapSingleClick = wrapper.instance().onMapSingleClick;

    wrapper.unmount();

    expect(mapUnSpy).toHaveBeenCalledTimes(2);
    expect(mapUnSpy).toHaveBeenCalledWith('pointermove', onPointerMove);
    expect(mapUnSpy).toHaveBeenCalledWith('singleclick', onMapSingleClick);

    mapUnSpy.mockReset();
    mapUnSpy.mockRestore();
  });

  it('generates the column definition out of the given features and takes attributeBlacklist into account', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    const got = wrapper.instance().getColumnDefs();

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

    const gotBlacklisted = wrapper.instance().getColumnDefs();

    const expBlacklisted = [{
      dataIndex: 'name',
      key: 'name',
      title: 'name'
    }];

    expect(gotBlacklisted).toEqual(expBlacklisted);
  });

  it('generates the appropriate data to render', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    const got = wrapper.instance().getTableData();

    const exp = [{
      id: 1,
      key: 0,
      name: 'Shinji Kagawa'
    }, {
      id: 2,
      key: 1,
      name: 'Marco Reus'
    }, {
      id: 3,
      key: 2,
      name: 'Roman Weidenfeller'
    }];

    expect(got).toEqual(exp);
  });

  it('fits the map to show all given features', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    const mapViewFitSpy = jest.spyOn(map.getView(), 'fit');

    wrapper.instance().zoomToFeatures(features);

    let featGeometries = [];
    features.forEach(feature => {
      featGeometries.push(feature.getGeometry());
    });

    expect(mapViewFitSpy).toHaveBeenCalledWith(new OlGeomGeometryCollection(featGeometries).getExtent());
  });

  it('highlights all given features', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    wrapper.instance().highlightFeatures(features);

    features.forEach(feature => {
      expect(feature.getStyle()).toEqual(wrapper.prop('highlightStyle'));
    });
  });

  it('unhighlight all given features, but takes selection into account', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});
    const selectedFeatureIdx = 0;

    wrapper.setState({selectedRowKeys: [selectedFeatureIdx]});

    wrapper.instance().unhighlightFeatures(features);

    features.forEach((feature, idx) => {
      if (idx === selectedFeatureIdx) {
        expect(feature.getStyle()).toEqual(wrapper.prop('selectStyle'));
      } else {
        expect(feature.getStyle()).toEqual(wrapper.prop('featureStyle'));
      }
    });
  });

  it('selects all given features', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    wrapper.instance().selectFeatures(features);

    features.forEach(feature => {
      expect(feature.getStyle()).toEqual(wrapper.prop('selectStyle'));
    });
  });

  it('resets all given features to default feature style', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});

    wrapper.instance().resetFeatureStyles(features);

    features.forEach(feature => {
      expect(feature.getStyle()).toEqual(wrapper.prop('featureStyle'));
    });
  });

  it('sets the appropriate select style to a feature if selection in grid changes', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});
    const selectedRowKeys = [0, 1];

    wrapper.instance().onSelectChange(selectedRowKeys);

    features.forEach((feature, idx) => {
      if (selectedRowKeys.includes(idx)) {
        expect(feature.getStyle()).toEqual(wrapper.prop('selectStyle'));
      } else {
        expect(feature.getStyle()).toEqual(wrapper.prop('featureStyle'));
      }
    });

    expect(wrapper.state('selectedRowKeys')).toEqual(selectedRowKeys);
  });

  it('returns the feature for a given row key', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features});
    const rowKey = 1;

    expect(wrapper.instance().getFeatureFromRowKey(rowKey)).toEqual(features[1]);
  });

  it('selects the feature on row click', () => {
    const onRowClickSpy = jest.fn();
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features, onRowClick: onRowClickSpy});
    const clickedRow = {
      key: 0
    };
    const zoomToFeaturesSpy = jest.spyOn(wrapper.instance(), 'zoomToFeatures');

    wrapper.instance().onRowClick(clickedRow);

    expect(onRowClickSpy).toHaveBeenCalled();
    expect(zoomToFeaturesSpy).toHaveBeenCalled();

    onRowClickSpy.mockReset();
    onRowClickSpy.mockRestore();

    zoomToFeaturesSpy.mockReset();
    zoomToFeaturesSpy.mockRestore();
  });

  it('highlights the feature on row mouse over', () => {
    const onRowMouseOverSpy = jest.fn();
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features, onRowMouseOver: onRowMouseOverSpy});
    const clickedRow = {
      key: 0
    };
    const highlightFeaturesSpy = jest.spyOn(wrapper.instance(), 'highlightFeatures');

    wrapper.instance().onRowMouseOver(clickedRow);

    expect(onRowMouseOverSpy).toHaveBeenCalled();
    expect(highlightFeaturesSpy).toHaveBeenCalled();

    onRowMouseOverSpy.mockReset();
    onRowMouseOverSpy.mockRestore();

    highlightFeaturesSpy.mockReset();
    highlightFeaturesSpy.mockRestore();
  });

  it('unhighlights the feature on row mouse out', () => {
    const onRowMouseOutSpy = jest.fn();
    const wrapper = TestUtil.mountComponent(FeatureGrid, {map, features, onRowMouseOut: onRowMouseOutSpy});
    const clickedRow = {
      key: 0
    };
    const unhighlightFeaturesSpy = jest.spyOn(wrapper.instance(), 'unhighlightFeatures');

    wrapper.instance().onRowMouseOut(clickedRow);

    expect(onRowMouseOutSpy).toHaveBeenCalled();
    expect(unhighlightFeaturesSpy).toHaveBeenCalled();

    onRowMouseOutSpy.mockReset();
    onRowMouseOutSpy.mockRestore();

    unhighlightFeaturesSpy.mockReset();
    unhighlightFeaturesSpy.mockRestore();
  });

  it('handles the change of props', () => {
    const wrapper = TestUtil.mountComponent(FeatureGrid);

    expect(wrapper.instance()._source).toBeNull();
    expect(wrapper.instance()._layer).toBeNull();

    wrapper.setProps({
      map: map
    });

    expect(wrapper.instance()._source).toBeInstanceOf(OlSourceVector);
    expect(wrapper.instance()._layer).toBeInstanceOf(OlLayerVector);

    expect(wrapper.instance()._source.getFeatures()).toEqual([]);

    const zoomToFeaturesSpy = jest.spyOn(wrapper.instance(), 'zoomToFeatures');

    wrapper.setProps({
      features: features,
      zoomToExtent: true
    });

    expect(wrapper.instance()._source.getFeatures()).toEqual(features);
    features.forEach(feature => {
      expect(feature.getStyle()).toEqual(wrapper.prop('featureStyle'));
    });
    expect(zoomToFeaturesSpy).toHaveBeenCalled();

    zoomToFeaturesSpy.mockReset();
    zoomToFeaturesSpy.mockRestore();

    const mapOnSpy = jest.spyOn(map, 'on');

    wrapper.setProps({
      selectableRows: true
    });

    expect(mapOnSpy).toHaveBeenCalled();

    mapOnSpy.mockReset();
    mapOnSpy.mockRestore();

    const mapUnSpy = jest.spyOn(map, 'un');

    wrapper.setProps({
      selectableRows: false
    });

    expect(mapUnSpy).toHaveBeenCalled();
    expect(wrapper.state('selectedRowKeys')).toEqual([]);

    mapUnSpy.mockReset();
    mapUnSpy.mockRestore();
  });

});

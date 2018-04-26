/*eslint-env jest*/
import OlSourceVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';
import OlGeomGeometryCollection from 'ol/geom/GeometryCollection';

import differenceWith from 'lodash/differenceWith.js';

import TestUtil from '../../Util/TestUtil';

import { AgFeatureGrid } from '../../index';

describe('<AgFeatureGrid />', () => {
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
    expect(AgFeatureGrid).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid);
    expect(wrapper).not.toBeUndefined();
  });

  it('initializes a vector layer on mount (if map prop is given)', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map});

    const layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === wrapper.prop('layerName'));

    expect(layerCand).toHaveLength(1);
    expect(layerCand[0]).toBeInstanceOf(OlLayerVector);
    expect(wrapper.instance()._source).toBeInstanceOf(OlSourceVector);
    expect(wrapper.instance()._layer).toBeInstanceOf(OlLayerVector);

    const wrapperWithoutMap = TestUtil.mountComponent(AgFeatureGrid);

    expect(wrapperWithoutMap.instance()._source).toBeNull();
    expect(wrapperWithoutMap.instance()._layer).toBeNull();
  });

  it('initializes a vector layer if it\'s not already added to the map only', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map});

    wrapper.instance().initVectorLayer(map);

    const layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === wrapper.prop('layerName'));

    expect(layerCand).toHaveLength(1);
    expect(layerCand[0]).toBeInstanceOf(OlLayerVector);
    expect(wrapper.instance()._source).toBeInstanceOf(OlSourceVector);
    expect(wrapper.instance()._layer).toBeInstanceOf(OlLayerVector);
  });

  it('sets the given featureStyle to the featurelayer', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});
    expect(wrapper.instance()._layer.getStyle()).toEqual(wrapper.prop('featureStyle'));
  });

  it('removes the vector layer from the map on unmount', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map});

    const layerName = wrapper.prop('layerName');

    wrapper.unmount();

    const layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === layerName);

    expect(layerCand).toHaveLength(0);
  });

  it('registers a pointermove and singleclick map event handler on mount', () => {
    const mapOnSpy = jest.spyOn(map, 'on');

    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, selectable: true});

    const onPointerMove = wrapper.instance().onMapPointerMove;
    const onMapSingleClick = wrapper.instance().onMapSingleClick;

    expect(mapOnSpy).toHaveBeenCalledTimes(2);
    expect(mapOnSpy).toHaveBeenCalledWith('pointermove', onPointerMove);
    expect(mapOnSpy).toHaveBeenCalledWith('singleclick', onMapSingleClick);

    mapOnSpy.mockReset();
    mapOnSpy.mockRestore();
  });

  it('unregisters a pointermove and singleclick map event handler on unmount', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, selectable: true});

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
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});

    const got = wrapper.instance().getColumnDefs();

    const exp = [{
      'field': 'id',
      'headerName': 'id'
    }, {
      'field': 'name',
      'headerName': 'name'
    }];

    expect(got).toEqual(exp);

    wrapper.setProps({
      attributeBlacklist: ['id']
    });

    const gotBlacklisted = wrapper.instance().getColumnDefs();

    const expBlacklisted = [{
      field: 'name',
      headerName: 'name'
    }];

    expect(gotBlacklisted).toEqual(expBlacklisted);
  });

  it('generates the appropriate data to render', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});

    const got = wrapper.instance().getRowData();

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
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});

    const mapViewFitSpy = jest.spyOn(map.getView(), 'fit');

    wrapper.instance().zoomToFeatures(features);

    let featGeometries = [];
    features.forEach(feature => {
      featGeometries.push(feature.getGeometry());
    });

    expect(mapViewFitSpy).toHaveBeenCalledWith(new OlGeomGeometryCollection(featGeometries).getExtent());
  });

  it('highlights all given features', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});

    wrapper.instance().highlightFeatures(features);

    features.forEach(feature => {
      expect(feature.getStyle()).toEqual(wrapper.prop('highlightStyle'));
    });
  });

  it('selects all given features', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});

    wrapper.instance().selectFeatures(features);

    features.forEach(feature => {
      expect(feature.getStyle()).toEqual(wrapper.prop('selectStyle'));
    });
  });

  it('resets all given features to default feature style', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});

    wrapper.instance().resetFeatureStyles(features);

    features.forEach(feature => {
      expect(feature.getStyle()).toBe(null);
    });
  });

  it('returns the feature for a given row key', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});
    const rowKey = features[1].ol_uid;

    expect(wrapper.instance().getFeatureFromRowKey(rowKey)).toEqual(features[1]);
  });

  it('selects the feature on row click', () => {
    const onRowClickSpy = jest.fn();
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features, onRowClick: onRowClickSpy});
    const clickedRow = {
      data: {
        key: features[0].ol_uid
      }
    };
    const zoomToFeaturesSpy = jest.spyOn(wrapper.instance(), 'zoomToFeatures');

    wrapper.instance().onRowClick(clickedRow);

    expect(onRowClickSpy).toHaveBeenCalled();
    expect(zoomToFeaturesSpy).not.toHaveBeenCalled();

    onRowClickSpy.mockReset();
    onRowClickSpy.mockRestore();

    zoomToFeaturesSpy.mockReset();
    zoomToFeaturesSpy.mockRestore();
  });

  it('highlights the feature on row mouse over', () => {
    const onRowMouseOverSpy = jest.fn();
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features, onRowMouseOver: onRowMouseOverSpy});
    const clickedRow = {
      data: {
        key: features[0].ol_uid
      }
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

  it('handles the change of props', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid);

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
    expect(zoomToFeaturesSpy).toHaveBeenCalled();

    zoomToFeaturesSpy.mockReset();
    zoomToFeaturesSpy.mockRestore();

    const mapOnSpy = jest.spyOn(map, 'on');

    wrapper.setProps({
      selectable: true
    });

    expect(mapOnSpy).toHaveBeenCalled();

    mapOnSpy.mockReset();
    mapOnSpy.mockRestore();

    const mapUnSpy = jest.spyOn(map, 'un');

    wrapper.setProps({
      selectable: false
    });

    expect(mapUnSpy).toHaveBeenCalled();

    mapUnSpy.mockReset();
    mapUnSpy.mockRestore();
  });

  it('handles row de-selection correctly', () => {
    expect.assertions(3);
    const onRowSelectionChange = jest.fn();
    const mockedGetSelectedRows = jest.fn();
    const selectionCurrent = [{
      key: '1',
      name: 'Yarmolenko'
    }, {
      key: '2',
      name: 'Kagawa'
    }, {
      key: '3',
      name: 'Zorc'
    }, {
      key: '4',
      name: 'Chapuisat'
    }];

    const selectionAfter = [{
      key: '1',
      name: 'Yarmolenko'
    }, {
      key: '2',
      name: 'Kagawa'
    }];

    mockedGetSelectedRows.mockReturnValueOnce(selectionAfter);
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {
      map,
      features,
      onRowSelectionChange
    });
    wrapper.setState({
      selectedRows: selectionCurrent
    }, () => {
      const mockedEvt = {
        api: {
          getSelectedRows: mockedGetSelectedRows
        }
      };
      wrapper.instance().onSelectionChanged(mockedEvt);
      expect(onRowSelectionChange).toHaveBeenCalledTimes(1);
      // selectedRows is the first passed parameter
      const selectedRows = onRowSelectionChange.mock.calls[0][0];
      expect(selectedRows).toEqual(selectionAfter);

      // deselectedRows is the third passed parameter
      const deselectedRows = differenceWith(selectionCurrent, selectionAfter, (a,b) => a.key === b.key);
      const deselectedRowsIs = onRowSelectionChange.mock.calls[0][2];
      expect(deselectedRowsIs).toEqual(deselectedRows);
    });
  });

});

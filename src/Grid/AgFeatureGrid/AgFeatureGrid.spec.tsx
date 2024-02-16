import {CellMouseOverEvent, RowClickedEvent, SelectionChangedEvent} from 'ag-grid-community';
import _differenceWith from 'lodash/differenceWith';
import _isNil from 'lodash/isNil';
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
import AgFeatureGrid from './AgFeatureGrid';

describe('<AgFeatureGrid />', () => {
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
    expect(AgFeatureGrid).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map});
    expect(wrapper).not.toBeUndefined();
  });

  it('initializes a vector layer on mount (if map prop is given)', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map});

    const layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === wrapper.prop('layerName'));

    expect(layerCand).toHaveLength(1);
    expect(layerCand[0]).toBeInstanceOf(OlLayerVector);
    const instance1 = wrapper.instance() as AgFeatureGrid;
    expect(instance1._source).toBeInstanceOf(OlSourceVector);
    expect(instance1._layer).toBeInstanceOf(OlLayerVector);
  });

  it('initializes a vector layer if it\'s not already added to the map only', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map});
    const instance = wrapper.instance() as AgFeatureGrid;

    instance.initVectorLayer(map);

    const layerCand = map.getLayers().getArray().filter(layer => layer.get('name') === wrapper.prop('layerName'));

    expect(layerCand).toHaveLength(1);
    expect(layerCand[0]).toBeInstanceOf(OlLayerVector);
    expect(instance._source).toBeInstanceOf(OlSourceVector);
    expect(instance._layer).toBeInstanceOf(OlLayerVector);
  });

  it('sets the given featureStyle to the featurelayer', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});
    const instance = wrapper.instance() as AgFeatureGrid;
    expect(instance._layer?.getStyle()).toEqual(wrapper.prop('featureStyle'));
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
    const instance = wrapper.instance() as AgFeatureGrid;

    const onPointerMove = instance.onMapPointerMove;
    const onMapSingleClick = instance.onMapSingleClick;

    expect(mapOnSpy).toHaveBeenCalledTimes(2);
    expect(mapOnSpy).toHaveBeenCalledWith('pointermove', onPointerMove);
    expect(mapOnSpy).toHaveBeenCalledWith('singleclick', onMapSingleClick);

    mapOnSpy.mockRestore();
  });

  it('unregisters a pointermove and singleclick map event handler on unmount', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, selectable: true});
    const instance = wrapper.instance() as AgFeatureGrid;

    const mapUnSpy = jest.spyOn(map, 'un');
    const onPointerMove = instance.onMapPointerMove;
    const onMapSingleClick = instance.onMapSingleClick;

    wrapper.unmount();

    expect(mapUnSpy).toHaveBeenCalledTimes(2);
    expect(mapUnSpy).toHaveBeenCalledWith('pointermove', onPointerMove);
    expect(mapUnSpy).toHaveBeenCalledWith('singleclick', onMapSingleClick);

    mapUnSpy.mockRestore();
  });

  it('generates the column definition out of the given features and takes attributeBlacklist into account', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});
    const instance = wrapper.instance() as AgFeatureGrid;
    const got = instance.getColumnDefs();

    const exp = [{
      field: 'id',
      headerName: 'id'
    }, {
      field: 'name',
      headerName: 'name'
    }];

    expect(got).toEqual(exp);

    wrapper.setProps({
      attributeBlacklist: ['id']
    });

    const gotBlacklisted = instance.getColumnDefs();

    const expBlacklisted = [{
      field: 'name',
      headerName: 'name'
    }];

    expect(gotBlacklisted).toEqual(expBlacklisted);
  });

  it('generates the appropriate data to render', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});
    const instance = wrapper.instance() as AgFeatureGrid;
    const got = instance.getRowData();

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
      let gotElement = got[idx] as any;
      expect(row.id).toEqual(gotElement.id);
      expect(row.name).toEqual(gotElement.name);
    });
  });

  it('fits the map to show all given features', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});
    const instance = wrapper.instance() as AgFeatureGrid;

    const mapViewFitSpy = jest.spyOn(map.getView(), 'fit');

    instance.zoomToFeatures(features);

    const featGeometries: OlGeometry[] = [];
    features.forEach(feature => {
      if (!_isNil(feature.getGeometry())) {
        featGeometries.push(feature.getGeometry()!);
      }
    });

    expect(mapViewFitSpy).toHaveBeenCalledWith(new OlGeomGeometryCollection(featGeometries).getExtent());
  });

  it('highlights all given features', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});
    const instance = wrapper.instance() as AgFeatureGrid;
    instance.highlightFeatures(features);

    features.forEach(feature => {
      expect(feature.getStyle()).toEqual(wrapper.prop('highlightStyle'));
    });
  });

  it('selects all given features', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});
    const instance = wrapper.instance() as AgFeatureGrid;
    instance.selectFeatures(features);

    features.forEach(feature => {
      expect(feature.getStyle()).toEqual(wrapper.prop('selectStyle'));
    });
  });

  it('resets all given features to default feature style', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});
    const instance = wrapper.instance() as AgFeatureGrid;
    instance.resetFeatureStyles();

    features.forEach(feature => {
      expect(feature.getStyle()).toBe(undefined);
    });
  });

  it('returns the feature for a given row key', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features});
    const instance = wrapper.instance() as AgFeatureGrid;
    // @ts-ignore
    const rowKey = features[1].ol_uid;

    expect(instance.getFeatureFromRowKey(rowKey)).toEqual(features[1]);
  });

  it('selects the feature on row click', () => {
    const onRowClickSpy = jest.fn();
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features, onRowClick: onRowClickSpy});
    const instance = wrapper.instance() as AgFeatureGrid;
    const clickedRow = {
      data: {
        // @ts-ignore
        key: features[0].ol_uid
      }
    } as RowClickedEvent;
    const zoomToFeaturesSpy = jest.spyOn(instance, 'zoomToFeatures');

    instance.onRowClick(clickedRow);

    expect(onRowClickSpy).toHaveBeenCalled();
    expect(zoomToFeaturesSpy).not.toHaveBeenCalled();

    onRowClickSpy.mockRestore();
    zoomToFeaturesSpy.mockRestore();
  });

  it('highlights the feature on row mouse over', () => {
    const onRowMouseOverSpy = jest.fn();
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map, features, onRowMouseOver: onRowMouseOverSpy});
    const clickedRow = {
      data: {
        // @ts-ignore
        key: features[0].ol_uid
      }
    } as CellMouseOverEvent;
    const instance = wrapper.instance() as AgFeatureGrid;
    const highlightFeaturesSpy = jest.spyOn(instance, 'highlightFeatures');

    instance.onRowMouseOver(clickedRow);

    expect(onRowMouseOverSpy).toHaveBeenCalled();
    expect(highlightFeaturesSpy).toHaveBeenCalled();

    onRowMouseOverSpy.mockRestore();
    highlightFeaturesSpy.mockRestore();
  });

  it('handles the change of props', () => {
    const wrapper = TestUtil.mountComponent(AgFeatureGrid, {map: map});
    const instance = wrapper.instance() as AgFeatureGrid;
    expect(instance._source).toBeInstanceOf(OlSourceVector);
    expect(instance._layer).toBeInstanceOf(OlLayerVector);

    expect(instance._source?.getFeatures()).toEqual([]);

    const zoomToFeaturesSpy = jest.spyOn(instance, 'zoomToFeatures');

    wrapper.setProps({
      map: map,
      features: features,
      zoomToExtent: true
    });

    expect(instance._source?.getFeatures()).toEqual(features);
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

    act(() => {
      wrapper.setState({
        selectedRows: selectionCurrent
      }, () => {
        const instance = wrapper.instance() as AgFeatureGrid;
        const mockedEvt = {
          api: {
            getSelectedRows: mockedGetSelectedRows
          },
        };
        act(() => {
          instance.onSelectionChanged(mockedEvt as any as SelectionChangedEvent);
        });
        expect(onRowSelectionChange).toHaveBeenCalledTimes(1);
        // selectedRows is the first passed parameter
        const selectedRows = onRowSelectionChange.mock.calls[0][0];
        expect(selectedRows).toEqual(selectionAfter);

        // deselectedRows is the third passed parameter
        const deselectedRows = _differenceWith(selectionCurrent, selectionAfter, (a,b) => a.key === b.key);
        const deselectedRowsIs = onRowSelectionChange.mock.calls[0][2];
        expect(deselectedRowsIs).toEqual(deselectedRows);
      });
    });
  });

});

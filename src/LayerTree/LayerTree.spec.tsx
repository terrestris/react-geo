import { act,fireEvent, render, screen } from '@testing-library/react';
import OlLayerBase from 'ol/layer/Base';
import OlLayerGroup from 'ol/layer/Group';
import OlLayerTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import OlSourceTileWMS from 'ol/source/TileWMS';
import * as React from 'react';

import TestUtil from '../Util/TestUtil';;
import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import userEvent from '@testing-library/user-event';

import LayerTree from './LayerTree';

describe('<LayerTree />', () => {
  let layerGroup: OlLayerGroup;
  let layerSubGroup: OlLayerGroup;
  let map: OlMap;
  let layer1: OlLayerBase;
  let layer2: OlLayerBase;
  let layer3: OlLayerBase;

  beforeEach(() => {
    const layerSource1 = new OlSourceTileWMS();
    layer1 = new OlLayerTile({
      properties: {
        name: 'layer1'
      },
      minResolution: 10,
      maxResolution: 1000,
      source: layerSource1
    });
    const layerSource2 = new OlSourceTileWMS();
    layer2 = new OlLayerTile({
      properties: {
        name: 'layer2'
      },
      visible: false,
      source: layerSource2
    });
    const layerSource3 = new OlSourceTileWMS();
    layer3 = new OlLayerTile({
      properties: {
        name: 'layer3'
      },
      visible: false,
      source: layerSource3
    });
    layerSubGroup = new OlLayerGroup({
      properties: {
        name: 'layerSubGroup'
      },
      layers: [layer3]
    });
    layerGroup = new OlLayerGroup({
      properties: {
        name: 'layerGroup'
      },
      layers: [layer1, layer2, layerSubGroup]
    });

    map = TestUtil.createMap();
    map.setLayerGroup(layerGroup);
  });

  afterEach(() => {
    TestUtil.removeMap(map);
  });

  it('can be rendered', () => {
    const {
      container
    } = render(<LayerTree />);

    expect(container).toBeVisible();
  });

  it('sets the layer name as title per default', () => {
    renderInMapContext(map,
      <LayerTree />
    );

    const expectedNodeTitles = [
      'layer1',
      'layer2',
      'layerSubGroup'
    ];

    expectedNodeTitles.forEach(expectedNodeTitle => {
      const node = screen.queryByText(expectedNodeTitle);
      expect(node).toBeInTheDocument();
    });

    const unexpectedNodeTitles = [
      // Not visible since not expanded.
      'layer3',
      // Not visible since it's the root node.
      'layerGroup'
    ];

    unexpectedNodeTitles.forEach(unexpectedNodeTitle => {
      const node = screen.queryByText(unexpectedNodeTitle);
      expect(node).not.toBeInTheDocument();
    });
  });

  it('accepts a layer group instead of getting all layers from the map directly', () => {
    renderInMapContext(map,
      <LayerTree
        layerGroup={layerSubGroup}
      />
    );

    const expectedNodeTitles = [
      'layer3'
    ];

    expectedNodeTitles.forEach(expectedNodeTitle => {
      const node = screen.queryByText(expectedNodeTitle);
      expect(node).toBeInTheDocument();
    });

    const unexpectedNodeTitles = [
      // Not visible since not contained in layerSubGroup
      'layer1',
      'layer2',
      'layerGroup',
      // Not visible since it's the root node.
      'layerSubGroup'
    ];

    unexpectedNodeTitles.forEach(unexpectedNodeTitle => {
      const node = screen.queryByText(unexpectedNodeTitle);
      expect(node).not.toBeInTheDocument();
    });
  });

  it('removes all registered view listeners on unmount', () => {
    expect(map.getListeners('moveend')).toBeUndefined();

    const {
      unmount
    } = renderInMapContext(map,
      <LayerTree />
    );

    expect(map.getView().getListeners('change:resolution')?.length).toBe(1);

    unmount();

    expect(map.getView().getListeners('change:resolution')).toBeUndefined();
  });

  it('removes all registered layer(-group) listeners on unmount', () => {
    expect(layer1.getListeners('change:visible')).toBeUndefined();
    expect(layer2.getListeners('change:visible')).toBeUndefined();
    expect(layer3.getListeners('change:visible')).toBeUndefined();

    // The layer group has registered a default listener.
    expect(layerGroup.getLayers().getListeners('add')?.length).toBe(1);
    expect(layerGroup.getLayers().getListeners('remove')?.length).toBe(1);
    expect(layerGroup.getListeners('change:layers')?.length).toBe(1);

    expect(layerSubGroup.getLayers().getListeners('add')?.length).toBe(1);
    expect(layerSubGroup.getLayers().getListeners('remove')?.length).toBe(1);
    expect(layerSubGroup.getListeners('change:layers')?.length).toBe(1);

    const {
      unmount
    } = renderInMapContext(map,
      <LayerTree />
    );

    expect(layer1.getListeners('change:visible')?.length).toBe(1);
    expect(layer2.getListeners('change:visible')?.length).toBe(1);
    expect(layer3.getListeners('change:visible')?.length).toBe(1);

    expect(layerGroup.getLayers().getListeners('add')?.length).toBe(2);
    expect(layerGroup.getLayers().getListeners('remove')?.length).toBe(2);
    expect(layerGroup.getListeners('change:layers')?.length).toBe(2);

    expect(layerSubGroup.getLayers().getListeners('add')?.length).toBe(2);
    expect(layerSubGroup.getLayers().getListeners('remove')?.length).toBe(2);
    expect(layerSubGroup.getListeners('change:layers')?.length).toBe(2);

    unmount();

    expect(layer1.getListeners('change:visible')).toBeUndefined();
    expect(layer2.getListeners('change:visible')).toBeUndefined();
    expect(layer3.getListeners('change:visible')).toBeUndefined();

    expect(layerGroup.getLayers().getListeners('add')?.length).toBe(1);
    expect(layerGroup.getLayers().getListeners('remove')?.length).toBe(1);
    expect(layerGroup.getListeners('change:layers')?.length).toBe(1);

    expect(layerSubGroup.getLayers().getListeners('add')?.length).toBe(1);
    expect(layerSubGroup.getLayers().getListeners('remove')?.length).toBe(1);
    expect(layerSubGroup.getListeners('change:layers')?.length).toBe(1);
  });

  it('accepts a custom title renderer function', () => {
    const nodeTitleRenderer = (layer: OlLayerBase) => {
      return <span>{`Custom-${layer.get('name')}`}</span>;
    };

    renderInMapContext(map,
      <LayerTree
        layerGroup={layerSubGroup}
        nodeTitleRenderer={nodeTitleRenderer}
      />
    );

    const expectedNodeTitles = [
      'Custom-layer3'
    ];

    expectedNodeTitles.forEach(expectedNodeTitle => {
      const node = screen.queryByText(expectedNodeTitle);
      expect(node).toBeInTheDocument();
    });
  });

  it('accepts a filterFunction to filter the layers in the tree', () => {
    const filterFunction = (layer: OlLayerBase) => {
      return layer.get('name') === 'layer1';
    };

    renderInMapContext(map,
      <LayerTree
        filterFunction={filterFunction}
      />
    );
  });

  it('sets visible layers as checked initially', () => {
    renderInMapContext(map,
      <LayerTree />
    );

    const layer1Span = screen.queryByText('layer1');
    const layer2Span = screen.queryByText('layer2');

    // eslint-disable-next-line testing-library/no-node-access
    expect(layer1Span?.parentNode?.parentNode).toHaveClass('ant-tree-treenode-checkbox-checked');
    // eslint-disable-next-line testing-library/no-node-access
    expect(layer2Span?.parentNode?.parentNode).not.toHaveClass('ant-tree-treenode-checkbox-checked');
  });

  it('sets the layers visibility on check', async () => {
    renderInMapContext(map,
      <LayerTree />
    );

    const layer1Span = screen.getByText('layer1');
    const layer2Span = screen.getByText('layer2');

    // eslint-disable-next-line testing-library/no-node-access
    expect(layer1Span?.parentNode?.parentNode).toHaveClass('ant-tree-treenode-checkbox-checked');
    // eslint-disable-next-line testing-library/no-node-access
    expect(layer2Span?.parentNode?.parentNode).not.toHaveClass('ant-tree-treenode-checkbox-checked');

    expect(layer1.getVisible()).toBe(true);
    expect(layer2.getVisible()).toBe(false);

    await userEvent.click(layer1Span);
    await userEvent.click(layer2Span);

    // eslint-disable-next-line testing-library/no-node-access
    expect(layer1Span?.parentNode?.parentNode).not.toHaveClass('ant-tree-treenode-checkbox-checked');
    // eslint-disable-next-line testing-library/no-node-access
    expect(layer2Span?.parentNode?.parentNode).toHaveClass('ant-tree-treenode-checkbox-checked');

    expect(layer1.getVisible()).toBe(false);
    expect(layer2.getVisible()).toBe(true);
  });

  it('updates the checked state if the layers visibility changes internally', async () => {
    renderInMapContext(map,
      <LayerTree />
    );

    const layer1Span = screen.getByText('layer1');
    const layer2Span = screen.getByText('layer2');

    // eslint-disable-next-line testing-library/no-node-access
    expect(layer1Span?.parentNode?.parentNode).toHaveClass('ant-tree-treenode-checkbox-checked');
    // eslint-disable-next-line testing-library/no-node-access
    expect(layer2Span?.parentNode?.parentNode).not.toHaveClass('ant-tree-treenode-checkbox-checked');

    act(() => {
      layer1.setVisible(false);
      layer2.setVisible(true);
    });

    // eslint-disable-next-line testing-library/no-node-access
    expect(layer1Span?.parentNode?.parentNode).not.toHaveClass('ant-tree-treenode-checkbox-checked');
    // eslint-disable-next-line testing-library/no-node-access
    expect(layer2Span?.parentNode?.parentNode).toHaveClass('ant-tree-treenode-checkbox-checked');
  });

  it('sets the out-of-range class if the layer is not visible', () => {
    renderInMapContext(map,
      <LayerTree />
    );

    const layer1Span = screen.getByText('layer1');

    // eslint-disable-next-line testing-library/no-node-access
    expect(layer1Span?.parentNode?.parentNode).toHaveClass('out-of-range');

    act(() => {
      map.getView().setZoom(10);
    });

    // eslint-disable-next-line testing-library/no-node-access
    expect(layer1Span?.parentNode?.parentNode).not.toHaveClass('out-of-range');
  });

  it('adds/removes layers to the tree if added/removed internally', () => {
    renderInMapContext(map,
      <LayerTree />
    );

    let newLayerSpan = screen.queryByText('newLayer');

    expect(newLayerSpan).not.toBeInTheDocument();

    const newLayer = new OlLayerTile({
      source: new OlSourceTileWMS(),
      properties: {
        name: 'newLayer'
      }
    });

    act(() => {
      map.addLayer(newLayer);
    });

    newLayerSpan = screen.getByText('newLayer');

    expect(newLayerSpan).toBeInTheDocument();

    act(() => {
      map.removeLayer(newLayer);
    });

    expect(newLayerSpan).not.toBeInTheDocument();
  });

  it('updates the layer name if changed internally', () => {
    renderInMapContext(map,
      <LayerTree />
    );

    let layer1Span = screen.queryByText('layer1');

    expect(layer1Span).toBeInTheDocument();

    act(() => {
      layer1.set('name', 'newLayerName');
    });

    layer1Span = screen.queryByText('layer1');

    expect(layer1Span).not.toBeInTheDocument();

    layer1Span = screen.queryByText('newLayerName');

    expect(layer1Span).toBeInTheDocument();
  });

  it('sets the visibility for the children when called with a layerGroup', async () => {
    renderInMapContext(map,
      <LayerTree />
    );

    const layerSubGroupSpan = screen.getByText('layerSubGroup');

    expect(layer3.getVisible()).toBe(false);

    await userEvent.click(layerSubGroupSpan);

    expect(layer3.getVisible()).toBe(true);
  });

  it('sets the parent layerGroup visible when layer has been made visible', async () => {
    renderInMapContext(map,
      <LayerTree />
    );

    // Expand all nodes.
    const carets = screen.getAllByLabelText('caret-down');
    for (const caret of carets) {
      await userEvent.click(caret);
    }

    const layerSubGroupSpan = screen.getByText('layerSubGroup');

    // eslint-disable-next-line testing-library/no-node-access
    let layerSubGroupCheckbox = layerSubGroupSpan?.parentNode?.parentNode?.querySelector('.ant-tree-checkbox-checked');

    expect(layerSubGroupCheckbox).toBe(null);

    const layer3Span = screen.getByText('layer3');

    await userEvent.click(layer3Span);

    // eslint-disable-next-line testing-library/no-node-access
    layerSubGroupCheckbox = layerSubGroupSpan?.parentNode?.parentNode?.querySelector('.ant-tree-checkbox-checked');

    expect(layerSubGroupCheckbox).toBeInstanceOf(HTMLSpanElement);
  });

  it('renders the layers in correct order', () => {
    renderInMapContext(map,
      <LayerTree />
    );

    // Last drawn map layer (layerSubGroup) should be on top of the tree.
    const layerSubGroupSpan = screen.getByText('layerSubGroup');
    const layer2Span = screen.getByText('layer2');
    const layer1Span = screen.getByText('layer1');

    // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
    expect(layerSubGroupSpan.compareDocumentPosition(layer2Span)).toEqual(4);
    expect(layer2Span.compareDocumentPosition(layer1Span)).toEqual(4);
  });

  it('can handle drop on a node', () => {
    renderInMapContext(map,
      <LayerTree />
    );

    const layers = map.getLayers().getArray();

    expect(layers[0]).toBe(layer1);
    expect(layers[1]).toBe(layer2);
    expect(layers[2]).toBe(layerSubGroup);

    const layerSubGroupSpan = screen.getByText('layerSubGroup');
    const layer1Span = screen.getByText('layer1');

    // Move layer1 on layerSubGroup (relative position = 0).
    fireEvent.dragStart(layer1Span);
    fireEvent.dragEnter(layerSubGroupSpan);
    fireEvent.dragOver(layerSubGroupSpan);
    fireEvent.drop(layerSubGroupSpan);

    expect(layers[0]).toBe(layer2);
    expect(layers[1]).toBe(layerSubGroup);
    expect((layers[1] as OlLayerGroup).getLayers().getArray()).toContain(layer1);
  });

  it('ignores drop on leaf', () => {
    renderInMapContext(map,
      <LayerTree />
    );

    const layers = map.getLayers().getArray();

    expect(layers[0]).toBe(layer1);
    expect(layers[1]).toBe(layer2);
    expect(layers[2]).toBe(layerSubGroup);

    const layer2Span = screen.getByText('layer2');
    const layer1Span = screen.getByText('layer1');

    // Move layer1 on layer2 (relative position = 0).
    fireEvent.dragStart(layer1Span);
    fireEvent.dragEnter(layer2Span);
    fireEvent.dragOver(layer2Span);
    fireEvent.drop(layer2Span);

    expect(layers[0]).toBe(layer1);
    expect(layers[1]).toBe(layer2);
    expect(layers[2]).toBe(layerSubGroup);
  });

  it('can handle drop after leaf', () => {
    renderInMapContext(map,
      <LayerTree />
    );

    const layers = map.getLayers().getArray();

    expect(layers[0]).toBe(layer1);
    expect(layers[1]).toBe(layer2);
    expect(layers[2]).toBe(layerSubGroup);

    const layerSubGroupSpan = screen.getByText('layerSubGroup');
    const layer2Span = screen.getByText('layer2');

    // Move layerSubGroup on bottom of layer2 (relative position = 1).
    fireEvent.dragStart(layerSubGroupSpan);
    fireEvent.dragEnter(layer2Span);
    fireEvent.dragOver(layer2Span);
    fireEvent.drop(layer2Span);

    expect(layers[0]).toBe(layer1);
    expect(layers[1]).toBe(layerSubGroup);
    expect(layers[2]).toBe(layer2);
  });

  // TODO This seems not to working with the jest runner.
  // it('can handle drop before leaf', () => {
  //   renderInMapContext(map,
  //     <LayerTree />
  //   );

  //   const layers = map.getLayers().getArray();

  //   expect(layers[0]).toBe(layer1);
  //   expect(layers[1]).toBe(layer2);
  //   expect(layers[2]).toBe(layerSubGroup);

  //   const layerSubGroupSpan = screen.getByText('layerSubGroup');
  //   const layer2Span = screen.getByText('layer2');
  //   const layer1Span = screen.getByText('layer1');

  //   // Move layer1 on top of layer2 (relative position = 1).
  //   fireEvent.dragStart(layer1Span);
  //   fireEvent.dragEnter(layer2Span);
  //   fireEvent.dragOver(layer2Span);
  //   // fireEvent.dragLeave(layer2Span);
  //   // fireEvent.dragExit(layer2Span);
  //   fireEvent.dragEnter(layerSubGroupSpan);
  //   // fireEvent.dragOver(layer2Span);
  //   fireEvent.drop(layerSubGroupSpan);

  //   // expect(layers[0]).toBe(layer2);
  //   // expect(layers[1]).toBe(layer1);
  //   // expect(layers[2]).toBe(layerSubGroup);
  // });
});

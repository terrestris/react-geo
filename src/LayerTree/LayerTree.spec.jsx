/*eslint-env jest*/
import React from 'react';

import OlLayerGroup from 'ol/layer/Group';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import * as OlObservable from 'ol/Observable';
import OlCollection from 'ol/Collection';

import TestUtil from '../Util/TestUtil';

import { LayerTree } from '../index';

import Logger from '@terrestris/base-util/src/Logger';

describe('<LayerTree />', () => {
  let layerGroup;
  let map;
  let layer1;
  let layer2;

  beforeEach(() => {
    const layerSource1 = new OlSourceTileWMS();
    layer1 = new OlLayerTile({
      name: 'layer1',
      source: layerSource1
    });
    const layerSource2 = new OlSourceTileWMS();
    layer2 = new OlLayerTile({
      name: 'layer2',
      visible: false,
      source: layerSource2
    });
    layerGroup = new OlLayerGroup({
      name: 'layerGroup',
      layers: [layer1, layer2]
    });

    map = TestUtil.createMap();
    map.setLayerGroup(layerGroup);
  });

  afterEach(() => {
    TestUtil.removeMap(map);
  });

  it('is defined', () => {
    expect(LayerTree).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(LayerTree, {map});
    expect(wrapper).not.toBeUndefined();
  });

  it('layergroup taken from map if not provided', () => {
    const wrapper = TestUtil.mountComponent(LayerTree, {map});
    expect(wrapper.state('layerGroup')).toBe(map.getLayerGroup());
  });

  it('unmount removes listeners', () => {
    OlObservable.unByKey = jest.fn();
    const wrapper = TestUtil.mountComponent(LayerTree, {map});
    const olListenerKeys = wrapper.instance().olListenerKeys;
    wrapper.unmount();
    expect(OlObservable.unByKey).toHaveBeenCalled();
    expect(OlObservable.unByKey).toHaveBeenCalledWith(olListenerKeys);
  });

  it('CWR with new layerGroup rebuild listeners and treenodes ', () => {
    const props = {
      layerGroup,
      map
    };
    const wrapper = TestUtil.mountComponent(LayerTree, props);

    const subLayer = new OlLayerTile({
      name: 'subLayer',
      source: new OlSourceTileWMS()
    });
    const nestedLayerGroup = new OlLayerGroup({
      name: 'nestedLayerGroup',
      layers: [subLayer]
    });

    expect(wrapper.instance().olListenerKeys).toHaveLength(6);
    wrapper.setProps({
      layerGroup: nestedLayerGroup
    });
    expect(wrapper.instance().olListenerKeys).toHaveLength(4);
  });

  describe('<LayerTreeNode> creation', () => {

    it('adds a <LayerTreeNode> for every child', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const treeNodes = wrapper.find('LayerTreeNode');
      expect(treeNodes).toHaveLength(layerGroup.getLayers().getLength());
    });

    // TODO This test could be better if the TreeNodes where iterable, but they
    // are not. See comment below.
    it('can handle nested `ol.layer.group`s', () => {
      const props = {
        layerGroup,
        map
      };
      const subLayer = new OlLayerTile({
        name: 'subLayer',
        source: new OlSourceTileWMS()
      });
      const nestedLayerGroup = new OlLayerGroup({
        name: 'nestedLayerGroup',
        layers: [subLayer]
      });
      layerGroup.getLayers().push(nestedLayerGroup);

      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const treeNodes = wrapper.find('LayerTreeNode');
      const groupNode = treeNodes.at(0);
      const subNode = groupNode.props().children[0];
      expect(subNode.props.title).toBe(subLayer.get('name'));
    });

    it('can handle a replacement of layergroups `ol.Collection`', () => {
      const props = {
        map
      };
      const subLayer = new OlLayerTile({
        name: 'subLayer',
        source: new OlSourceTileWMS()
      });
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const rebuildSpy = jest.spyOn(wrapper.instance(), 'rebuildTreeNodes');
      map.getLayerGroup().setLayers(new OlCollection([subLayer]));
      expect(rebuildSpy).toHaveBeenCalled();
      rebuildSpy.mockReset();
      rebuildSpy.mockRestore();
    });

    it('sets the layer name as title per default', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const treeNodes = wrapper.find('LayerTreeNode');
      treeNodes.forEach((node, index) => {
        const reverseIndex = treeNodes.length - (index + 1);
        const layer = layerGroup.getLayers().item(reverseIndex);
        expect(node.props().title).toBe(layer.get('name'));
      });
    });

    it('accepts a custom title renderer function', () => {
      const nodeTitleRenderer = function(layer) {
        return (
          <span className="span-1">
            <span className="sub-span-1">
              {layer.get('name')}
            </span>
            <span className="sub-span-2" />
          </span>
        );
      };
      const props = {
        layerGroup,
        map,
        nodeTitleRenderer
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const treeNodes = wrapper.find('LayerTreeNode');

      treeNodes.forEach((node, index) => {
        const reverseIndex = treeNodes.length - (index + 1);
        const layer = layerGroup.getLayers().item(reverseIndex);
        expect(node.find('span.span-1').length).toBe(1);
        expect(node.find('span.sub-span-1').length).toBe(1);
        expect(node.find('span.sub-span-1').props().children).toBe(layer.get('name'));
        expect(node.find('span.sub-span-2').length).toBe(1);
      });
    });

    it('can filter layers if a filterFunction is given', () => {
      const filterFunction = function(layer) {
        return layer.get('name') !== 'layer1';
      };
      const props = {
        layerGroup,
        map,
        filterFunction
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const treeNodes = wrapper.find('LayerTreeNode');

      expect(treeNodes.length).toBe(1);
      expect(treeNodes.get(0).props.title).toBe('layer2');
    });

    it('sets the right keys for the layers', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const treeNodes = wrapper.find('LayerTreeNode');

      treeNodes.forEach((node, index) => {
        const reverseIndex = treeNodes.length - (index + 1);
        const layer = layerGroup.getLayers().item(reverseIndex);
        expect(node.props().eventKey).toBe(layer.ol_uid.toString());
      });
    });

    it('sets visible layers as checked', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const treeNodes = wrapper.find('LayerTreeNode');

      treeNodes.forEach((node, index) => {
        const reverseIndex = treeNodes.length - (index + 1);
        const layer = layerGroup.getLayers().item(reverseIndex);
        expect(layer.getVisible()).toBe(node.props().checked);
      });
    });

    describe('#treeNodeFromLayer', () => {

      it('logs an error if called with an invisible layergroup', () => {
        const props = {
          layerGroup,
          map
        };
        layerGroup.setVisible(false);

        const logSpy = jest.spyOn(Logger, 'warn');
        const wrapper = TestUtil.mountComponent(LayerTree, props);
        wrapper.instance().treeNodeFromLayer(layerGroup);

        expect(logSpy).toHaveBeenCalled();

        logSpy.mockReset();
        logSpy.mockRestore();
        layerGroup.setVisible(true);
      });

      it('returns a LayerTreeNode when called with a layer', () => {
        const props = {
          layerGroup,
          map
        };
        layerGroup.setVisible(false);

        const wrapper = TestUtil.mountComponent(LayerTree, props);
        const treeNode = wrapper.instance().treeNodeFromLayer(layer1);

        expect(treeNode.props.title).toBe(layer1.get('name'));
        expect(treeNode.key).toBe(layer1.ol_uid.toString());
      });
    });
  });

  describe('#onCheck', () => {
    it('sets the correct visibility to the layer from the checked state', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const treeNodes = wrapper.find('LayerTreeNode');


      treeNodes.forEach((node, index) => {
        const reverseIndex = treeNodes.length - (index + 1);
        const layer = layerGroup.getLayers().item(reverseIndex);
        const checkBox = node.find('.ant-tree-checkbox');
        const wasVisible = layer.getVisible();
        checkBox.simulate('click');
        expect(wasVisible).toBe(!layer.getVisible());
      });
    });
  });

  describe('event handling', () => {

    it('sets checked state corresponding to layer.setVisible', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      let treeNode = wrapper.find('LayerTreeNode').at(1);

      expect(treeNode.props().checked).toBe(true);
      layer1.setVisible(false);
      wrapper.update();
      treeNode = wrapper.find('LayerTreeNode').at(1);
      expect(treeNode.props().checked).toBe(false);
      layer1.setVisible(true);
      wrapper.update();
      treeNode = wrapper.find('LayerTreeNode').at(1);
      expect(treeNode.props().checked).toBe(true);
    });

    it('triggers tree rebuild on nodeTitleRenderer changes', () => {
      const exampleNodeTitleRenderer = function(layer) {
        return (
          <span className="span-1">
            {layer.get('name')}
          </span>
        );
      };

      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const rebuildSpy = jest.spyOn(wrapper.instance(), 'rebuildTreeNodes');

      wrapper.setProps({
        nodeTitleRenderer: exampleNodeTitleRenderer
      });
      expect(rebuildSpy).toHaveBeenCalledTimes(1);

      wrapper.setProps({
        nodeTitleRenderer: null
      });
      expect(rebuildSpy).toHaveBeenCalledTimes(2);

      rebuildSpy.mockReset();
      rebuildSpy.mockRestore();
    });

    it('triggers tree rebuild on layer add', () => {
      const props = {
        layerGroup,
        map
      };
      const layer = new OlLayerTile({
        source: new OlSourceTileWMS()
      });
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const rebuildSpy = jest.spyOn(wrapper.instance(), 'rebuildTreeNodes');

      layerGroup.getLayers().push(layer);
      expect(rebuildSpy).toHaveBeenCalled();

      rebuildSpy.mockReset();
      rebuildSpy.mockRestore();
    });

    it('… also registers add/remove events for added groups ', () => {
      const props = {
        layerGroup,
        map
      };
      const layer = new OlLayerTile({
        source: new OlSourceTileWMS()
      });
      const group = new OlLayerGroup({
        layers: [layer]
      });
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const rebuildSpy = jest.spyOn(wrapper.instance(), 'rebuildTreeNodes');
      const registerSpy = jest.spyOn(wrapper.instance(), 'registerAddRemoveListeners');

      layerGroup.getLayers().push(group);
      expect(rebuildSpy).toHaveBeenCalled();
      expect(registerSpy).toHaveBeenCalled();

      rebuildSpy.mockReset();
      rebuildSpy.mockRestore();
      registerSpy.mockReset();
      registerSpy.mockRestore();
    });

    it('trigger unregisterEventsByLayer and rebuildTreeNodes for removed layers ', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const rebuildSpy = jest.spyOn(wrapper.instance(), 'rebuildTreeNodes');
      const unregisterSpy = jest.spyOn(wrapper.instance(), 'unregisterEventsByLayer');

      layerGroup.getLayers().remove(layer1);
      expect(rebuildSpy).toHaveBeenCalled();
      expect(unregisterSpy).toHaveBeenCalled();

      rebuildSpy.mockReset();
      rebuildSpy.mockRestore();
      unregisterSpy.mockReset();
      unregisterSpy.mockRestore();
    });

    it('… unregister recursively for removed groups', () => {
      const props = {
        layerGroup,
        map
      };
      const subLayer1 = new OlLayerTile({
        source: new OlSourceTileWMS()
      });
      const subLayer2 = new OlLayerTile({
        source: new OlSourceTileWMS()
      });
      const nestedLayerGroup = new OlLayerGroup({
        name: 'nestedLayerGroup',
        layers: [subLayer1, subLayer2]
      });
      layerGroup.getLayers().push(nestedLayerGroup);

      const wrapper = TestUtil.mountComponent(LayerTree, props);
      const rebuildSpy = jest.spyOn(wrapper.instance(), 'rebuildTreeNodes');
      const unregisterSpy = jest.spyOn(wrapper.instance(), 'unregisterEventsByLayer');

      layerGroup.getLayers().remove(nestedLayerGroup);
      expect(rebuildSpy).toHaveBeenCalledTimes(1);
      expect(unregisterSpy).toHaveBeenCalledTimes(3);

      rebuildSpy.mockReset();
      rebuildSpy.mockRestore();
      unregisterSpy.mockReset();
      unregisterSpy.mockRestore();
    });

    describe('#unregisterEventsByLayer', () => {

      it('removes the listener and the eventKey from olListenerKeys', () => {
        const props = {
          layerGroup,
          map
        };
        const subLayer1 = new OlLayerTile({
          source: new OlSourceTileWMS()
        });
        const subLayer2 = new OlLayerTile({
          source: new OlSourceTileWMS()
        });
        const nestedLayerGroup = new OlLayerGroup({
          name: 'nestedLayerGroup',
          layers: [subLayer1, subLayer2]
        });
        layerGroup.getLayers().push(nestedLayerGroup);

        const wrapper = TestUtil.mountComponent(LayerTree, props);
        const oldOlListenerKey = wrapper.instance().olListenerKeys;
        OlObservable.unByKey = jest.fn();

        wrapper.instance().unregisterEventsByLayer(subLayer1);

        const newOlListenerKey = wrapper.instance().olListenerKeys;

        expect(OlObservable.unByKey).toHaveBeenCalled();
        expect(newOlListenerKey.length).toBe(oldOlListenerKey.length - 1);
      });

      it('… of children for groups', () => {
        const props = {
          layerGroup,
          map
        };
        const subLayer1 = new OlLayerTile({
          source: new OlSourceTileWMS()
        });
        const subLayer2 = new OlLayerTile({
          source: new OlSourceTileWMS()
        });
        const nestedLayerGroup = new OlLayerGroup({
          name: 'nestedLayerGroup',
          layers: [subLayer1, subLayer2]
        });
        layerGroup.getLayers().push(nestedLayerGroup);

        const wrapper = TestUtil.mountComponent(LayerTree, props);
        const oldOlListenerKey = wrapper.instance().olListenerKeys;
        OlObservable.unByKey = jest.fn();

        wrapper.instance().unregisterEventsByLayer(nestedLayerGroup);

        const newOlListenerKey = wrapper.instance().olListenerKeys;

        expect(OlObservable.unByKey).toHaveBeenCalledTimes(2);
        expect(newOlListenerKey.length).toBe(oldOlListenerKey.length - 2);
      });

    });

  });

  describe('#setLayerVisibility', () => {

    it('logs an error if called with invalid arguments', () => {
      const logSpy = jest.spyOn(Logger, 'error');
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);

      wrapper.instance().setLayerVisibility();
      expect(logSpy).toHaveBeenCalled();
      logSpy.mockReset();

      wrapper.instance().setLayerVisibility('peter');
      expect(logSpy).toHaveBeenCalled();
      logSpy.mockReset();

      wrapper.instance().setLayerVisibility(layer1 , 'peter');
      expect(logSpy).toHaveBeenCalled();

      logSpy.mockReset();
      logSpy.mockRestore();
    });

    it('sets the visibility of a single layer', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      layer1.setVisible(true);

      wrapper.instance().setLayerVisibility(layer1, false);
      expect(layer1.getVisible()).toBe(false);
      wrapper.instance().setLayerVisibility(layer1, true);
      expect(layer1.getVisible()).toBe(true);
    });

    it('sets the visibility only for the children when called with a layerGroup', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtil.mountComponent(LayerTree, props);
      layer1.setVisible(true);
      layer2.setVisible(true);

      wrapper.instance().setLayerVisibility(layerGroup, false);
      expect(layerGroup.getVisible()).toBe(true);
      expect(layer1.getVisible()).toBe(false);
      expect(layer2.getVisible()).toBe(false);

      wrapper.instance().setLayerVisibility(layerGroup, true);
      expect(layerGroup.getVisible()).toBe(true);
      expect(layer1.getVisible()).toBe(true);
      expect(layer2.getVisible()).toBe(true);
    });

  });

  // TODO rc-tree drop event seems to be broken in PhantomJS / cant be simulated
  describe('#onDrop', () => {

    // let props = {};
    //
    // beforeEach(() => {
    //   props = {
    //     layerGroup,
    //     map
    //   };
    //   const layer3 = new OlLayerTile({
    //     name: 'layer3',
    //     source: new OlSourceTileWMS()
    //   });
    //   const subLayer = new OlLayerTile({
    //     name: 'subLayer',
    //     source: new OlSourceTileWMS()
    //   });
    //   const nestedLayerGroup = new OlLayerGroup({
    //     name: 'nestedLayerGroup',
    //     layers: [subLayer]
    //   });
    //   props.layerGroup.getLayers().push(layer3);
    //   props.layerGroup.getLayers().push(nestedLayerGroup);
    // });
    //
    // it('can handle drop on leaf', () => {
    //   const wrapper = TestUtil.mountComponent(LayerTree, props);
    //   const firstNode = wrapper.childAt(0);
    //   const thirdNode = wrapper.childAt(2);
    //   const dragTarget = firstNode.find('.ant-tree-node-content-wrapper');
    //   const dropTarget = thirdNode.find('.react-geo-layertree-node');
    //
    //   console.log(props.layerGroup.getLayers().getLength());
    //   console.log(props.layerGroup.getLayers().item(0).get('name'));
    //   console.log(props.layerGroup.getLayers().item(1).get('name'));
    //   console.log(props.layerGroup.getLayers().item(2).get('name'));
    //   console.log(props.layerGroup.getLayers().item(3).get('name'));
    //
    //   debugger
    //
    //   console.log('--------');
    //   dragTarget.simulate('dragStart');
    //   dropTarget.simulate('dragOver');
    //   dropTarget.simulate('drop');
    //
    //   console.log(props.layerGroup.getLayers().getLength());
    //   console.log(props.layerGroup.getLayers().item(0).get('name'));
    //   console.log(props.layerGroup.getLayers().item(1).get('name'));
    //   console.log(props.layerGroup.getLayers().item(2).get('name'));
    //   console.log(props.layerGroup.getLayers().item(3).get('name'));
    //
    //
    // });

    // it('can handle drop before leaf', () => {
    //   const wrapper = TestUtil.mountComponent(LayerTree, props);
    //   const treeNodes = wrapper.children('TreeNode');
    //   const firstNode = treeNodes.get(0);
    //   const thirdNode = treeNodes.get(2);
    // });
    //
    // it('can handle drop after leaf', () => {
    //   const wrapper = TestUtil.mountComponent(LayerTree, props);
    //   const treeNodes = wrapper.children('TreeNode');
    //   const firstNode = treeNodes.get(0);
    //   const thirdNode = treeNodes.get(2);
    // });
    //
    // it('can handle drop on folder', () => {
    //   const wrapper = TestUtil.mountComponent(LayerTree, props);
    //   const treeNodes = wrapper.children('TreeNode');
    //   const firstNode = treeNodes.get(0);
    //   const folderNode = treeNodes.get(3);
    // });
  });

});

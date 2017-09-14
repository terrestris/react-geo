/*eslint-env mocha*/
import expect from 'expect.js';
import sinon from 'sinon';

import OlGroupLayer from 'ol/layer/group';
import OlTileLayer from 'ol/layer/tile';
import OlTileWMS from 'ol/source/tilewms';
import olObservable from 'ol/observable';

import TestUtils from '../Util/TestUtils';

import {
  Logger,
  LayerTree
} from '../index';

describe('<LayerTree />', () => {
  let layerGroup;
  let map;
  let layer1;
  let layer2;

  beforeEach(() => {
    const layerSource1 = new OlTileWMS();
    layer1 = new OlTileLayer({
      name: 'layer1',
      source: layerSource1
    });
    const layerSource2 = new OlTileWMS();
    layer2 = new OlTileLayer({
      name: 'layer2',
      visible: false,
      source: layerSource2
    });
    layerGroup = new OlGroupLayer({
      name: 'layerGroup',
      layers: [layer1, layer2]
    });

    map = TestUtils.createMap();
    map.setLayerGroup(layerGroup);
  });

  it('is defined', () => {
    expect(LayerTree).not.to.be(undefined);
  });

  it('can be rendered', () => {
    const wrapper = TestUtils.mountComponent(LayerTree);
    expect(wrapper).not.to.be(undefined);
  });

  it('unmount removes listeners', () => {
    const unByKeySpy = sinon.spy(olObservable, 'unByKey');
    const wrapper = TestUtils.mountComponent(LayerTree);
    const olListenerKeys = wrapper.instance().olListenerKeys;
    wrapper.unmount();
    expect(unByKeySpy.callCount).to.equal(1);
    expect(unByKeySpy.calledWith(olListenerKeys)).to.be.ok();

    unByKeySpy.restore();
  });

  it('CWR with new layerGroup rebuild listeners and treenodes ', () => {
    const props = {
      layerGroup,
      map
    };
    const wrapper = TestUtils.mountComponent(LayerTree, props);

    const subLayer = new OlTileLayer({
      name: 'subLayer',
      source: new OlTileWMS()
    });
    const nestedLayerGroup = new OlGroupLayer({
      name: 'nestedLayerGroup',
      layers: [subLayer]
    });

    expect(wrapper.instance().olListenerKeys).to.have.length(4);
    wrapper.setProps({
      layerGroup: nestedLayerGroup
    });
    expect(wrapper.instance().olListenerKeys).to.have.length(3);
  });

  describe('<TreeNode> creation', () => {

    it('adds a <TreeNode> for every child', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtils.mountComponent(LayerTree, props);
      const treeNodes = wrapper.children('TreeNode');

      expect(treeNodes).to.have.length(layerGroup.getLayers().getLength());
    });

    // TODO This test could be better if the TreeNodes where iterable, but they
    // are not. See comment below.
    it('can handle nested `ol.layer.group`s', () => {
      const props = {
        layerGroup,
        map
      };
      const subLayer = new OlTileLayer({
        name: 'subLayer',
        source: new OlTileWMS()
      });
      const nestedLayerGroup = new OlGroupLayer({
        name: 'nestedLayerGroup',
        layers: [subLayer]
      });
      layerGroup.getLayers().push(nestedLayerGroup);

      const wrapper = TestUtils.mountComponent(LayerTree, props);
      const treeNodes = wrapper.children('TreeNode');

      // It is not an instanceof TreeNode see: https://github.com/ant-design/ant-design/issues/4688
      const subNode = treeNodes.nodes[2].props.children[0];
      expect(subNode.props.title).to.eql(subLayer.get('name'));
    });

    it('sets the right titles for the layers', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtils.mountComponent(LayerTree, props);
      const treeNodes = wrapper.children('TreeNode');
      treeNodes.forEach((node, index) => {
        const layer = layerGroup.getLayers().item(index);
        expect(node.props().title).to.eql(layer.get('name'));
      });
    });

    it('sets the right keys for the layers', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtils.mountComponent(LayerTree, props);
      const treeNodes = wrapper.children('TreeNode');

      treeNodes.forEach((node, index) => {
        const layer = layerGroup.getLayers().item(index);
        expect(node.props().eventKey).to.have.eql(layer.ol_uid);
      });
    });

    it('sets visible layers as checked', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtils.mountComponent(LayerTree, props);
      const treeNodes = wrapper.children('TreeNode');

      treeNodes.forEach((node, index) => {
        const layer = layerGroup.getLayers().item(index);
        expect(layer.getVisible()).to.eql(node.props().checked);
      });
    });

    describe('#treeNodeFromLayer', () => {

      it('logs an error if called with an invisible layergroup', () => {
        const props = {
          layerGroup,
          map
        };
        layerGroup.setVisible(false);

        const logSpy = sinon.spy(Logger, 'warn');
        const wrapper = TestUtils.mountComponent(LayerTree, props);
        wrapper.instance().treeNodeFromLayer(layerGroup);

        expect(logSpy).to.have.property('callCount', 1);

        logSpy.restore();
        layerGroup.setVisible(true);
      });

      it('returns a TreeNode when called with a layer', () => {
        const props = {
          layerGroup,
          map
        };
        layerGroup.setVisible(false);

        const wrapper = TestUtils.mountComponent(LayerTree, props);
        const treeNode = wrapper.instance().treeNodeFromLayer(layer1);

        expect(treeNode.props.title).to.eql(layer1.get('name'));
        expect(treeNode.key).to.eql(layer1.ol_uid);
      });
    });
  });

  describe('#onCheck', () => {

    it('sets the correct visibility to the layer from the checked state', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtils.mountComponent(LayerTree, props);
      const treeNodes = wrapper.children('TreeNode');

      treeNodes.forEach((node, index) => {
        const layer = layerGroup.getLayers().item(index);
        const checkBox = node.find('.ant-tree-checkbox');
        const wasChecked = node.props().checked;
        const wasVisible = layer.getVisible();
        checkBox.simulate('click');
        expect(wasVisible).to.eql(!layer.getVisible());
        expect(wasChecked).to.eql(!node.props().checked);
      });
    });
  });

  describe('event handling', () => {

    it('sets checked state corresponding to layer.setVisible', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtils.mountComponent(LayerTree, props);
      const treeNode = wrapper.childAt(0).node;

      expect(treeNode.props.checked).to.be(true);
      layer1.setVisible(false);
      expect(treeNode.props.checked).to.be(false);
      layer1.setVisible(true);
      expect(treeNode.props.checked).to.be(true);
    });

    it('triggers tree rebuild on layer add', () => {
      const props = {
        layerGroup,
        map
      };
      const layer = new OlTileLayer({
        source: new OlTileWMS()
      });
      const wrapper = TestUtils.mountComponent(LayerTree, props);
      const rebuildSpy = sinon.spy(wrapper.instance(), 'rebuildTreeNodes');

      layerGroup.getLayers().push(layer);
      expect(rebuildSpy.callCount).to.equal(1);

      rebuildSpy.restore();
    });

    it('… also registers add/remove events for added groups ', () => {
      const props = {
        layerGroup,
        map
      };
      const layer = new OlTileLayer({
        source: new OlTileWMS()
      });
      const group = new OlGroupLayer({
        layers: [layer]
      });
      const wrapper = TestUtils.mountComponent(LayerTree, props);
      const rebuildSpy = sinon.spy(wrapper.instance(), 'rebuildTreeNodes');
      const registerSpy = sinon.spy(wrapper.instance(), 'registerAddRemoveListeners');

      layerGroup.getLayers().push(group);
      expect(rebuildSpy.callCount).to.equal(1);
      expect(registerSpy.callCount).to.equal(1);

      rebuildSpy.restore();
      registerSpy.restore();
    });

    it('trigger unregisterEventsByLayer and rebuildTreeNodes for removed layers ', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtils.mountComponent(LayerTree, props);
      const rebuildSpy = sinon.spy(wrapper.instance(), 'rebuildTreeNodes');
      const unregisterSpy = sinon.spy(wrapper.instance(), 'unregisterEventsByLayer');

      layerGroup.getLayers().remove(layer1);
      expect(rebuildSpy.callCount).to.equal(1);
      expect(unregisterSpy.callCount).to.equal(1);

      rebuildSpy.restore();
      unregisterSpy.restore();
    });

    it('… unregister recursively for removed groups', () => {
      const props = {
        layerGroup,
        map
      };
      const subLayer1 = new OlTileLayer({
        source: new OlTileWMS()
      });
      const subLayer2 = new OlTileLayer({
        source: new OlTileWMS()
      });
      const nestedLayerGroup = new OlGroupLayer({
        name: 'nestedLayerGroup',
        layers: [subLayer1, subLayer2]
      });
      layerGroup.getLayers().push(nestedLayerGroup);

      const wrapper = TestUtils.mountComponent(LayerTree, props);
      const rebuildSpy = sinon.spy(wrapper.instance(), 'rebuildTreeNodes');
      const unregisterSpy = sinon.spy(wrapper.instance(), 'unregisterEventsByLayer');

      layerGroup.getLayers().remove(nestedLayerGroup);
      expect(rebuildSpy.callCount).to.equal(1);
      expect(unregisterSpy.callCount).to.equal(3);

      rebuildSpy.restore();
      unregisterSpy.restore();
    });

    describe('#unregisterEventsByLayer', () => {

      it('removes the listener and the eventKey from olListenerKeys', () => {
        const props = {
          layerGroup,
          map
        };
        const subLayer1 = new OlTileLayer({
          source: new OlTileWMS()
        });
        const subLayer2 = new OlTileLayer({
          source: new OlTileWMS()
        });
        const nestedLayerGroup = new OlGroupLayer({
          name: 'nestedLayerGroup',
          layers: [subLayer1, subLayer2]
        });
        layerGroup.getLayers().push(nestedLayerGroup);

        const wrapper = TestUtils.mountComponent(LayerTree, props);
        const oldOlListenerKey = wrapper.instance().olListenerKeys;
        const unByKeySpy = sinon.spy(olObservable, 'unByKey');

        wrapper.instance().unregisterEventsByLayer(subLayer1);

        const newOlListenerKey = wrapper.instance().olListenerKeys;

        expect(unByKeySpy.callCount).to.equal(1);
        expect(newOlListenerKey.length).to.equal(oldOlListenerKey.length - 1);

        unByKeySpy.restore();
      });

      it('… of children for groups', () => {
        const props = {
          layerGroup,
          map
        };
        const subLayer1 = new OlTileLayer({
          source: new OlTileWMS()
        });
        const subLayer2 = new OlTileLayer({
          source: new OlTileWMS()
        });
        const nestedLayerGroup = new OlGroupLayer({
          name: 'nestedLayerGroup',
          layers: [subLayer1, subLayer2]
        });
        layerGroup.getLayers().push(nestedLayerGroup);

        const wrapper = TestUtils.mountComponent(LayerTree, props);
        const oldOlListenerKey = wrapper.instance().olListenerKeys;
        const unByKeySpy = sinon.spy(olObservable, 'unByKey');

        wrapper.instance().unregisterEventsByLayer(nestedLayerGroup);

        const newOlListenerKey = wrapper.instance().olListenerKeys;

        expect(unByKeySpy.callCount).to.equal(2);
        expect(newOlListenerKey.length).to.equal(oldOlListenerKey.length - 2);

        unByKeySpy.restore();
      });

    });

  });

  describe('#setLayerVisibility', () => {

    it('logs an error if called with invalid arguments', () => {
      const logSpy = sinon.spy(Logger, 'error');
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtils.mountComponent(LayerTree, props);

      wrapper.instance().setLayerVisibility();
      expect(logSpy.callCount).to.equal(1);
      wrapper.instance().setLayerVisibility('peter');
      expect(logSpy.callCount).to.equal(2);
      wrapper.instance().setLayerVisibility(layer1 , 'peter');
      expect(logSpy.callCount).to.equal(3);
    });

    it('sets the visibility of a single layer', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtils.mountComponent(LayerTree, props);
      layer1.setVisible(true);

      wrapper.instance().setLayerVisibility(layer1, false);
      expect(layer1.getVisible()).to.be(false);
      wrapper.instance().setLayerVisibility(layer1, true);
      expect(layer1.getVisible()).to.be(true);
    });

    it('sets the visibility only for the children when called with a layerGroup', () => {
      const props = {
        layerGroup,
        map
      };
      const wrapper = TestUtils.mountComponent(LayerTree, props);
      layer1.setVisible(true);
      layer2.setVisible(true);

      wrapper.instance().setLayerVisibility(layerGroup, false);
      expect(layerGroup.getVisible()).to.be(true);
      expect(layer1.getVisible()).to.be(false);
      expect(layer2.getVisible()).to.be(false);

      wrapper.instance().setLayerVisibility(layerGroup, true);
      expect(layerGroup.getVisible()).to.be(true);
      expect(layer1.getVisible()).to.be(true);
      expect(layer2.getVisible()).to.be(true);
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
    //   const layer3 = new OlTileLayer({
    //     name: 'layer3',
    //     source: new OlTileWMS()
    //   });
    //   const subLayer = new OlTileLayer({
    //     name: 'subLayer',
    //     source: new OlTileWMS()
    //   });
    //   const nestedLayerGroup = new OlGroupLayer({
    //     name: 'nestedLayerGroup',
    //     layers: [subLayer]
    //   });
    //   props.layerGroup.getLayers().push(layer3);
    //   props.layerGroup.getLayers().push(nestedLayerGroup);
    // });
    //
    // it('can handle drop on leaf', () => {
    //   const wrapper = TestUtils.mountComponent(LayerTree, props);
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
    //   const wrapper = TestUtils.mountComponent(LayerTree, props);
    //   const treeNodes = wrapper.children('TreeNode');
    //   const firstNode = treeNodes.get(0);
    //   const thirdNode = treeNodes.get(2);
    // });
    //
    // it('can handle drop after leaf', () => {
    //   const wrapper = TestUtils.mountComponent(LayerTree, props);
    //   const treeNodes = wrapper.children('TreeNode');
    //   const firstNode = treeNodes.get(0);
    //   const thirdNode = treeNodes.get(2);
    // });
    //
    // it('can handle drop on folder', () => {
    //   const wrapper = TestUtils.mountComponent(LayerTree, props);
    //   const treeNodes = wrapper.children('TreeNode');
    //   const firstNode = treeNodes.get(0);
    //   const folderNode = treeNodes.get(3);
    // });
  });

});

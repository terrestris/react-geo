import * as React from 'react';

import TestUtil from '../../Util/TestUtil';

import { onDropAware } from './DropTargetMap';

import FileUtil from '@terrestris/ol-util/dist/FileUtil/FileUtil';

describe('onDropAware', () => {
  let EnhancedComponent;

  /* eslint-disable require-jsdoc */
  class MockComponent extends React.Component {
    render() {
      return (
        <div>A mock Component</div>
      );
    }
  }
  /* eslint-enable require-jsdoc */

  beforeEach(() => {
    EnhancedComponent = onDropAware(MockComponent);
  });

  describe('Basics', () => {
    it('is defined', () => {
      expect(onDropAware).not.toBeUndefined();
    });

    it('can be rendered', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent, {
        map: TestUtil.createMap()
      });

      expect(wrapper).not.toBeUndefined();
      expect(wrapper.first().is(EnhancedComponent)).toBe(true);
    });

    it('passes through all props', () => {
      const props = {
        someProp: '09',
        map: TestUtil.createMap()
      };
      const wrapper = TestUtil.mountComponent(EnhancedComponent, props);
      const instance = wrapper.instance();

      expect(instance.props.someProp).toEqual('09');
    });
  });

  describe('#onDrop', () => {

    it('calls the FileUtil.addShpLayerFromFile when called with a zip', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent, {
        map: TestUtil.createMap()
      });
      const file = {
        name: 'peter.zip'
      };
      const mockEvent = {
        dataTransfer: {
          files: [file]
        },
        preventDefault: () => {}
      };
      FileUtil.addShpLayerFromFile = jest.fn();
      const mockFunction = FileUtil.addShpLayerFromFile;

      wrapper.instance().onDrop(mockEvent);

      expect(mockFunction).toHaveBeenCalledTimes(1);
      expect(mockFunction).toHaveBeenCalledWith(file, wrapper.prop('map'));
    });

    it('calls the FileUtil.addGeojsonLayerFromFile for all other files', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent, {
        map: TestUtil.createMap()
      });
      const file = {
        name: 'peter.json'
      };
      const mockEvent = {
        dataTransfer: {
          files: [file]
        },
        preventDefault: () => {}
      };
      FileUtil.addGeojsonLayerFromFile = jest.fn();
      const mockFunction = FileUtil.addGeojsonLayerFromFile;

      wrapper.instance().onDrop(mockEvent);

      expect(mockFunction).toHaveBeenCalledTimes(1);
      expect(mockFunction).toHaveBeenCalledWith(file, wrapper.prop('map'));
    });
  });

  describe('#onDragOver', () => {
    it('calls preventDefault on the event', () => {
      const wrapper = TestUtil.mountComponent(EnhancedComponent, {
        map: TestUtil.createMap()
      });
      const mockFunction = jest.fn();
      const mockEvent = {
        preventDefault: mockFunction
      };

      wrapper.instance().onDragOver(mockEvent);

      expect(mockFunction).toHaveBeenCalledTimes(1);
    });
  });
});

import Window from './Window';
import TestUtil from '../Util/TestUtil';

import Logger from '@terrestris/base-util/dist/Logger';

describe('<Window />', () => {

  it('is defined', () => {
    expect(Window).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const testIdToMountIn = 'testAppId';
    const divToBeRenderedIn = document.createElement('div');
    divToBeRenderedIn.id = testIdToMountIn;
    document.body.appendChild(divToBeRenderedIn);
    const wrapper = TestUtil.mountComponent(Window, {
      parentId: testIdToMountIn
    });
    expect(wrapper).not.toBeUndefined();
  });

  it('warns if no parentId is provided', () => {

    const loggerSpy = jest.spyOn(Logger, 'warn');

    TestUtil.mountComponent(Window, {});

    expect(loggerSpy).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith('No parent element was found! ' +
      'Please ensure that parentId parameter was set correctly (default ' +
      'value is `app`)');

    loggerSpy.mockRestore();
  });

  it('is completely removed from parent if component is unmounted', () => {
    const testIdToMountIn = 'testAppId';
    const windowId = 'nice-window';
    const otherId = 'other';
    const divToBeRenderedIn = document.createElement('div');
    const divContainingOtherContent = document.createElement('div');
    divContainingOtherContent.id = otherId;
    divToBeRenderedIn.id = testIdToMountIn;
    document.body.appendChild(divToBeRenderedIn);
    document.body.appendChild(divContainingOtherContent);
    const wrapper = TestUtil.mountComponent(Window, {
      parentId: testIdToMountIn,
      id: windowId
    });

    expect(document.getElementById(windowId)).toBeDefined();
    expect(document.getElementById(windowId).id).toBe(windowId);

    // unmount
    wrapper.instance().componentWillUnmount();

    expect(document.getElementById(windowId)).toBeNull();
  });

  it('changes class of component when className is changed in props', () => {
    const testIdToMountIn = 'testAppId';
    const windowId = 'testId1';
    let className = 'test1';
    const divToBeRenderedIn = document.createElement('div');
    divToBeRenderedIn.id = testIdToMountIn;
    document.body.appendChild(divToBeRenderedIn);
    const wrapper = TestUtil.mountComponent(Window, {
      parentId: testIdToMountIn,
      className: className,
      id: windowId
    });
    expect(document.getElementById(windowId)).toBeDefined();
    expect(document.getElementById(windowId).className).toEqual(expect.stringContaining(className));
    className = 'test2';
    wrapper.setProps({
      className: className
    });
    expect(document.getElementById(windowId).className).toEqual(expect.stringContaining(className));
  });

});

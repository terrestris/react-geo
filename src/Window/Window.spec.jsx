/*eslint-env jest*/
import { Window } from '../index';
import TestUtil from '../Util/TestUtil';

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

});

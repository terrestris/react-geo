/*eslint-env jest*/
import { LayerTreeNode } from '../index';
import TestUtil from '../Util/TestUtil';

describe('<LayerTreeNode />', () => {

  const defaultProps = {
    inResolutionRange: true,
    filterTreeNode: ftn => ftn
  };

  it('is defined', () => {
    expect(LayerTreeNode).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const wrapper = TestUtil.mountComponent(LayerTreeNode, defaultProps);
    expect(wrapper).not.toBeUndefined();
  });
});

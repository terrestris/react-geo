import * as React from 'react';
import LayerTreeNode from './LayerTreeNode';
import Tree from 'rc-tree';
import { mount } from 'enzyme';

describe('<LayerTreeNode />', () => {

  const defaultProps = {
    inResolutionRange: true,
    filterTreeNode: ftn => ftn
  };

  it('is defined', () => {
    expect(LayerTreeNode).not.toBeUndefined();
  });

  it('can be rendered (inside a Tree component)', () => {
    const Cmp = (
      <Tree>
        <LayerTreeNode {...defaultProps} />
      </Tree>
    );

    const wrapper = mount(Cmp);
    expect(wrapper).not.toBeUndefined();
  });
});

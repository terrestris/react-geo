import { mount } from 'enzyme';
import Tree from 'rc-tree';
import * as React from 'react';

import LayerTreeNode from './LayerTreeNode';

describe('<LayerTreeNode />', () => {

  const defaultProps = {
    inResolutionRange: true,
    filterTreeNode: jest.fn()
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

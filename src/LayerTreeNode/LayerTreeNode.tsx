import React from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

import './LayerTreeNode.less';

import { CSS_PREFIX } from '../constants';
import { AntTreeNodeProps } from 'antd/lib/tree';

export interface LayerTreeNodeProps extends AntTreeNodeProps {
  inResolutionRange: boolean;
}

/**
 * Class representing a layer tree node
 */
class LayerTreeNode extends React.PureComponent<LayerTreeNodeProps> {

  /**
   * The render function.
   *
   * @return {Element} The element.
   */
  render() {
    const {
      inResolutionRange,
      children,
      ...passThroughProps
    } = this.props;

    const isFolder = Array.isArray(children) && children.length > 0;
    let addClassName = (inResolutionRange ? 'within' : 'out-off') + '-range';
    addClassName += isFolder ? ' tree-folder' : ' tree-leaf';
    const finalClassname = `${CSS_PREFIX}layertree-node ${addClassName}`;

    return(
      <TreeNode
        className={finalClassname}
        {...passThroughProps}
      >
        {children}
      </TreeNode>
    );
  }

}

// Otherwise rc-tree wouldn't recognize this component as TreeNode, see
// https://github.com/react-component/tree/blob/master/src/TreeNode.jsx#L543
LayerTreeNode.isTreeNode = 1;

export default LayerTreeNode;

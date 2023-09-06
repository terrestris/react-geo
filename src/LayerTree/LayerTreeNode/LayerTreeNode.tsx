import { Tree } from 'antd';
import * as React from 'react';
const TreeNode = Tree.TreeNode;

import './LayerTreeNode.less';

import { AntTreeNodeProps } from 'antd/lib/tree';

import { CSS_PREFIX } from '../../constants';

export interface BaseProps {
  inResolutionRange?: boolean;
}

export type LayerTreeNodeProps = BaseProps & AntTreeNodeProps;

/**
 * Class representing a layer tree node
 */
class LayerTreeNode extends React.PureComponent<LayerTreeNodeProps> {

  static isTreeNode: number;

  /**
   * The render function.
   *
   * @return The element.
   */
  render() {
    const {
      inResolutionRange,
      children,
      icon,
      ...passThroughProps
    } = this.props;

    const isFolder = Array.isArray(children) && children.length > 0;
    let addClassName = (inResolutionRange ? 'within' : 'out-off') + '-range';
    addClassName += isFolder ? ' tree-folder' : ' tree-leaf';
    const finalClassname = `${CSS_PREFIX}layertree-node ${addClassName}`;

    return (
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

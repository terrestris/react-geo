import React from 'react';
import {
  Tree
} from 'antd';
const TreeNode = Tree.TreeNode;

import './LayerTreeNode.less';

/**
 *
 */
class LayerTreeNode extends React.Component {

  /**
   * The prop types.
   * @type {Object}
   */
  static propTypes = {
  }

  /**
   * The constructor.
   *
   * @param {Object} props The initial props.
   */
  constructor(props) {
    super(props);
  }

  /**
   * The render function.
   *
   * @return {Element} The element.
   */
  render() {
    const {
      ...passThroughProps
    } = this.props;

    return(
      <TreeNode
        className="react-geo-layertree-node"
        {...passThroughProps}
      />
    );
  }

}

// Otherwise rc-tree wouldn't recognize this component as TreeNode, see
// https://github.com/react-component/tree/blob/master/src/TreeNode.jsx#L328
LayerTreeNode.isTreeNode = 1;

export default LayerTreeNode;

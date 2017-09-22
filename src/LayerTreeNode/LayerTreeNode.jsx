import React from 'react';
import PropTypes from 'prop-types';
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
    inResolutionRange: PropTypes.boolean
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
      inResolutionRange,
      ...passThroughProps
    } = this.props;

    const addClassName = (inResolutionRange ? 'within' : 'out-off') + '-range';
    const finalClassname = `react-geo-layertree-node ${addClassName}`;
    return(
      <TreeNode
        className={finalClassname}
        {...passThroughProps}
      />
    );
  }

}

// Otherwise rc-tree wouldn't recognize this component as TreeNode, see
// https://github.com/react-component/tree/blob/master/src/TreeNode.jsx#L328
LayerTreeNode.isTreeNode = 1;

export default LayerTreeNode;

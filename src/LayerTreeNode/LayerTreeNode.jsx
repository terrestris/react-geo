import React from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

import './LayerTreeNode.less';

import { CSS_PREFIX } from '../constants';

/**
 * Class representing a layer tree node
 */
class LayerTreeNode extends React.Component {

  /**
   * The prop types.
   * @type {Object}
   */
  static propTypes = {
    inResolutionRange: PropTypes.bool
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
    const finalClassname = `${CSS_PREFIX}layertree-node ${addClassName}`;
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

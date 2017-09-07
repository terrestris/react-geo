import React from 'react';
import PropTypes from 'prop-types';
import './Toolbar.less';

/**
 * A base class representating a toolbar having n children
 * The child components of this toolbar can be aligned in vertical and
 * horizontal (default) way
 *
 * @class The Toolbar
 * @extends React.Component
 */
class Toolbar extends React.Component {

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * The children.
     * @type {Array}
     */
    children: PropTypes.node,

    /**
     * The alignment of the sub components.
     * @type {String}
     */
    alignment: PropTypes.oneOf(['horizontal', 'vertical']),

    /**
     * An object containing style informations. Applied to Toolbar.
     * @type {Boolean}
     */
    style: PropTypes.object
  }

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    children: [],
    alignment: 'horizontal'
  }

  /**
   * The render function
   */
  render() {
    const {style} = this.props;
    return (
      <div className={this.props.alignment + '-toolbar'} style={style}>
        {this.props.children}
      </div>
    );
  }
}

export default Toolbar;

import React from 'react';
import PropTypes from 'prop-types';

import './Titlebar.less';

/**
 * Class representating the titlebar. Usually used in a panel.
 *
 * @class The TitleBar
 * @extends React.Component
 */
export class Titlebar extends React.Component {

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * The className which should be added.
     * @type {String}
     */
    className: PropTypes.string,
    /**
     * The children to show in the Window.
     * @type {node}
     */
    children: PropTypes.node,
    /**
     * The dispatch function.
      @type {Function}
     */
    dispatch: PropTypes.func,
    /**
     * The object of the parent container of the titlebar class.
     * @type {object}
     */
    parent: PropTypes.object,
    /**
     * Additional elements display besides the collapseButton.
     * @type {Array<object>}
     */
    tools: PropTypes.arrayOf(PropTypes.element),
    /**
     * Whether to allow collasping or not.
     * @type {boolean}
     */
    collapsible: PropTypes.bool,
    /**
     * Whether to allow closing or not.
     * @type {boolean}
     */
    closable: PropTypes.bool,

    /**
     * The tooltip of the compress button.
     * @type {String}
     */
    compressTooltip: PropTypes.string,

    /**
     * The tooltip of the close button.
     * @type {String}
     */
    closeTooltip: PropTypes.string

  }

  /**
   * The default props
   */
  static defaultProps = {
    compressTooltip: 'compress',
    closeTooltip: 'close'
  }

  /**
   * The render function.
   */
  render() {
    let {
      className,
      tools
    } = this.props;
    className = className ? className + ' titlebar' : 'titlebar';

    return (
      <div className={className}>
        <span className="title">
          {this.props.children}
        </span>
        <span className="controls">
          {tools}
        </span>
      </div>
    );
  }
}

export default Titlebar;

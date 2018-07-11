import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId.js';

import Panel from  '../Panel/Panel/Panel.jsx';
import { Logger } from '@terrestris/base-util';
import { CSS_PREFIX } from '../constants';

import './Window.less';

/**
 * Window component that creates a React portal that renders children into a DOM
 * node that exists outside the DOM hierarchy of the parent component. By default,
 * Window Component is draggable.
 *
 * @class Window
 * @extends React.Component
 */
export class Window extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}window-portal`

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * id of the component
     * will be filled automatically if not provided
     * @type {String}
     */
    id: PropTypes.string,
    /**
     * The id of the parent component
     * default: app
     *
     * @type {String}
     */
    parentId: PropTypes.string.isRequired,
    /**
     * An optional CSS class which should be added.
     * @type {String}
     */
    className: PropTypes.string,
    /**
     * The children to show in the Window.
     * @type {node}
     */
    children: PropTypes.node,
    /**
     * The title text to be shown in the window header.
     * @type {string}
     */
    title: PropTypes.string
  }

  static defaultProps = {
    parentId: 'app',
    title: 'Window',
    resizeOpts: true,
    collapsible: true,
    draggable: true
  }

  /**
   * Create a Window.
   * @constructs Window
   */
  constructor(props) {
    super(props);
    const id = props.id || uniqueId('window-');

    const { parentId } = this.props;
    this._parent = document.getElementById(parentId);

    if (!this._parent) {
      Logger.warn('No parent element was found! Please ensure that parentId ' +
      'parameter was set correctly (default value is `app`)');
    }

    const finalClassName = props.className
      ? `${props.className} ${this.className}`
      : this.className;

    const div = document.createElement('div');
    div.id = id;
    div.className = finalClassName;
    this._elementDiv = div;

    this.state = {
      id: id,
      resizing: false
    };
  }

  /**
   * The portal element is inserted in the DOM tree after
   * the Windows's children are mounted, meaning that children
   * will be mounted on a detached DOM node. If a child
   * component requires to be attached to the DOM tree
   * immediately when mounted, for example to measure a
   * DOM node, or uses 'autoFocus' in a descendant, add
   * state to Window and only render the children when Window
   * is inserted in the DOM tree.
   */
  componentDidMount() {
    if (this._parent) {
      this._parent.appendChild(this._elementDiv);
    }
  }

  /**
   * componentWillUnmount - remove child from parent element
   */
  componentWillUnmount() {
    if (this._parent) {
      this._parent.removeChild(this._elementDiv);
    }
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      children,
      parentId,
      ...passThroughProps
    } = this.props;

    return ReactDOM.createPortal(
      <Panel {...passThroughProps} >
        {children}
      </Panel>,
      this._elementDiv,
    );
  }
}

export default Window;

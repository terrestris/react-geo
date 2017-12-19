import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import { Panel } from  '../index.js';

import './Window.less';

/**
 * Window component that creates a React portal that renders children into a DOM
 * node that exists outside the DOM hierarchy of the parent component. By default,
 * Window Component is draggable and closable
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
  className = 'react-geo-window-portal'

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
    * The className which should be added.
    *
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
    title: PropTypes.string,
    /**
    * Function to be called if window is closed
    * @type {Function}
    */
    onClose: PropTypes.func
  }

  static defaultProps = {
    parentId: 'app',
    title: 'Window',
    resizeOpts: true,
    onClose: () => {} // default: do nothing
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

    const div = document.createElement('div');
    div.id = id;
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
    this._parent.appendChild(this._elementDiv);
  }

  /**
   * componentWillUnmount - remove child from parent element
   */
  componentWillUnmount() {
    this._parent.removeChild(this._elementDiv);
  }

  /**
   * The render function.
   */
  render() {
    const {
      className,
      children,
      onClose,
      ...rndOpts
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;
    const rndClassName = `${finalClassName} ${this.state.id}`;

    return ReactDOM.createPortal(
      <Panel
        closable
        draggable
        className={rndClassName}
        onClose={onClose}
        {...rndOpts}
      >
        {children}
      </Panel>,
      this._elementDiv,
    );
  }
}

export default Window;

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Rnd from 'react-rnd';
import { uniqueId, isNumber } from 'lodash';
import { I18nextProvider } from 'react-i18next';

import Titlebar from '../Titlebar/Titlebar.jsx';
import SimpleButton from '../../Button/SimpleButton/SimpleButton.jsx';

import './Panel.less';

const defaultWindowProps = {
  draggable: true,
  closable: true,
  collapsible: true,
  resizeOpts: true,
  width: 400,
  height: 400
};

/**
 * The Panel.
 * The panel component can also be used as a window.
 *
 * You can create a window like this:
 *
 * let winPromise = Panel.showWindow({
 *   title: 'Window Title',
 *   children: ['Peter']
 * });
 * winPromise.then(function(win) {
 *   console.log('The window was rendered: ', win);
 * });
 *
 * @class The Panel
 * @extends React.Component
 */
export class Panel extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = 'react-geo-panel'

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {

    id: PropTypes.string,

    /**
     * Optional additional className that will be added to rnd.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * The dispatch function.
      @type {Function}
     */
    dispatch: PropTypes.func,

    /**
     * The children to show in the Window.
     * @type {node}
     */
    children: PropTypes.node,

    /**
     * The title text to be shown in the window Header.
     * @type {string}
     */
    title: PropTypes.string,

    /**
     * The enableResizing property is used to set the resizable permission of a
     * resizable component.
     * The permission of top, right, bottom, left, topRight, bottomRight,
     * bottomLeft, topLeft direction resizing. If omitted, all resizer are
     * enabled. If you want to permit only right direction resizing, set {
     *   top:false,
     *   right:true,
     *   bottom:false,
     *   left:false,
     *   topRight:false,
     *   bottomRight:false,
     *   bottomLeft:false,
     *   topLeft:false
     * }.
     * @type {object}
     */
    resizeOpts: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]),

    /**
     * Whether to allow dragging or not.
     * @type {boolean}
     */
    draggable: PropTypes.bool,

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
     * The height of the panel.
     * @type {number}
     */
    height: PropTypes.number,

    /**
     * The width of the panel.
     * @type {number}
     */
    width: PropTypes.number,

    /**
     * The height of the TitleBar.
     * @type {number}
     */
    titleBarHeight: PropTypes.number,

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
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    draggable: false,
    collapsible: false,
    closable: false,
    resizeOpts: false,
    titleBarHeight: 32,
    height: 100,
    width: 100,
    compressTooltip: 'collapse',
    closeTooltip: 'close'
  }

  /**
   * Create the SimpleButton.
   *
   * @constructs SimpleButton
   */
  constructor(props) {
    super(props);
    const id = props.id || uniqueId('panel-');
    this.state = {
      id: id,
      collapsed: false,
      titleBarHeight: this.props.title ? props.titleBarHeight : 0,
      height: props.height,
      width: props.width,
      resizing: false
    };
  }

  /**
   * Toggles the collapse state of the panel.
   */
  toggleCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    }, () => {
      this.panel.updateSize({
        height: this.state.collapsed
          ? this.state.titleBarHeight
          : this.state.height,
        width: this.state.width
      });
    });
  }

  /**
   * Function called while resizing.
   *
   * @param {MouseEvent|TouchEvent} evt The MouseEvent event.
   * @param {String} direction A string discribing where the element was grabed.
   * @param {HTMLElement} el The element which gets resized.
   */
  onResize = (evt, direction, el) => {
    this.setState({
      height: el.clientHeight,
      width: el.clientWidth
    });
  }

  /**
   * Function called when resizing is started.
   */
  onResizeStart = () => {
    this.setState({
      resizing: true
    });
  }

  /**
   * Function called when resizing is stopped.
   */
  onResizeStop = () => {
    this.setState({
      resizing: false
    });
  }

  // TODO We might want to change the behaviour for panels that are no windows.
  /**
   * Close the panel and remove it from the dom.
   */
  close = () => {
    let div = document.getElementById(this.state.id);
    if (div) {
      ReactDOM.unmountComponentAtNode(div);
    } else {
      div = document.getElementsByClassName(this.state.id)[0];
    }

    div.parentElement.removeChild(div);
  }

  /**
   * The render function.
   */
  render() {
    const {
      closable,
      collapsible,
      draggable,
      resizeOpts,
      className,
      ...rndOpts
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    const rndClassName = `${finalClassName} ${this.state.id}`;
    const disableDragging = !draggable;
    const enableResizing = resizeOpts === true ? undefined : resizeOpts;

    let tools = [];
    if (collapsible) {
      tools.push(<SimpleButton
        icon="compress"
        key="compress-tool"
        onClick={this.toggleCollapse}
        tooltip={this.props.compressTooltip}
        size="small"
      />);
    }
    if (closable) {
      tools.push(<SimpleButton
        icon="times"
        key="close-tool"
        onClick={this.close}
        tooltip={this.props.closeTooltip}
        size="small"
      />);
    }

    const titleBar = this.props.title ? <Titlebar
      className="drag-handle"
      closable={closable}
      collapsible={collapsible}
      parent={this}
      compressTooltip={this.props.compressTooltip}
      closeTooltip={this.props.closeTooltip}
      tools={tools}
      style={{
        height: this.state.titleBarHeight,
        cursor: draggable ? 'move' : 'default'
      }}
    >
      {this.props.title}
    </Titlebar> : null;

    return (
      <Rnd
        className={rndClassName}
        ref={(panel) => { this.panel = panel; }}
        default={{
          x: isNumber(rndOpts.x) ? rndOpts.x : (window.innerWidth / 2) - 160,
          y: isNumber(rndOpts.y) ? rndOpts.y : (window.innerHeight / 2) - 100,
          width: rndOpts.width || 160,
          height: this.state.collapsed
            ? this.state.titleBarHeight
            : this.state.height
        }}
        dragHandlerClassName=".drag-handle"
        disableDragging={disableDragging}
        enableResizing={enableResizing}
        resizeHandleClasses={{
          bottom: 'resize-handle resize-handle-bottom',
          bottomLeft: 'resize-handle resize-handle-bottom-left',
          bottomRight: 'resize-handle resize-handle-bottom-right',
          left: 'resize-handle resize-handle-left',
          right: 'resize-handle resize-handle-right',
          top: 'resize-handle resize-handle-top',
          topLeft: 'resize-handle resize-handle-top-left',
          topRight: 'resize-handle resize-handle-top-right'
        }}
        onResize={this.onResize}
        onResizeStart={this.onResizeStart}
        onResizeStop={this.onResizeStop}
        {...rndOpts}
      >
        {titleBar}
        <div
          className="body"
          style={{
            cursor: 'default',
            overflow: 'hidden',
            height: this.state.collapsed
              ? '0px'
              : this.state.height - this.state.titleBarHeight,
            transition: this.state.resizing ? '' : 'height 0.25s',
          }}
        >
          {this.props.children}
        </div>
      </Rnd>
    );
  }
}

/**
 * This static method creates a window and adds it to the container with the id
 * props.containerId.
 * e.g.:
 * let winPromise = Panel.showWindow({
 *   title: 'Window Title',
 *   children: ['Peter']
 * });
 * winPromise.then(function(win) {
 *   console.log('The window was rendered: ', win);
 * });
 *
 * @param {Object} props The props added to the window on creation.
 *                       Use 'children' to add child elements to the body of the
 *                       window.
 * @return {Promise} A promise that contains the win when resolved.
 *                   "reject" is not expect and so not handled.
 */
Panel.showWindow = function(props) {
  props = {
    ...defaultWindowProps,
    ...props
  };
  let {i18n} = props;
  let windowClassName = 'react-geo-window';

  props.className = props.className
    ? `${props.className} ${windowClassName}`
    : windowClassName;

  let container = document.getElementById(props.containerId);
  let div = document.createElement('div');
  let id = uniqueId(`${windowClassName}-`);

  div.style.position = 'absolute';
  div.style.left = 0;
  div.style.top = 0;
  div.id = id;
  container.appendChild(div);

  props.bounds = '#' + props.containerId;
  props.id = id;

  return new Promise(function(resolve) {
    ReactDOM.render(
      i18n
        ? <I18nextProvider i18n={i18n}>
          <Panel {...props} />
        </I18nextProvider>
        : <Panel {...props} />,
      div,
      function() {
        resolve(this);
      }
    );
  });
};

export default Panel;

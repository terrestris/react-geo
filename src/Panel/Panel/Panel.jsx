import React from 'react';
import PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';

import uniqueId from 'lodash/uniqueId';
import isNumber from 'lodash/isNumber';
import isFunction from 'lodash/isFunction';

import Titlebar from '../Titlebar/Titlebar.jsx';
import SimpleButton from '../../Button/SimpleButton/SimpleButton.jsx';

import { CSS_PREFIX } from '../../constants';

import './Panel.less';

/**
 * The Panel.
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
  className = `${CSS_PREFIX}panel`;

   /**
    * Printed representation of the pressed escape keyboard key.
    * s. https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/key/Key_Values
    * @type {String}
    * @private
    */
   _escapeKeyboardEventKey = 'Escape';

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {

    id: PropTypes.string,

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
      PropTypes.shape({
        top: PropTypes.bool,
        right: PropTypes.bool,
        bottom: PropTypes.bool,
        left: PropTypes.bool,
        topRight: PropTypes.bool,
        bottomRight: PropTypes.bool,
        bottomLeft: PropTypes.bool,
        topLeft: PropTypes.bool
      }),
      PropTypes.bool
    ]),
    /**
     * Function called when onResize is triggered by react-rnd
     * @type {Function}
     */
    onResize: PropTypes.func,
    /**
     * Function called when onResizeStart is triggered by react-rnd
     * @type {Function}
     */
    onResizeStart: PropTypes.func,
    /**
     * Function called when onResizeStop is triggered by react-rnd
     * @type {Function}
     */
    onResizeStop: PropTypes.func,
    /**
     * Callback function on `keydown` keyboard event if `escape` key was pressed.
     * @type {Function}
     */
    onEscape: PropTypes.func,
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
     * The height of the panel.
     * @type {number|string}
     */
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.oneOf([
        'inherit',
        'initial',
        'auto'
      ])
    ]),

    /**
     * The width of the panel.
     * @type {number|string}
     */
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.oneOf([
        'inherit',
        'initial',
        'auto'
      ])
    ]),

    /**
     * The height of the TitleBar.
     * @type {number}
     */
    titleBarHeight: PropTypes.number,

    /**
     * The tooltip of the collapse button.
     * @type {String}
     */
    collapseTooltip: PropTypes.string,

    /**
     *
     */
    tools: PropTypes.arrayOf(PropTypes.node)
  }

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    draggable: false,
    collapsible: false,
    resizeOpts: false,
    titleBarHeight: 37.5,
    tools: [],
    height: 'auto',
    width: 'auto',
    collapseTooltip: 'Collapse'
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
   * The reference callback.
   *
   * @param {Element} element The body div DOMElement of the panel.
   */
  onBodyRef(element){
    if (element) {
      element.focus();
    }
  }

  /**
   * Calculates the height of the Panel and returns a number.
   *
   * @return {number}
   */
  calculateHeight() {
    return this.state.collapsed
      ? this.state.titleBarHeight
      : this.state.height;
  }

  /**
   * Calculates the height of the Panel body and returns a valid css height
   * expression.
   *
   * @return {string}
   */
  calculateBodyHeight() {
    if (this.state.collapsed) {
      return '0px';
    } else {
      return isNumber(this.state.height)
        ? (this.state.height - this.state.titleBarHeight) + 'px'
        : this.state.height;
    }
  }

  /**
   * Toggles the collapse state of the panel.
   */
  toggleCollapse() {
    this.setState({
      collapsed: !this.state.collapsed
    }, () => {
      this.rnd.updateSize({
        height: this.calculateHeight(),
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
  onResize(evt, direction, el) {
    const { onResize } = this.props;
    if (isFunction(onResize)) {
      onResize(arguments);
    }
    this.setState({
      height: el.clientHeight,
      width: el.clientWidth
    });
  }

  /**
   * Function called when resizing is started.
   */
  onResizeStart() {
    const { onResizeStart } = this.props;
    if (isFunction(onResizeStart)) {
      onResizeStart(arguments);
    }
    this.setState({
      resizing: true
    });
  }

  /**
   * Function called when resizing is stopped.
   */
  onResizeStop() {
    const { onResizeStop } = this.props;
    if (isFunction(onResizeStop)) {
      onResizeStop(arguments);
    }
    this.setState({
      resizing: false
    });
  }

  /**
   * Called on keyboard `keydown` event. Will be only triggered if pressed key
   * is `escape` key and `onEscape` function is provided via props.
   * @param {React.KeyboardEvent<HTMLDivElement>} evt `keydown` event.
   */
  onKeyDown(evt) {
    if (evt.key === this._escapeKeyboardEventKey && this.props.onEscape) {
      this.props.onEscape();
    }
  }

  /**
   * The render function.
   */
  render() {
    const {
      id,
      className,
      children,
      title,
      resizeOpts,
      onResize,
      onResizeStart,
      onResizeStop,
      onEscape,
      draggable,
      collapsible,
      height,
      width,
      titleBarHeight,
      collapseTooltip,
      tools,
      ...rndOpts
    } = this.props;

    let toolsClone = tools.map(t => React.cloneElement(t));

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    const rndClassName = `${finalClassName} ${this.state.id}`;
    const enableResizing = resizeOpts === true ? undefined : resizeOpts;

    if (collapsible) {
      toolsClone.unshift(<SimpleButton
        icon="compress"
        key="collapse-tool"
        onClick={this.toggleCollapse.bind(this)}
        tooltip={collapseTooltip}
        size="small"
      />);
    }

    const titleBarClassName = draggable ?
      'drag-handle ant-modal-header' :
      'ant-modal-header';

    const titleBar = title ? <Titlebar
      className={titleBarClassName}
      tools={toolsClone}
      style={{
        height: this.state.titleBarHeight,
        cursor: draggable ? 'move' : 'default'
      }}
    >
      {title}
    </Titlebar> : null;

    const defWidth = this.state.width;
    const defHeight = this.calculateHeight();
    const {
      x,
      y
    } = rndOpts;
    const defX = x && isNumber(x) ? x : window.innerWidth / 2 - defWidth / 2;
    const defY = y && isNumber(y) ? y : window.innerHeight / 2 - defHeight / 2;

    return (
      <Rnd
        className={rndClassName}
        ref={rnd => this.rnd = rnd}
        default={{
          x: defX,
          y: defY,
          width: defWidth,
          height: defHeight
        }}
        dragHandleClassName="drag-handle"
        disableDragging={!draggable}
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
        onResize={this.onResize.bind(this)}
        onResizeStart={this.onResizeStart.bind(this)}
        onResizeStop={this.onResizeStop.bind(this)}
        {...rndOpts}
      >
        {titleBar}
        <div
          className="body"
          tabIndex="0"
          ref={this.onBodyRef}
          onKeyDown={this.onKeyDown.bind(this)}
          style={{
            cursor: 'default',
            overflow: 'hidden',
            height: this.calculateBodyHeight(),
            transition: this.state.resizing ? '' : 'height 0.25s',
          }}
        >
          {children}
        </div>
      </Rnd>
    );
  }
}

export default Panel;

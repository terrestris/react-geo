import * as React from 'react';
import {
  Rnd,
  ResizeEnable,
  Props as RndProps
} from 'react-rnd';

import uniqueId from 'lodash/uniqueId';
import isNumber from 'lodash/isNumber';
import isFunction from 'lodash/isFunction';

import Titlebar from '../Titlebar/Titlebar';
import SimpleButton from '../../Button/SimpleButton/SimpleButton';

import { CSS_PREFIX } from '../../constants';

import './Panel.less';

// i18n
export interface PanelLocale {
}

interface PanelDefaultProps extends RndProps {
  /**
   * Whether to allow dragging or not. Default is false.
   */
  draggable: boolean;
  /**
   * Whether to allow collapsing or not. Default is false.
   */
  collapsible: boolean;
  /**
   * Whether to show panel collapsed initially or not. Default is false.
   */
  collapsed: boolean;
  /**
   * The height of the panel.
   */
  height: number | 'inherit' | 'initial' | 'auto';
  /**
   * The width of the panel.
   */
  width: number | 'inherit' | 'initial' | 'auto';
  /**
   * The height of the TitleBar.
   */
  titleBarHeight: number;
  /**
   * The tooltip of the collapse button.
   */
  collapseTooltip: string;
  /**
   *
   */
  tools: React.ReactElement[];
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
   */
  resizeOpts: ResizeEnable | boolean;
}

export interface PanelProps extends Partial<PanelDefaultProps> {
  id?: string;
  /**
   * The children to show in the Window.
   */
  children?: React.ReactNode;
  /**
   * The title text to be shown in the window Header.
   * @type {string}
   */
  title?: string;
  /**
   * Callback function on `keydown` keyboard event if `escape` key was pressed.
   */
  onEscape?: (evt: KeyboardEvent) => void;
}

interface PanelState {
  id?: string;
  /**
   * Whether to show panel collapsed initially or not. Default is false.
   */
  collapsed: boolean;
  /**
   * The height of the TitleBar.
   */
  titleBarHeight: number;
  /**
   * The height of the panel.
   */
  height: number | 'inherit' | 'initial' | 'auto';
  /**
   * The width of the panel.
   */
  width: number | 'inherit' | 'initial' | 'auto';
  /**
   *
   */
  resizing: boolean;
}

/**
 * The Panel.
 *
 * @class The Panel
 * @extends React.Component
 */
export class Panel extends React.Component<PanelProps, PanelState> {

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
  _escapeKeyboardEventKey = 'Esc';

  /**
   *
   *
   */
  _rnd: Rnd;

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps: PanelDefaultProps = {
    draggable: false,
    collapsible: false,
    collapsed: false,
    resizeOpts: false,
    titleBarHeight: 37.5,
    tools: [],
    height: 'auto',
    width: 'auto',
    collapseTooltip: 'Collapse'
  };

  /**
   * Create the SimpleButton.
   *
   * @constructs SimpleButton
   */
  constructor(props: PanelProps) {
    super(props);
    const id = props.id || uniqueId('panel-');
    this.state = {
      id: id,
      collapsed: this.props.collapsible ? this.props.collapsed : false,
      titleBarHeight: this.props.title ? props.titleBarHeight : 0,
      height: props.height,
      width: props.width,
      resizing: false
    };
  }

  /**
   * componentDidMount life cycle method.
   * Registers `keydown` listener if `onEscape` function was provided via props.
   */
  componentDidMount() {
    if (this.props.onEscape) {
      document.addEventListener('keydown', this.onKeyDown, false);
    }
  }

  /**
   * componentWillUnmount life cycle method.
   * Unregisters `keydown` listener if `onEscape` function was provided via props.
   */
  componentWillUnmount() {
    if (this.props.onEscape) {
      document.removeEventListener('keydown', this.onKeyDown, false);
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
      this._rnd.updateSize({
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
  onResize(evt: React.MouseEvent, direction: string, el: HTMLElement) {
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
   * is `Escape` key and `onEscape` function is provided via props.
   * @param {KeyboardEvent} evt `keydown` event.
   */
  onKeyDown = (evt: KeyboardEvent) => {
    const {
      onEscape
    } = this.props;
    if (evt && evt.key.startsWith(this._escapeKeyboardEventKey) && onEscape) {
      this._rnd.getSelfElement().focus();
      onEscape(evt);
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
      collapsed,
      height,
      width,
      titleBarHeight,
      collapseTooltip,
      tools,
      ...rndOpts
    } = this.props;

    let toolsClone = tools.map(tool => React.cloneElement(tool));

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

    const defaultWidth = this.state.width;
    const defaultHeight = this.calculateHeight();
    const {
      x,
      y
    } = rndOpts;
    const defX = x && isNumber(x)
      ? x
      : isNumber(defaultWidth)
        ? window.innerWidth / 2 - defaultWidth / 2
        : undefined;
    const defY = y && isNumber(y)
      ? y
      : isNumber(defaultHeight)
        ? window.innerHeight / 2 - defaultHeight / 2
        : undefined;

    return (
      <Rnd
        className={rndClassName}
        ref={rnd => this._rnd = rnd}
        default={{
          x: defX,
          y: defY,
          width: defaultWidth,
          height: defaultHeight
        }}
        dragHandleClassName="drag-handle"
        disableDragging={!draggable}
        enableResizing={enableResizing as ResizeEnable}
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
          tabIndex={0}
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

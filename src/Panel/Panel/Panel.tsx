import * as React from 'react';
import {
  Rnd,
  ResizeEnable,
  ResizableDelta,
  Position,
  Props as RndProps
} from 'react-rnd';
import { ResizeDirection } from 're-resizable';

const _uniqueId = require('lodash/uniqueId');
const _isNumber = require('lodash/isNumber');
const _isFunction = require('lodash/isFunction');

import Titlebar from '../Titlebar/Titlebar';
import SimpleButton from '../../Button/SimpleButton/SimpleButton';

import { CSS_PREFIX } from '../../constants';

import './Panel.less';

interface DefaultProps {
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

export interface BaseProps {
  id?: string;
  /**
   * The children to show in the Window.
   */
  children?: React.ReactNode;
  /**
   * The title text to be shown in the window Header.
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

export type PanelProps = BaseProps & Partial<DefaultProps> & RndProps;

/**
 * The Panel.
 *
 * @class The Panel
 * @extends React.Component
 */
export class Panel extends React.Component<PanelProps, PanelState> {

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}panel`;

  /**
   * Printed representation of the pressed escape keyboard key.
   * s. https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/key/Key_Values
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
   */
  static defaultProps: DefaultProps = {
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
   * Create the Panel.
   *
   * @constructs Panel
   */
  constructor(props: PanelProps) {
    super(props);
    const id = props.id || _uniqueId('panel-');
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
   */
  calculateHeight() {
    return this.state.collapsed
      ? this.state.titleBarHeight
      : this.state.height;
  }

  /**
   * Calculates the height of the Panel body and returns a valid css height
   * expression.
   */
  calculateBodyHeight() {
    if (this.state.collapsed) {
      return '0px';
    } else {
      return _isNumber(this.state.height)
        ? ((this.state.height as number) - this.state.titleBarHeight) + 'px'
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
   * @param evt The MouseEvent event.
   * @param direction A string discribing where the element was grabed.
   * @param el The element which gets resized.
   * @param delta The delta of the resizing.
   * @param position The position of the resizing.
   */
  onResize(
    evt: MouseEvent | TouchEvent,
    direction: ResizeDirection,
    el: HTMLDivElement,
    delta: ResizableDelta,
    position: Position
  ) {
    const { onResize } = this.props;
    if (_isFunction(onResize)) {
      onResize(evt, direction, el, delta, position);
    }
    this.setState({
      height: el.clientHeight,
      width: el.clientWidth
    });
  }

  /**
   * Function called when resizing is started.
   *
   * @param evt The MouseEvent event.
   * @param direction A string discribing where the element was grabed.
   * @param el The element which gets resized.
   */
  onResizeStart(
    evt: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    direction: ResizeDirection,
    el: HTMLDivElement
  ) {
    const { onResizeStart } = this.props;
    if (_isFunction(onResizeStart)) {
      onResizeStart(evt, direction, el);
    }
    this.setState({
      resizing: true
    });
  }

  /**
   * Function called when resizing is stopped.
   *
   * @param evt The MouseEvent event.
   * @param direction A string discribing where the element was grabed.
   * @param el The element which gets resized.
   * @param delta The delta of the resizing.
   * @param position The position of the resizing.
   */
  onResizeStop(
    evt: MouseEvent | TouchEvent,
    direction: ResizeDirection,
    el: HTMLDivElement,
    delta: ResizableDelta,
    position: Position
  ) {
    const { onResizeStop } = this.props;
    if (_isFunction(onResizeStop)) {
      onResizeStop(evt, direction, el, delta, position);
    }
    this.setState({
      resizing: false
    });
  }

  /**
   * Called on keyboard `keydown` event. Will be only triggered if pressed key
   * is `Escape` key and `onEscape` function is provided via props.
   * @param evt `keydown` event.
   */
  onKeyDown = (evt: KeyboardEvent) => {
    const {
      onEscape
    } = this.props;
    if (evt && evt.key.startsWith(this._escapeKeyboardEventKey) && onEscape) {
      this._rnd.getSelfElement().focus();
      onEscape(evt);
    }
  };

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

    const toolsClone = tools.map(tool => React.cloneElement(tool));

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    const rndClassName = `${finalClassName} ${this.state.id}`;
    const enableResizing = resizeOpts === true ? undefined : resizeOpts;

    if (collapsible) {
      toolsClone.unshift(<SimpleButton
        iconName="compress"
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
    const defX = x && _isNumber(x)
      ? x
      : _isNumber(defaultWidth)
        ? window.innerWidth / 2 - (defaultWidth as number) / 2
        : undefined;
    const defY = y && _isNumber(y)
      ? y
      : _isNumber(defaultHeight)
        ? window.innerHeight / 2 - (defaultHeight as number) / 2
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

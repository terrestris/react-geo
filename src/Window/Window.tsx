import * as React from 'react';
import ReactDOM from 'react-dom';

const _uniqueId = require('lodash/uniqueId');

import Panel, { PanelProps } from  '../Panel/Panel/Panel';
import Logger from '@terrestris/base-util/dist/Logger';

import { CSS_PREFIX } from '../constants';

import './Window.less';
import { ResizeEnable } from 'react-rnd';

interface DefaultProps {
  /**
   * Id of the component
   */
  id: string;
  /**
   * The id of the parent component
   * default: app
   */
  parentId: string;
  /**
   * The title text to be shown in the window header.
   */
  title: string;
  /**
   * The resize options.
   */
  resizeOpts: ResizeEnable | boolean;
  /**
   * Wheter the Window should be collapsible or not.
   */
  collapsible: boolean;
  /**
   * Wheter the Window should be draggable or not.
   */
  draggable: boolean;
}

export interface BaseProps {
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
}

interface WindowState {
  /**
   * The user aname.
   */
  resizing: boolean;
  /**
   * The id of the Window.
   */
  id: string;
}

export type WindowProps = BaseProps & Partial<DefaultProps> & PanelProps;

/**
 * Window component that creates a React portal that renders children into a DOM
 * node that exists outside the DOM hierarchy of the parent component. By default,
 * Window Component is draggable.
 *
 * @class Window
 * @extends React.Component
 */
export class Window extends React.Component<WindowProps, WindowState> {

  /**
   * The parent Element of the Window.
   * @private
   */
  _parent: Element;

  /**
   * The Element of the Window.
   * @private
   */
  _elementDiv: Element;

  /**
   * The className added to this component.
   * @private
   */
  className: string = `${CSS_PREFIX}window-portal`;

  static defaultProps: DefaultProps = {
    parentId: 'app',
    title: 'Window',
    resizeOpts: true,
    collapsible: true,
    draggable: true,
    id: _uniqueId('window-')
  };

  /**
   * Create a Window.
   * @constructs Window
   */
  constructor(props: WindowProps) {
    super(props);

    const { parentId } = this.props;
    this._parent = document.getElementById(parentId);

    if (!this._parent) {
      Logger.warn('No parent element was found! Please ensure that parentId ' +
      'parameter was set correctly (default value is `app`)');
    }

    const div = document.createElement('div');
    div.id = props.id;
    this._elementDiv = div;

    this.state = {
      id: props.id,
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

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    this._elementDiv.className = finalClassName;

    return ReactDOM.createPortal(
      <Panel {...passThroughProps} >
        {children}
      </Panel>,
      this._elementDiv,
    );
  }
}

export default Window;

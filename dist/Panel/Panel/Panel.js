'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Panel = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRnd = require('react-rnd');

var _reactRnd2 = _interopRequireDefault(_reactRnd);

var _lodash = require('lodash');

var _Titlebar = require('../Titlebar/Titlebar.js');

var _Titlebar2 = _interopRequireDefault(_Titlebar);

var _SimpleButton = require('../../Button/SimpleButton/SimpleButton.js');

var _SimpleButton2 = _interopRequireDefault(_SimpleButton);

require('./Panel.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The Panel.
 *
 * @class The Panel
 * @extends React.Component
 */
var Panel = exports.Panel = function (_React$Component) {
  _inherits(Panel, _React$Component);

  /**
   * Create the SimpleButton.
   *
   * @constructs SimpleButton
   */


  /**
   * The properties.
   * @type {Object}
   */
  function Panel(props) {
    var _arguments = arguments;

    _classCallCheck(this, Panel);

    var _this = _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).call(this, props));

    _this.className = 'react-geo-panel';

    _this.toggleCollapse = function () {
      _this.setState({
        collapsed: !_this.state.collapsed
      }, function () {
        _this.panel.updateSize({
          height: _this.state.collapsed ? _this.state.titleBarHeight : _this.state.height,
          width: _this.state.width
        });
      });
    };

    _this.onResize = function (evt, direction, el) {
      var onResize = _this.props.onResize;

      if ((0, _lodash.isFunction)(onResize)) {
        onResize(_arguments);
      }
      _this.setState({
        height: el.clientHeight,
        width: el.clientWidth
      });
    };

    _this.onResizeStart = function () {
      var onResizeStart = _this.props.onResizeStart;

      if ((0, _lodash.isFunction)(onResizeStart)) {
        onResizeStart(_arguments);
      }
      _this.setState({
        resizing: true
      });
    };

    _this.onResizeStop = function () {
      var onResizeStop = _this.props.onResizeStop;

      if ((0, _lodash.isFunction)(onResizeStop)) {
        onResizeStop(_arguments);
      }
      _this.setState({
        resizing: false
      });
    };

    var id = props.id || (0, _lodash.uniqueId)('panel-');
    _this.state = {
      id: id,
      collapsed: false,
      titleBarHeight: _this.props.title ? props.titleBarHeight : 0,
      height: props.height,
      width: props.width,
      resizing: false
    };
    return _this;
  }

  /**
   * Toggles the collapse state of the panel.
   */


  /**
   * The default properties.
   * @type {Object}
   */


  /**
   * The className added to this component.
   * @type {String}
   * @private
   */


  /**
   * Function called while resizing.
   *
   * @param {MouseEvent|TouchEvent} evt The MouseEvent event.
   * @param {String} direction A string discribing where the element was grabed.
   * @param {HTMLElement} el The element which gets resized.
   */


  /**
   * Function called when resizing is started.
   */


  /**
   * Function called when resizing is stopped.
   */


  _createClass(Panel, [{
    key: 'render',


    /**
     * The render function.
     */
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          closable = _props.closable,
          collapsible = _props.collapsible,
          draggable = _props.draggable,
          resizeOpts = _props.resizeOpts,
          className = _props.className,
          onClose = _props.onClose,
          rndOpts = _objectWithoutProperties(_props, ['closable', 'collapsible', 'draggable', 'resizeOpts', 'className', 'onClose']);

      var finalClassName = className ? className + ' ' + this.className : this.className;

      var rndClassName = finalClassName + ' ' + this.state.id;
      var enableResizing = resizeOpts === true ? undefined : resizeOpts;

      var tools = [];
      if (collapsible) {
        tools.push(_react2.default.createElement(_SimpleButton2.default, {
          icon: 'compress',
          key: 'compress-tool',
          onClick: this.toggleCollapse,
          tooltip: this.props.compressTooltip,
          size: 'small'
        }));
      }
      if (closable) {
        tools.push(_react2.default.createElement(_SimpleButton2.default, {
          icon: 'times',
          key: 'close-tool',
          onClick: onClose,
          tooltip: this.props.closeTooltip,
          size: 'small'
        }));
      }

      var titleBarClassName = draggable ? 'drag-handle ant-modal-header' : 'ant-modal-header';

      var titleBar = this.props.title ? _react2.default.createElement(
        _Titlebar2.default,
        {
          className: titleBarClassName,
          closable: closable,
          collapsible: collapsible,
          parent: this,
          compressTooltip: this.props.compressTooltip,
          closeTooltip: this.props.closeTooltip,
          tools: tools,
          style: {
            height: this.state.titleBarHeight,
            cursor: draggable ? 'move' : 'default'
          }
        },
        this.props.title
      ) : null;

      return _react2.default.createElement(
        _reactRnd2.default,
        _extends({
          className: rndClassName,
          ref: function ref(panel) {
            _this2.panel = panel;
          },
          'default': {
            x: (0, _lodash.isNumber)(rndOpts.x) ? rndOpts.x : window.innerWidth / 2 - 160,
            y: (0, _lodash.isNumber)(rndOpts.y) ? rndOpts.y : window.innerHeight / 2 - 100,
            width: rndOpts.width || 160,
            height: this.state.collapsed ? this.state.titleBarHeight : this.state.height
          },
          dragHandleClassName: '.drag-handle',
          disableDragging: !draggable,
          enableResizing: enableResizing,
          resizeHandleClasses: {
            bottom: 'resize-handle resize-handle-bottom',
            bottomLeft: 'resize-handle resize-handle-bottom-left',
            bottomRight: 'resize-handle resize-handle-bottom-right',
            left: 'resize-handle resize-handle-left',
            right: 'resize-handle resize-handle-right',
            top: 'resize-handle resize-handle-top',
            topLeft: 'resize-handle resize-handle-top-left',
            topRight: 'resize-handle resize-handle-top-right'
          },
          onResize: this.onResize,
          onResizeStart: this.onResizeStart,
          onResizeStop: this.onResizeStop
        }, rndOpts),
        titleBar,
        _react2.default.createElement(
          'div',
          {
            className: 'body',
            style: {
              cursor: 'default',
              overflow: 'hidden',
              height: this.state.collapsed ? '0px' : this.state.height - this.state.titleBarHeight,
              transition: this.state.resizing ? '' : 'height 0.25s'
            }
          },
          this.props.children
        )
      );
    }
  }]);

  return Panel;
}(_react2.default.Component);

Panel.propTypes = {

  id: _propTypes2.default.string,

  /**
   * Optional additional className that will be added to rnd.
   * @type {String}
   */
  className: _propTypes2.default.string,

  /**
   * The dispatch function.
    @type {Function}
   */
  dispatch: _propTypes2.default.func,

  /**
   * The children to show in the Window.
   * @type {node}
   */
  children: _propTypes2.default.node,

  /**
   * The title text to be shown in the window Header.
   * @type {string}
   */
  title: _propTypes2.default.string,

  /**
   * function called on close
   *
   * @type {Function}
   */
  onClose: _propTypes2.default.func,

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
  resizeOpts: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.bool]),
  /**
   * Function called when onResize is triggered by react-rnd
   * @type {Function}
   */
  onResize: _propTypes2.default.func,
  /**
   * Function called when onResizeStart is triggered by react-rnd
   * @type {Function}
   */
  onResizeStart: _propTypes2.default.func,
  /**
   * Function called when onResizeStop is triggered by react-rnd
   * @type {Function}
   */
  onResizeStop: _propTypes2.default.func,
  /**
   * Whether to allow dragging or not.
   * @type {boolean}
   */
  draggable: _propTypes2.default.bool,

  /**
   * Whether to allow collasping or not.
   * @type {boolean}
   */
  collapsible: _propTypes2.default.bool,

  /**
   * Whether to allow closing or not.
   * @type {boolean}
   */
  closable: _propTypes2.default.bool,

  /**
   * The height of the panel.
   * @type {number}
   */
  height: _propTypes2.default.number,

  /**
   * The width of the panel.
   * @type {number}
   */
  width: _propTypes2.default.number,

  /**
   * The height of the TitleBar.
   * @type {number}
   */
  titleBarHeight: _propTypes2.default.number,

  /**
   * The tooltip of the compress button.
   * @type {String}
   */
  compressTooltip: _propTypes2.default.string,

  /**
   * The tooltip of the close button.
   * @type {String}
   */
  closeTooltip: _propTypes2.default.string };
Panel.defaultProps = {
  draggable: false,
  collapsible: false,
  closable: false,
  resizeOpts: false,
  titleBarHeight: 37.5,
  height: 100,
  width: 100,
  compressTooltip: 'collapse',
  closeTooltip: 'close',
  onClose: function onClose() {} };
exports.default = Panel;
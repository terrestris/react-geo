'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Window = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _Panel = require('../Panel/Panel/Panel.js');

var _Panel2 = _interopRequireDefault(_Panel);

var _Logger = require('../Util/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

require('./Window.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Window component that creates a React portal that renders children into a DOM
 * node that exists outside the DOM hierarchy of the parent component. By default,
 * Window Component is draggable and closable
 *
 * @class Window
 * @extends React.Component
 */
var Window = exports.Window = function (_React$Component) {
  _inherits(Window, _React$Component);

  /**
   * Create a Window.
   * @constructs Window
   */


  /**
  * The properties.
  * @type {Object}
  */
  function Window(props) {
    _classCallCheck(this, Window);

    var _this = _possibleConstructorReturn(this, (Window.__proto__ || Object.getPrototypeOf(Window)).call(this, props));

    _this.className = 'react-geo-window-portal';

    var id = props.id || (0, _lodash.uniqueId)('window-');

    var parentId = _this.props.parentId;

    _this._parent = document.getElementById(parentId);

    if (!_this._parent) {
      _Logger2.default.warn('No parent element was found! Please ensure that parentId ' + 'parameter was set correctly (default value is `app`)');
    }

    var div = document.createElement('div');
    div.id = id;
    _this._elementDiv = div;

    _this.state = {
      id: id,
      resizing: false
    };
    return _this;
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


  /**
   * The className added to this component.
   * @type {String}
   * @private
   */


  _createClass(Window, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this._parent) {
        this._parent.appendChild(this._elementDiv);
      }
    }

    /**
     * componentWillUnmount - remove child from parent element
     */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._parent) {
        this._parent.removeChild(this._elementDiv);
      }
    }

    /**
     * The render function.
     */

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          children = _props.children,
          onClose = _props.onClose,
          rndOpts = _objectWithoutProperties(_props, ['className', 'children', 'onClose']);

      var finalClassName = className ? className + ' ' + this.className : this.className;
      var rndClassName = finalClassName + ' ' + this.state.id;

      return _reactDom2.default.createPortal(_react2.default.createElement(
        _Panel2.default,
        _extends({
          closable: true,
          draggable: true,
          className: rndClassName,
          onClose: onClose
        }, rndOpts),
        children
      ), this._elementDiv);
    }
  }]);

  return Window;
}(_react2.default.Component);

Window.propTypes = {
  /**
  * id of the component
  * will be filled automatically if not provided
  * @type {String}
  */
  id: _propTypes2.default.string,
  /**
  * The id of the parent component
  * default: app
  *
  * @type {String}
  */
  parentId: _propTypes2.default.string.isRequired,
  /**
  * The className which should be added.
  *
  * @type {String}
  */
  className: _propTypes2.default.string,
  /**
  * The children to show in the Window.
  * @type {node}
  */
  children: _propTypes2.default.node,
  /**
  * The title text to be shown in the window header.
  * @type {string}
  */
  title: _propTypes2.default.string,
  /**
  * Function to be called if window is closed
  * @type {Function}
  */
  onClose: _propTypes2.default.func
};
Window.defaultProps = {
  parentId: 'app',
  title: 'Window',
  resizeOpts: true,
  onClose: function onClose() {} // default: do nothing
};
exports.default = Window;
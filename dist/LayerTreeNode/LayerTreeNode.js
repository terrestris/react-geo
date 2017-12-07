'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tree = require('antd/lib/tree');

var _tree2 = _interopRequireDefault(_tree);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('antd/lib/tree/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./LayerTreeNode.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeNode = _tree2.default.TreeNode;

/**
 * Class representing a layer tree node
 */
var LayerTreeNode = function (_React$Component) {
  _inherits(LayerTreeNode, _React$Component);

  /**
   * The constructor.
   *
   * @param {Object} props The initial props.
   */
  function LayerTreeNode(props) {
    _classCallCheck(this, LayerTreeNode);

    return _possibleConstructorReturn(this, (LayerTreeNode.__proto__ || Object.getPrototypeOf(LayerTreeNode)).call(this, props));
  }

  /**
   * The render function.
   *
   * @return {Element} The element.
   */


  /**
   * The prop types.
   * @type {Object}
   */


  _createClass(LayerTreeNode, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          inResolutionRange = _props.inResolutionRange,
          passThroughProps = _objectWithoutProperties(_props, ['inResolutionRange']);

      var addClassName = (inResolutionRange ? 'within' : 'out-off') + '-range';
      var finalClassname = 'react-geo-layertree-node ' + addClassName;
      return _react2.default.createElement(TreeNode, _extends({
        className: finalClassname
      }, passThroughProps));
    }
  }]);

  return LayerTreeNode;
}(_react2.default.Component);

// Otherwise rc-tree wouldn't recognize this component as TreeNode, see
// https://github.com/react-component/tree/blob/master/src/TreeNode.jsx#L328


LayerTreeNode.propTypes = {
  inResolutionRange: _propTypes2.default.bool };
LayerTreeNode.isTreeNode = 1;

exports.default = LayerTreeNode;
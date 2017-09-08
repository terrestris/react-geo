'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _css = require('antd/lib/dropdown/style/css');

var _dropdown = require('antd/lib/dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _css2 = require('antd/lib/avatar/style/css');

var _avatar = require('antd/lib/avatar');

var _avatar2 = _interopRequireDefault(_avatar);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./UserChip.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class representating the user chip containing an image of the user and his/her
 * name
 *
 * @class The UserChip
 * @extends React.Component
 */
var UserChip = function (_React$Component) {
  _inherits(UserChip, _React$Component);

  /**
   * Create a UserChip.
   * @constructs UserChip
   */
  function UserChip(props) {
    _classCallCheck(this, UserChip);

    return _possibleConstructorReturn(this, (UserChip.__proto__ || Object.getPrototypeOf(UserChip)).call(this, props));
  }

  /**
   * Determine initials for a given user name. The username will be splitted by
   * a whitespace and the first character of each part (capital letter) is added
   * to the initials.
   * e.g. 'John Doe' leads to 'JD'
   *
   * @return {String} initials if the user name.
   *
   * @method getInitials
   */


  /**
   * The default properties.
   * @type {Object}
   */


  _createClass(UserChip, [{
    key: 'getInitials',
    value: function getInitials() {
      var splittedName = this.props.userName.split(' ');
      var initals = [];
      splittedName.forEach(function (part) {
        initals.push(part[0].toUpperCase());
      });
      return initals.join('');
    }

    /**
     * getUserMenu - Description
     *
     * @return {type} Description
     */

  }, {
    key: 'getUserMenu',
    value: function getUserMenu() {
      return _react2.default.createElement(
        'div',
        { className: 'userchip', style: this.props.style },
        _react2.default.createElement(
          _avatar2.default,
          { src: this.props.imageSrc, size: 'large', className: 'userimage' },
          ' ',
          this.props.imageSrc ? '' : this.getInitials(),
          ' '
        ),
        _react2.default.createElement(
          'span',
          { className: 'username' },
          this.props.userName
        )
      );
    }

    /**
     * The render function
     */

  }, {
    key: 'render',
    value: function render() {
      if (this.props.userMenu && _react2.default.isValidElement(this.props.userMenu)) {
        return _react2.default.createElement(
          _dropdown2.default,
          { overlay: this.props.userMenu, trigger: ['click'], getPopupContainer: function getPopupContainer() {
              return document.getElementsByClassName('userchip')[0];
            } },
          this.getUserMenu()
        );
      }

      return this.getUserMenu();
    }
  }]);

  return UserChip;
}(_react2.default.Component);

UserChip.propTypes = {
  /**
   * The user aname.
   * @type {String}
   */
  userName: _propTypes2.default.string,

  /**
   * The image src.
   * @type {String}
   */
  imageSrc: _propTypes2.default.string,

  /**
   * The react element representing the user menu
   * @type {Element}
   */
  userMenu: _propTypes2.default.element,

  /**
   * The style object
   * @type {Object}
   */
  style: _propTypes2.default.object };
UserChip.defaultProps = {
  userName: 'John Doe',
  imageSrc: null,
  userMenu: null };
exports.default = UserChip;
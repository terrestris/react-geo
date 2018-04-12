import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Dropdown } from 'antd';
import './UserChip.less';

/**
 * Class representing the user chip containing an image of the user and his/her
 * name
 *
 * @class The UserChip
 * @extends React.Component
 */
class UserChip extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = 'react-geo-userchip'

  static propTypes = {
    /**
     * The className which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * The user aname.
     * @type {String}
     */
    userName: PropTypes.string,

    /**
     * The image src.
     * @type {String}
     */
    imageSrc: PropTypes.string,

    /**
     * The react element representing the user menu
     * @type {Element}
     */
    userMenu: PropTypes.element,

    /**
     * The style object
     * @type {Object}
     */
    style: PropTypes.object
  }

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    userName: 'John Doe'
  }

  /**
   * Create a UserChip.
   * @constructs UserChip
   */
  constructor(props) {
    super(props);
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
  getInitials() {
    let splittedName = this.props.userName.split(' ');
    let initals = [];
    splittedName.forEach((part) =>  {
      initals.push(part[0].toUpperCase());
    });
    return initals.join('');
  }

  /**
   * getUserMenu - Description
   *
   * @return {type} Description
   */
  getUserMenu() {
    const className = this.props.className
      ? `${this.props.className} ${this.className}`
      : this.className;

    return (
      <div
        className={className}
        style={this.props.style}
      >
        <Avatar
          src={this.props.imageSrc}
          size="large"
          className="userimage"
        >
          {
            this.props.imageSrc ?
              '' :
              this.getInitials()
          }
        </Avatar>
        <span
          className="username"
        >
          {this.props.userName}
        </span>
      </div>
    );
  }

  /**
   * The render function
   */
  render() {

    if (this.props.userMenu && React.isValidElement(this.props.userMenu)) {
      return (
        <Dropdown
          overlay={this.props.userMenu}
          trigger={['click']}
          getPopupContainer={() => {
            return document.getElementsByClassName(this.className)[0];
          }}
        >
          {this.getUserMenu()}
        </Dropdown>
      );
    }

    return this.getUserMenu();
  }
}

export default UserChip;

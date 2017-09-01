import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Dropdown } from 'antd';
import './UserChip.less';

/**
 * Class representating the user chip containing an image of the user and his/her
 * name
 *
 * @class The UserChip
 * @extends React.Component
 */
class UserChip extends React.Component {

  static propTypes = {
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
    userMenu: PropTypes.element
  }

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    userName: 'John Doe',
    imageSrc: null,
    userMenu: null
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
    return <div className="userchip">
      <Avatar src={this.props.imageSrc} size="large" className="userimage"> {this.props.imageSrc ? '' : this.getInitials()} </Avatar>
      <span className="username">{this.props.userName}</span>
    </div>;
  }

  /**
   * The render function
   */
  render() {
    if (this.props.userMenu && React.isValidElement(this.props.userMenu)) {
      return (
        <Dropdown overlay={this.props.userMenu} trigger={['click']} getPopupContainer={() => document.getElementsByClassName('userchip')[0]}>
          {this.getUserMenu()}
        </Dropdown>
      );
    }

    return this.getUserMenu();
  }
}

export default UserChip;

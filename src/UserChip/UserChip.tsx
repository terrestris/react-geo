import React from 'react';
import { Avatar, Dropdown } from 'antd';
import './UserChip.less';

import { CSS_PREFIX } from '../constants';

// i18n
export interface UserChipLocale {
}

interface UserChipDefaultProps {
  /**
   * The user aname.
   * @type {String}
   */
  userName: string;
}

// non default props
export interface UserChipProps extends Partial<UserChipDefaultProps> {
    /**
     * An optional CSS class which should be added.
     */
    className: string;
    /**
     * The image src.
     */
    imageSrc: string;
    /**
     * The react element representing the user menu
     */
    userMenu: React.ReactNode;
    /**
     * The style object
     */
    style: any;
}

/**
 * Class representing the user chip containing an image of the user and his/her
 * name
 *
 * @class The UserChip
 * @extends React.Component
 */
class UserChip extends React.Component<UserChipProps> {

  /**
   * The className added to this component.
   * @private
   */
  className: string = `${CSS_PREFIX}userchip`;

  /**
   * The default properties.
   */
  static defaultProps: UserChipDefaultProps = {
    userName: 'John Doe'
  };

  /**
   * Create a UserChip.
   * @constructs UserChip
   */
  constructor(props: UserChipProps) {
    super(props);
  }

  /**
   * Determine initials for a given user name. The username will be splitted by
   * a whitespace and the first character of each part (capital letter) is added
   * to the initials.
   * e.g. 'John Doe' leads to 'JD'
   *
   * @return Initials if the user name.
   *
   * @method getInitials
   */
  getInitials(): string {
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
            return document.getElementsByClassName(this.className)[0] as HTMLElement;
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

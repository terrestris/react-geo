import * as React from 'react';
import {
  Avatar,
  Dropdown
} from 'antd';

import { AvatarProps } from 'antd/lib/avatar';

import './UserChip.less';

import { CSS_PREFIX } from '../constants';
import _isString from 'lodash/isString';

// non default props
export interface BaseProps {
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * The image src.
   */
  imageSrc?: string;
  /**
   * The react element representing the user menu
   */
  userMenu?: React.ReactNode;
  /**
   * The user name.
   */
  userName?: React.ReactNode;
  /**
   * The style object
   */
  style?: any;
}

export type UserChipProps = BaseProps & AvatarProps;

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
  _className: string = `${CSS_PREFIX}userchip`;

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
    const {
      userName
    } = this.props;

    if (!_isString(userName)) {
      return '??';
    }

    return userName.split(' ')
      .map(part => part[0] ?? '')
      .join('')
      .toUpperCase();
  }

  /**
   * getUserMenu - Description
   *
   * @return Description
   */
  getUserMenu() {
    const {
      className,
      imageSrc,
      userMenu,
      userName,
      style,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this._className}`
      : this._className;

    return (
      <div
        className={finalClassName}
        style={style}
      >
        <Avatar
          src={imageSrc}
          size="large"
          className="userimage"
          {...passThroughProps}
        >
          {
            imageSrc ? '' : this.getInitials()
          }
        </Avatar>
        <span
          className="username"
        >
          {userName}
        </span>
      </div>
    );
  }

  /**
   * The render function
   */
  render() {
    const {
      userMenu
    } = this.props;

    if (userMenu && React.isValidElement(userMenu)) {
      return (
        <Dropdown
          overlay={userMenu}
          trigger={['click']}
          getPopupContainer={() => {
            return document.getElementsByClassName(this._className)[0] as HTMLElement;
          }}
        >
          {this.getUserMenu()}
        </Dropdown>
      );
    } else {
      return this.getUserMenu();
    }
  }
}

export default UserChip;

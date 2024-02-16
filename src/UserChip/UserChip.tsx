import * as React from 'react';
import {
  Avatar,
  Dropdown,
  MenuProps
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
   * The user menu
   */
  userMenu?: MenuProps;
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

const defaultClassName = `${CSS_PREFIX}userchip`;

const UserChip: React.FC<UserChipProps> = ({
  className,
  imageSrc,
  userMenu,
  userName,
  style,
  ...passThroughProps
}) => {

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
  const getInitials = () => {

    if (!_isString(userName)) {
      return '??';
    }

    return userName.split(' ')
      .map(part => part[0] ?? '')
      .join('')
      .toUpperCase();
  };

  /**
   * getUserMenu - Description
   *
   * @return Description
   */
  const getUserMenu = () => {

    const finalClassName = className
      ? `${className} ${defaultClassName}`
      : defaultClassName;

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
            imageSrc ? '' : getInitials()
          }
        </Avatar>
        <span
          className="username"
        >
          {userName}
        </span>
      </div>
    );
  };

  if (userMenu?.items) {
    return (
      <Dropdown
        menu={userMenu}
        trigger={['click']}
        getPopupContainer={() => {
          return document.getElementsByClassName(defaultClassName)[0] as HTMLElement;
        }}
      >
        {getUserMenu()}
      </Dropdown>
    );
  } else {
    return getUserMenu();
  }
};

export default UserChip;

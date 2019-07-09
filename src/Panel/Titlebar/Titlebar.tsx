import React from 'react';

import isEmpty from 'lodash/isEmpty';

import { CSS_PREFIX } from '../../constants';

import './Titlebar.less';

export interface TitlebarProps {
  /**
   * An optional CSS class which should be added.
   * @type {String}
   */
  className?: string;
  /**
   * Additional elements to show at the right side of the Titlebar.
   */
  tools: React.ReactNode[];
}

/**
 * Class representing the titlebar. Usually used in a panel.
 *
 * @class The TitleBar
 * @extends React.Component
 */
export class Titlebar extends React.Component<TitlebarProps> {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}titlebar`;

  /**
   * The render function.
   */
  render() {
    const {
      className,
      tools,
      children,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <div className={finalClassName} {...passThroughProps} >
        <span className="title">
          {children}
        </span>
        {
          !isEmpty(tools) ?
            <span className="controls">
              {tools}
            </span> :
            null
        }
      </div>
    );
  }
}

export default Titlebar;

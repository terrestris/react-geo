import React from 'react';
import './Toolbar.less';

import { CSS_PREFIX } from '../constants';

// i18n
export interface ToolbarLocale {
}

interface ToolbarDefaultProps {
  /**
   * The alignment of the sub components.
   */
  alignment: 'horizontal' | 'vertical';
}

// non default props
export interface ToolbarProps extends Partial<ToolbarDefaultProps> {
    /**
     * An optional CSS class which should be added.
     */
    className: string;
    /**
     * The style object
     */
    style: any;
}

/**
 * A base class representing a toolbar having n children
 * The child components of this toolbar can be aligned in vertical and
 * horizontal (default) way
 *
 * @class The Toolbar
 * @extends React.Component
 */
class Toolbar extends React.Component<ToolbarProps> {

  /**
   * The className added to this component.
   * @private
   */
  className: string = `${CSS_PREFIX}toolbar`;

  /**
   * The default properties.
   */
  static defaultProps: ToolbarDefaultProps = {
    alignment: 'horizontal'
  };

  /**
   * The render function
   */
  render() {
    const {
      alignment,
      style,
      children,
      className
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <div className={`${finalClassName} ${alignment}-toolbar`} style={style}>
        {children}
      </div>
    );
  }
}

export default Toolbar;

import * as React from 'react';
import './Toolbar.less';

import { CSS_PREFIX } from '../constants';

interface DefaultProps {
  /**
   * The alignment of the sub components.
   */
  alignment: 'horizontal' | 'vertical';
}

// non default props
export interface BaseProps extends Partial<DefaultProps> {
  /**
     * An optional CSS class which should be added.
     */
  className?: string;
}

export type ToolbarProps = BaseProps & Partial<DefaultProps> & React.HTMLAttributes<HTMLDivElement>;

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
   * The default properties.
   */
  static defaultProps: DefaultProps = {
    alignment: 'horizontal'
  };

  /**
   * The className added to this component.
   * @private
   */
  className: string = `${CSS_PREFIX}toolbar`;

  /**
   * The render function
   */
  render() {
    const {
      alignment,
      children,
      className,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <div
        className={`${finalClassName} ${alignment}-toolbar`}
        role="toolbar"
        {...passThroughProps}
      >
        {children}
      </div>
    );
  }
}

export default Toolbar;

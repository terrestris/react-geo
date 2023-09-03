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

const defaultClassName = `${CSS_PREFIX}toolbar`;

const Toolbar: React.FC<ToolbarProps> = ({
  alignment = 'horizontal',
  children,
  className,
  ...passThroughProps
}) => {

  const finalClassName = className
    ? `${className} ${defaultClassName}`
    : defaultClassName;

  return (
    <div
      className={`${finalClassName} ${alignment}-toolbar`}
      role="toolbar"
      {...passThroughProps}
    >
      {children}
    </div>
  );
};

export default Toolbar;

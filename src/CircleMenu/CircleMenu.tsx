import './CircleMenu.less';

import React, {
  useCallback,
  useEffect,
  useRef
} from 'react';

import _isNil from 'lodash/isNil';

import { CSS_PREFIX } from '../constants';

import CircleMenuItem from './CircleMenuItem/CircleMenuItem';

interface OwnProps {
  /**
   * The duration of the animation in milliseconds. Pass 0 to avoid animation.
   */
  animationDuration?: number;
  /**
   * The diameter of the CircleMenu in pixels.
   */
  diameter?: number;
  /**
   * Optional Segement of angles where to show the children.
   */
  segmentAngles?: [number, number];
  className?: string;
  style?: any;
  /**
   * An array containing the x and y coordinates of the CircleMenus Center.
   */
  position: [number, number];
}

export type CircleMenuProps = OwnProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const defaultClassName = `${CSS_PREFIX}circlemenu`;

export const CircleMenu: React.FC<CircleMenuProps> = ({
  animationDuration = 300,
  diameter = 100,
  segmentAngles = [0, 360],
  className,
  style,
  position,
  children,
  ...passThroughProps
}) => {

  const ref = useRef<HTMLDivElement>(null);

  const applyTransformation = useCallback(() => {
    if (ref.current) {
      ref.current.style.width = `${diameter}px`;
      ref.current.style.height = `${diameter}px`;
      ref.current.style.opacity = '1';
    }
  }, [diameter]);

  useEffect(() => {
    setTimeout(applyTransformation, 1);
  }, [applyTransformation]);

  const childrenMapper = (child: React.ReactNode, idx?: number, childs?: React.ReactNode[]): React.ReactNode => {
    if (!childs || _isNil(idx)) {
      return;
    }

    const start = segmentAngles[0];
    const end = segmentAngles[1];
    const range = end - start;
    const amount = range > 270 ? childs.length : childs.length - 1;
    const rotationAngle = start + (range / amount) * idx;

    return (
      <CircleMenuItem
        radius={diameter / 2}
        key={idx}
        rotationAngle={rotationAngle}
        animationDuration={animationDuration}
      >
        {child}
      </CircleMenuItem>
    );
  };

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  const left = position[0] - (diameter / 2);
  const top = position[1] - (diameter / 2);

  return (
    <div
      ref={ref}
      className={finalClassName}
      style={{
        transition: `all ${animationDuration}ms`,
        left: left,
        top: top,
        ...style
      }}
      {...passThroughProps}
    >
      {
        Array.isArray(children)
          ? children.map(childrenMapper)
          : childrenMapper(children)
      }
    </div>
  );
};

export default CircleMenu;

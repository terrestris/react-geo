import './CircleMenuItem.less';

import React, {
  useCallback,
  useEffect,
  useRef
} from 'react';

import { CSS_PREFIX } from '../../constants';

export interface CircleMenuItemProps {
  /**
   * The duration of the animation in milliseconds. Pass 0 to avoid animation.
   */
  animationDuration?: number;
  className?: string;
  /**
   * The radius of the CircleMenu in pixels.
   */
  radius: number;
  /**
   * The children of the CircleMenuItem. Should be just one Node.
   */
  children?: React.ReactNode;
  /**
   * The rotation Angle in degree.
   */
  rotationAngle: number;
}

export const CircleMenuItem: React.FC<CircleMenuItemProps> = ({
  rotationAngle,
  radius,
  animationDuration = 300,
  className,
  children,
  ...passThroughProps
}) => {

  const finalClassName = className
    ? `${className} ${CSS_PREFIX}circlemenuitem`
    : `${CSS_PREFIX}circlemenuitem`;

  const ref = useRef<HTMLDivElement>(null);

  const applyTransformation = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = `rotate(${rotationAngle}deg) translate(${radius}px) rotate(-${rotationAngle}deg)`;
    }
  }, [radius, rotationAngle]);

  useEffect(() => {
    setTimeout(applyTransformation, 1);
  }, [rotationAngle, radius, applyTransformation]);

  return (
    <div
      className={finalClassName}
      ref={ref}
      role="menuitem"
      style={{
        display: 'block',
        top: '50%',
        left: '50%',
        margin: '-1.3em',
        position: 'absolute',
        transform: 'rotate(0deg) translate(0px) rotate(0deg)',
        transition: `transform ${animationDuration}ms`
      }}
      {...passThroughProps}
    >
      {children}
    </div>
  );
};

export default CircleMenuItem;

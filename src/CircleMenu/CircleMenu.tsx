import * as React from 'react';

import CircleMenuItem from './CircleMenuItem/CircleMenuItem';
import { CSS_PREFIX } from '../constants';

import './CircleMenu.less';

interface DefaultProps {
  /**
   * The duration of the animation in milliseconds. Pass 0 to avoid animation.
   */
  animationDuration: number;
  /**
   * The diameter of the CircleMenu in pixels.
   */
  diameter: number;
  /**
   * Optional Segement of angles where to show the children.
   */
  segmentAngles: [number, number];
}

interface BaseProps {
  className?: string;
  style?: any;
  /**
   * An array containing the x and y coordinates of the CircleMenus Center.
   */
  position: [number, number];
}

export type CircleMenuProps = BaseProps
& Partial<DefaultProps>
& React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/**
 * The CircleMenu.
 *
 * @class CircleMenu
 * @extends React.Component
 */
export class CircleMenu extends React.Component<CircleMenuProps> {

  /**
   * The className added to this component.
   * @private
   */
  _className = `${CSS_PREFIX}circlemenu`;

  /**
   * Internal reference used to apply the transformation right on the div.
   * @private
   */
  _ref = null;

  static defaultProps: DefaultProps = {
    animationDuration: 300,
    diameter: 100,
    segmentAngles: [0, 360]
  };

  /**
   * A react lifecycle method called when the component did mount.
   * It calls the applyTransformation method right after mounting.
   */
  componentDidMount() {
    setTimeout(this.applyTransformation.bind(this), 1);
  }

  /**
   * A react lifecycle method called when the component did update.
   * It calls the applyTransformation method right after updating.
   */
  componentDidUpdate() {
    setTimeout(this.applyTransformation.bind(this), 1);
  }

  /**
   * Applies the transformation to the component.
   */
  applyTransformation() {
    if (this._ref) {
      this._ref.style.width = `${this.props.diameter}px`;
      this._ref.style.height = `${this.props.diameter}px`;
      this._ref.style.opacity = 1;
    }
  }

  childrenMapper = (child: React.ReactNode, idx?: number, children?: React.ReactNode[]): React.ReactNode => {
    const {
      diameter,
      segmentAngles,
    } = this.props;
    const start = segmentAngles[0];
    const end = segmentAngles[1];
    const range = end - start;
    const amount = range > 270 ? children.length : children.length - 1;
    const rotationAngle = start + (range / amount) * idx;
    return (
      <CircleMenuItem
        radius={diameter / 2}
        rotationAngle={rotationAngle}
        animationDuration={this.props.animationDuration}
        key={idx}
      >
        {child}
      </CircleMenuItem>
    );
  };

  /**
   * The render function.
   */
  render() {
    const {
      animationDuration,
      className,
      diameter,
      children,
      position,
      segmentAngles,
      style,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this._className}`
      : this._className;

    return (
      <div
        ref={i => this._ref = i}
        className={finalClassName}
        style={{
          transition: `all ${animationDuration}ms`,
          left: position[0] - (diameter / 2),
          top: position[1] - (diameter / 2),
          ...style
        }}
        {...passThroughProps}
      >
        {
          Array.isArray(children)
            ? children.map(this.childrenMapper)
            : this.childrenMapper(children)
        }
      </div>
    );
  }
}

export default CircleMenu;

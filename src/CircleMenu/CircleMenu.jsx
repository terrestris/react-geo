import React from 'react';
import PropTypes from 'prop-types';

import CircleMenuItem from './CircleMenuItem/CircleMenuItem.jsx';

import './CircleMenu.less';

/**
 * The CircleMenu.
 *
 * @class CircleMenu
 * @extends React.Component
 */
export class CircleMenu extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = 'react-geo-circlemenu';

  /**
   * Internal reference used to apply the transformation right on the div.
   * @private
   */
  _ref = null;

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    /**
     * The duration of the animation in milliseconds. Pass 0 to avoid animation.
     * Default is 300.
     *
     * @type {Number}
     */
    animationDuration: PropTypes.number,
    /**
     * The diameter of the CircleMenu in pixels. Default is 100.
     *
     * @type {Number}
     */
    diameter: PropTypes.number,
    /**
     * The children of the CircleMenu. Most common are buttons.
     *
     * @type {Node}
     */
    children: PropTypes.node.isRequired,
    /**
     * An array containing the x and y coordinates of the CircleMenus Center.
     * @type {Number[]}
     */
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    /**
     * Optional Segement of angles where to show the children. Default is [0, 360].
     */
    segmentAngles: PropTypes.arrayOf(PropTypes.number)
  };

  static defaultProps = {
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
      ? `${className} ${this.className}`
      : this.className;

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
          children.map((child, idx, children) => {
            const start = segmentAngles[0];
            const end = segmentAngles[1];
            const range = end - start;
            const amount = range > 270 ? children.length : children.length - 1;
            const rotationAngle = start + (range / amount) * idx;
            return (
              <CircleMenuItem
                radius={diameter / 2}
                rotationAngle={rotationAngle}
                idx={idx}
                animationDuration={this.props.animationDuration}
                key={idx}
              >
                {child}
              </CircleMenuItem>
            );
          })
        }
      </div>
    );
  }
}

export default CircleMenu;

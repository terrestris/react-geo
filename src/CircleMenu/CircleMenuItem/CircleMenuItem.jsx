import React from 'react';
import PropTypes from 'prop-types';

import { CSS_PREFIX } from '../../constants';

import './CircleMenuItem.less';

/**
 * The CircleMenuItem.
 *
 * @class CircleMenuItem
 * @extends React.Component
 */
export class CircleMenuItem extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}circlemenuitem`;

  /**
   * Internal reference used to apply the transformation right on the div.
   * @private
   */
  _ref = null;

  static propTypes = {
    className: PropTypes.string,
    /**
     * The duration of the animation in milliseconds. Pass 0 to avoid animation.
     * Default is 300.
     *
     * @type {Number}
     */
    animationDuration: PropTypes.number,
    /**
     * The radius of the CircleMenu in pixels.
     *
     * @type {Number}
     */
    radius: PropTypes.number.isRequired,
    /**
     * The children of the CircleMenuItem. Should be just one Node.
     *
     * @type {Node}
     */
    children: PropTypes.node,
    /**
     * The rotation Angle in degree.
     *
     * @type {Number}
     */
    rotationAngle: PropTypes.number.isRequired,
  };

  static defaultProps = {
    animationDuration: 300
  };

  /**
   * A react lifecycle method called when the component did mount.
   * It calls the applyTransformation method right after updating.
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
    const {
      rotationAngle,
      radius
    } = this.props;
    this._ref.style.transform = `rotate(${rotationAngle}deg) translate(${radius}px) rotate(-${rotationAngle}deg)`;
  }

  /**
   * The render function.
   */
  render() {
    const {
      rotationAngle,
      radius,
      animationDuration,
      className,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    return (
      <div
        className={finalClassName}
        ref={i => this._ref = i}
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
        {this.props.children}
      </div>
    );
  }
}

export default CircleMenuItem;

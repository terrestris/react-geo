import React from 'react';
import PropTypes from 'prop-types';

/**
 * The CircleMenuItem.
 *
 * @class CircleMenuItem
 * @extends React.Component
 */
export class CircleMenuItem extends React.Component {

  _ref = null;

  static propTypes = {
    /**
     * The duration of the animation in milliseconds. Pass 0 to avoid animation.
     * Default is 300.
     *
     * @type {Number}
     */
    animationDuration: PropTypes.number,
    /**
     * The index of the current CircleMenuItem.
     */
    idx: PropTypes.number,
    /**
     * The radius of the CircleMenu.
     *
     * @type {Number}
     */
    radius: PropTypes.number,
    /**
     * The children of the CircleMenuItem. Should be just one Node.
     *
     * @type {Node}
     */
    children: PropTypes.node,
    /**
     * The rotation Angel
     *
     * @type {Number}
     */
    rotationAngle: PropTypes.number
  };

  static defaultProps = {
    animationDuration: 300,
    visible: false
  };

  /**
   * Create the CircleMenuItem.
   *
   * @constructs CircleMenuItem
   */
  constructor () {
    super();
  }

  /**
   * A react lifecylce method called when the component did mount.
   * It calls the applyTransformation method right after updating.
   */
  componentDidMount() {
    setTimeout(this.applyTransformation.bind(this), 1);
  }

  /**
   * A react lifecylce method called when the component did update.
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
      animationDuration
    } = this.props;

    return (
      <div
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
      >
        {this.props.children}
      </div>
    );
  }
}

export default CircleMenuItem;

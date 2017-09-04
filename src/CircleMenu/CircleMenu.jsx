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
     * The diameter of the CircleMenu. Default is 100.
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
     * An Array containing the x and y coordinates of the CircleMenus Center.
     * @type {Number[]}
     */
    position: PropTypes.arrayOf(PropTypes.number).isRequired
  };

  static defaultProps = {
    animationDuration: 300,
    diameter: 100
  };

  /**
   * Create the CircleMenu.
   *
   * @param {Object} props The initial props.
   * @constructs CircleMenu
   */
  constructor(props) {
    super(props);
    this.state = {
      items: props.children
    };
  }

  /**
   * A react lifecylce method called when the component did mount.
   * It calls the applyTransformation method right after mounting.
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
    if (this._ref) {
      this._ref.style.width = `${this.props.diameter}px`;
      this._ref.style.height = `${this.props.diameter}px`;
      this._ref.style.opacity = 1;
    }
  }

  /**
   * A react lifecylce method called when the component received props.
   *
   * @param {Object} nextProps The new received props.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.children != nextProps.children) {
      this.setState({
        items: nextProps.children
      });
    }
  }

  /**
   * The render function.
   */
  render() {
    const {
      animationDuration,
      position
    } = this.props;

    return (
      <div
        ref={i => this._ref = i}
        className="circleContainer"
        style={{
          transition: `all ${animationDuration}ms`,
          opacity: 0,
          width: 0,
          height: 0,
          top: position[0],
          left: position[1]
        }}
      >
        {
          this.props.children.map((child, idx, children) => {
            return (
              <CircleMenuItem
                radius={this.props.diameter / 2}
                rotationAngle={(360 / children.length) * idx}
                idx={idx}
                animationDuration={this.props.animationDuration}
                allChildren={children}
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

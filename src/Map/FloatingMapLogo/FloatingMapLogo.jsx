import React from 'react';
import PropTypes from 'prop-types';
import './FloatingMapLogo.less';

import { CSS_PREFIX } from '../../constants';

/**
 * Class representing a floating map logo
 *
 * @class The FloatingMapLogo
 * @extends React.Component
 */
class FloatingMapLogo extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}floatingmaplogo`

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
    /**
     * An optional CSS class which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * The imageSrc (required property).
     * @type {String}
     */
    imageSrc: PropTypes.string.isRequired,

    /**
     * The image height
     * @type {String}
     */
    imageHeight: PropTypes.string,

    /**
     * Whether the map-logo is absolutely postioned or not
     * @type {boolean}
     */
    absolutelyPostioned: PropTypes.bool,

    /**
     * The style object
     * @type {Object}
     */
    style: PropTypes.object
  }

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps = {
    imageSrc: 'logo.png',
    absolutelyPostioned: false
  }

  /**
   * The render function.
   */
  render() {
    const {
      imageSrc,
      imageHeight,
      absolutelyPostioned,
      className,
      style
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    if (absolutelyPostioned) {
      Object.assign(style, {'position': 'absolute'});
    }

    return (
      <img
        className={finalClassName}
        src={imageSrc}
        height={imageHeight}
        style={style}
      >
      </img>
    );
  }
}

export default FloatingMapLogo;

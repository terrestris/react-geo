import React from 'react';
import PropTypes from 'prop-types';
import './FloatingMapLogo.less';

/**
 * Class representating a floating map logo
 *
 * @class The FloatingMapLogo
 * @extends React.Component
 */
class FloatingMapLogo extends React.Component {

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
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
      style
    } = this.props;

    if (absolutelyPostioned) {
      Object.assign(style, {'position': 'absolute'});
    }

    return (
      <img
        className="map-logo"
        src={imageSrc}
        height={imageHeight}
        style={style}
      >
      </img>
    );
  }
}

export default FloatingMapLogo;

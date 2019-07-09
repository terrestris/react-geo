import React from 'react';
import './FloatingMapLogo.less';

import { CSS_PREFIX } from '../../constants';
// i18n
export interface WindowLocale {
}

interface FloatingMapLogoDefaultProps extends React.HTMLAttributes<HTMLImageElement> {
  /**
   * The imageSrc.
   */
  imageSrc: string;
  /**
   * Whether the map-logo is absolutely postioned or not
   */
  absolutelyPositioned: boolean;
}

export interface FloatingMapLogoProps extends Partial<FloatingMapLogoDefaultProps> {
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * The image height
   */
  imageHeight: string;
}

/**
 * Class representing a floating map logo
 *
 * @class The FloatingMapLogo
 * @extends React.Component
 */
class FloatingMapLogo extends React.Component<FloatingMapLogoProps> {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}floatingmaplogo`;

  /**
   * The properties.
   * @type {Object}
   */
  static propTypes = {
  };

  /**
   * The default properties.
   * @type {Object}
   */
  static defaultProps: FloatingMapLogoDefaultProps = {
    imageSrc: 'logo.png',
    absolutelyPositioned: false
  };

  /**
   * The render function.
   */
  render() {
    const {
      imageSrc,
      imageHeight,
      absolutelyPositioned,
      className,
      style
    } = this.props;

    const finalClassName = className
      ? `${className} ${this.className}`
      : this.className;

    if (absolutelyPositioned) {
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

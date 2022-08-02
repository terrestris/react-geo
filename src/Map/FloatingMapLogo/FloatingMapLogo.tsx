import * as React from 'react';

import _cloneDeep from 'lodash/cloneDeep';

import './FloatingMapLogo.less';

import { CSS_PREFIX } from '../../constants';
// i18n
export interface WindowLocale {
}

interface DefaultProps {
  /**
   * Whether the map-logo is absolutely postioned or not
   */
  absolutelyPositioned: boolean;
}

interface BaseProps {
  /**
   * The imageSrc.
   */
  imageSrc: string;
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * The image height
   */
  imageHeight?: string;
}

export type FloatingMapLogoProps = BaseProps & Partial<DefaultProps> & React.HTMLAttributes<HTMLImageElement>;

/**
 * Class representing a floating map logo
 *
 * @class The FloatingMapLogo
 * @extends React.Component
 */
class FloatingMapLogo extends React.Component<FloatingMapLogoProps> {

  /**
   * The default properties.
   */
  static defaultProps: DefaultProps = {
    absolutelyPositioned: false
  };

  /**
   * The className added to this component.
   * @private
   */
  className = `${CSS_PREFIX}floatingmaplogo`;

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

    let imgStyle = style ? _cloneDeep(style) : {};

    if (absolutelyPositioned) {
      Object.assign(imgStyle, {'position': 'absolute'});
    }

    return (
      <img
        className={finalClassName}
        src={imageSrc}
        height={imageHeight}
        style={imgStyle}
      >
      </img>
    );
  }
}

export default FloatingMapLogo;

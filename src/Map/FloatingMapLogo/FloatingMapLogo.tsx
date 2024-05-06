import './FloatingMapLogo.less';

import _cloneDeep from 'lodash/cloneDeep';
import * as React from 'react';

import { CSS_PREFIX } from '../../constants';

export type FloatingMapLogoProps = Exclude<React.ComponentProps<'img'>, 'src' | 'height'> & {
  /**
   * Whether the map logo is absolutely postioned or not. Default is false.
   */
  absolutelyPositioned?: boolean;

  /**
   * The imageSrc.
   */
  imageSrc: string;

  /**
   * The image height
   */
  imageHeight?: string;
};

export const FloatingMapLogo: React.FC<FloatingMapLogoProps> = ({
  absolutelyPositioned = false,
  imageSrc,
  className,
  imageHeight,
  style,
  ...passThroughProps
}): JSX.Element => {

  const defaultClassName = `${CSS_PREFIX}floatingmaplogo`;

  const finalClassName = className
    ? `${className} ${defaultClassName}`
    : defaultClassName;

  let imgStyle = style ? _cloneDeep(style) : {};

  if (absolutelyPositioned) {
    imgStyle = {
      ...imgStyle,
      ...{
        position: 'absolute'
      }
    };
  }

  return (
    <img
      className={finalClassName}
      src={imageSrc}
      height={imageHeight}
      style={imgStyle}
      {...passThroughProps}
    />
  );
};

export default FloatingMapLogo;

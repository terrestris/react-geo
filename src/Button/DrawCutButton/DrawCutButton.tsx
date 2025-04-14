import React, {FC, useCallback, useRef, useState} from 'react';

import {Popconfirm, PopconfirmProps} from 'antd';

import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyle, { StyleLike as OlStyleLike } from 'ol/style/Style';

import {useDrawCut} from '@terrestris/react-util';
import useOlLayer from '@terrestris/react-util/dist/Hooks/useOlLayer/useOlLayer';

import { CSS_PREFIX } from '../../constants';
import ToggleButton, {ToggleButtonProps} from '../ToggleButton/ToggleButton';

interface OwnProps {
  /**
   * Style object / style function for drawn feature.
   */
  drawStyle?: OlStyleLike;
  /**
   * Style object / style function for highlighting the cut geometry.
   */
  highlightStyle?: OlStyleLike;
  /**
   * The vector layer which will be used for digitize features.
   * The standard digitizeLayer can be retrieved via `DigitizeUtil.getDigitizeLayer(map)`.
   */
  digitizeLayer?: OlVectorLayer<OlVectorSource>;
  /**
   * This callback is called after the cut was performed with all changed features. Removed features geometry is set to
   * undefined.
   */
  onCutEnd?: (changed: OlFeature[]) => void;
  /**
   * Text to show in the Popconfirm after drawing the cut.
   */
  popConfirmText?: string;
  /**
   * Props to pass to the antd Popconfirm component.
   */
  popConfirmProps?: Omit<PopconfirmProps, 'onConfirm'|'onCancel'|'open'|'title'>;
}

export type DrawCutProps = OwnProps & Partial<ToggleButtonProps>;

export const defaultHighlightStyle = new OlStyle({
  stroke: new OlStyleStroke({
    color: 'rgba(232, 38, 11, 0.9)',
    width: 2
  })
});

/**
 * The className added to this component.
 */
const defaultClassName = `${CSS_PREFIX}drawcutbutton`;

export const DrawCutButton: FC<DrawCutProps> = ({
  digitizeLayer,
  drawStyle,
  className,
  onCutEnd,
  pressed,
  popConfirmProps,
  highlightStyle = defaultHighlightStyle,
  popConfirmText = 'Perform cut?',
  ...passThroughProps
}) => {
  const [popOpen, setPopOpen] = useState(false);

  const promise = useRef<PromiseWithResolvers<boolean>>();

  const highlightLayer = useOlLayer(() => new OlVectorLayer({
    source: new OlVectorSource(),
    style: highlightStyle
  }), []);

  const onCutStart = useCallback((geom: OlGeometry) => {
    if (promise.current) {
      promise.current.reject();
    }

    promise.current = Promise.withResolvers();

    highlightLayer?.getSource()?.clear();
    highlightLayer?.getSource()?.addFeature(new OlFeature(geom));

    setPopOpen(true);

    return promise.current.promise;
  }, [highlightLayer]);

  const resolvePopConfirm = useCallback((value: boolean) => {
    return () => {
      promise.current?.resolve(value);
      promise.current = undefined;
      highlightLayer?.getSource()?.clear();
      setPopOpen(false);
    };
  }, [highlightLayer]);

  useDrawCut({
    digitizeLayer,
    drawStyle,
    active: !!pressed,
    onCutStart,
    onCutEnd
  });

  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  const btnWrapperClass = `${CSS_PREFIX}digitize-button-wrapper`;

  return (
    <span className={btnWrapperClass}>
      <Popconfirm
        open={popOpen}
        onConfirm={resolvePopConfirm(true)}
        onCancel={resolvePopConfirm(false)}
        title={popConfirmText}
        {...popConfirmProps}
      >
        <ToggleButton
          pressed={pressed}
          className={finalClassName}
          disabled={popOpen}
          {...passThroughProps}
        />
      </Popconfirm>
    </span>
  );
};

export default DrawCutButton;

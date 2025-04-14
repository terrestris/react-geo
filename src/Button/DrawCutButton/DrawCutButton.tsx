import React, {FC, useCallback, useRef, useState} from 'react';

import {Popconfirm, PopconfirmProps} from "antd";

import { StyleLike as OlStyleLike } from 'ol/style/Style';
import OlVectorLayer from "ol/layer/Vector";
import OlVectorSource from "ol/source/Vector";

import {useDrawCut} from "@terrestris/react-util";

import ToggleButton, {ToggleButtonProps} from "../ToggleButton/ToggleButton";
import { CSS_PREFIX } from '../../constants';

interface OwnProps {
  /**
   * Style object / style function for drawn feature.
   */
  drawStyle?: OlStyleLike;
  /**
   * The vector layer which will be used for digitize features.
   * The standard digitizeLayer can be retrieved via `DigitizeUtil.getDigitizeLayer(map)`.
   */
  digitizeLayer?: OlVectorLayer<OlVectorSource>;
  /**
   * Props to pass to the antd Popconfirm component.
   */
  popConfirmProps?: Omit<PopconfirmProps, 'onConfirm'|'onCancel'|'open'>;
}

export type DrawCutProps = OwnProps & Partial<ToggleButtonProps>;

/**
 * The className added to this component.
 */
const defaultClassName = `${CSS_PREFIX}drawcutbutton`;

export const DrawCutButton: FC<DrawCutProps> = ({
  digitizeLayer,
  drawStyle,
  className,
  pressed,
  popConfirmProps,
  ...passThroughProps
}) => {
  const [popOpen, setPopOpen] = useState(false);

  const promise = useRef<PromiseWithResolvers<boolean>>();

  const onCutStart = useCallback(() => {
    if (promise.current) {
      promise.current.reject();
    }

    promise.current = Promise.withResolvers();

    setPopOpen(true);

    return promise.current.promise;
  }, [])

  const resolvePopConfirm = useCallback((value: boolean) => {
    return () => {
      promise.current?.resolve(value);
      promise.current = undefined;
      setPopOpen(false);
    }
  }, []);

  useDrawCut({
    digitizeLayer,
    drawStyle,
    active: !!pressed,
    onCutStart
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
        title={"Perform Cut"}
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

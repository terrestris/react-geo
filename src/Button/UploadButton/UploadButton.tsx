import './UploadButton.less';

import * as React from 'react';

import { CSS_PREFIX } from '../../constants';
import SimpleButton, { SimpleButtonProps } from '../SimpleButton/SimpleButton';

export interface OwnProps {
  /**
   * The className which should be added.
   */
  className?: string;
  /**
   * Object of props that should be passed to the input field.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
   * The onChange handler for the upload input field.
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export type UploadButtonProps = OwnProps & SimpleButtonProps;

/**
 * Component representing an upload button. Can be used as wrapper if children
 * are given. Otherwise a Simplebutton will be rendered.
 *
 * To use a text with the UploadButton provide a SimpleButton as children.
 *
 * This automatically supports uploads via drag and drop from the operating
 * system.
 */
const UploadButton: React.FC<UploadButtonProps> = ({
  className,
  children,
  onChange,
  inputProps,
  ...passThroughProps
}) => {

  const finalClassName = className
    ? `${className} ${CSS_PREFIX}uploadbutton`
    : `${CSS_PREFIX}uploadbutton`;

  const button = <SimpleButton {...passThroughProps} />;

  return (
    <div
      className={finalClassName}
    >
      {children || button}
      <input
        type="file"
        onChange={onChange}
        {...inputProps}
      />
    </div>
  );
};

export default UploadButton;

import * as React from 'react';

import SimpleButton, { SimpleButtonProps } from '../SimpleButton/SimpleButton';
import { CSS_PREFIX } from '../../constants';

import './UploadButton.less';

interface BaseProps {
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

export type UploadButtonProps = BaseProps & SimpleButtonProps;

/**
 * Class representing an upload button. Can be used as wrapper if children
 * are given. Otherwise a Simplebutton will be rendered.
 *
 * To use a text with the UploadButton provide a SimpleButton as children.
 *
 * This automatically supports uploads via drag and drop from the operating
 * system.
 *
 * @class The UploadButton
 * @extends React.Component
 */


const UploadButton: React.FC<UploadButtonProps> = ({
  className,
  children,
  onChange,
  inputProps,
  ...passThroughProps
}
) => {

  const defaultClassName = `${CSS_PREFIX}uploadbutton`;
  /**
   * The className added to this component.
   * @private
   */

  const finalClassName = className
    ? `${className} ${defaultClassName}`
    : defaultClassName;

  const button = <SimpleButton {...passThroughProps} />;

  return (
    <div className={finalClassName}>
      {children || button}
      <input type="file" onChange={onChange} {...inputProps} />
    </div>
  );
};

export default UploadButton;

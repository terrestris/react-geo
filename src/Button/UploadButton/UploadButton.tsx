import './UploadButton.less';

import * as React from 'react';

import { CSS_PREFIX } from '../../constants';
import SimpleButton, { SimpleButtonProps } from '../SimpleButton/SimpleButton';

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
class UploadButton extends React.Component<UploadButtonProps> {

  /**
   * The className added to this component.
   * @private
   */
  _className = `${CSS_PREFIX}uploadbutton`;

  /**
   * The render function.
   */
  render() {
    const {
      className,
      children,
      onChange,
      inputProps,
      ...passThroughProps
    } = this.props;

    const finalClassName = className
      ? `${className} ${this._className}`
      : this._className;

    const button = <SimpleButton {...passThroughProps} />;

    return (
      <div className={finalClassName}>
        {children || button}
        <input type="file" onChange={onChange} {...inputProps} />
      </div>
    );
  }
}

export default UploadButton;

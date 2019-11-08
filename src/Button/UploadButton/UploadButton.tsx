import * as React from 'react';

import SimpleButton from '../SimpleButton/SimpleButton';
import { CSS_PREFIX } from '../../constants';

import './UploadButton.less';

export interface UploadButtonProps {
  /**
   * The className which should be added.
   */
  className?: string;

  /**
   * The onChange handler for the upload input field.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Object of props that should be passed to the input field.
   */
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

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
   * @type {String}
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

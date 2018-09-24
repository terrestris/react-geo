import React from 'react';
import PropTypes from 'prop-types';

import  {
  SimpleButton
} from '../../index';
import { CSS_PREFIX } from '../../constants';

import './UploadButton.less';

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
class UploadButton extends React.Component {

  /**
   * The className added to this component.
   * @type {String}
   * @private
   */
  className = `${CSS_PREFIX}uploadbutton`

  static propTypes = {
    /**
     * The className which should be added.
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * The children.
     * @type {Object}
     */
    children: PropTypes.node,

    /**
     * The onChange handler for the upload input field.
     * @type {Function}
     */
    onChange: PropTypes.func,

    /**
     * Object of props that should be passed to the input field.
     * @type {Object}
     */
    inputProps: PropTypes.object
  }

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
      ? `${className} ${this.className}`
      : this.className;

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

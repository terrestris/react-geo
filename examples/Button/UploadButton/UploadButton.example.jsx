import React from 'react';
import { render } from 'react-dom';
import { message } from 'antd';
import  {SimpleButton, UploadButton } from '../../index.js';

/**
 * The onChange handler of the input fields.
 *
 * @param {event} e The change event of the input field.
 */
const onChange = (e) => {
  message.info('You uploaded ' + e.target.files[0].name);
};

render(
  <div>
    <div className="example-block">
      <label>UploadButton:<br />
        <UploadButton onChange={onChange} icon="upload" />
      </label>
    </div>

    <div className="example-block">
      <label>UploadButton with a texted SimpleButton as child:<br />
        <UploadButton onChange={onChange}>
          <SimpleButton>Upload</SimpleButton>
        </UploadButton>
      </label>
    </div>

    <div className="example-block">
      <UploadButton onChange={onChange}>
        <span style={{fontWeight: 'bold'}}>Click me to upload!</span>
      </UploadButton>
    </div>
  </div>,
  document.getElementById('exampleContainer')
);

This example demonstrates the use of the `UploadButton`.

UploadButton:

```jsx
const message = require('antd').message;

<UploadButton
  onChange={e => {
    message.info('You uploaded ' + e.target.files[0].name);
  }}
  icon="upload"
/>
```

UploadButton with a texted SimpleButton as child:

```jsx
const message = require('antd').message;

<UploadButton
  onChange={e => {
    message.info('You uploaded ' + e.target.files[0].name);
  }}
>
  <SimpleButton>Upload</SimpleButton>
</UploadButton>
```

```jsx
const message = require('antd').message;

<UploadButton
  onChange={e => {
    message.info('You uploaded ' + e.target.files[0].name);
  }}
>
  <span style={{fontWeight: 'bold'}}>Click me to upload!</span>
</UploadButton>
```
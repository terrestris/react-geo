This example demonstrates the use of the `UploadButton`.

UploadButton:

```jsx
import UploadButton from '@terrestris/react-geo/dist/Button/UploadButton/UploadButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

<UploadButton
  onChange={e => {
    alert('You uploaded ' + e.target.files[0].name);
  }}
  icon={
    <FontAwesomeIcon
      icon={faUpload}
    />
  }
/>
```

UploadButton with a texted SimpleButton as child:

```jsx
import UploadButton from '@terrestris/react-geo/dist/Button/UploadButton/UploadButton';
import SimpleButton from '@terrestris/react-geo/dist/Button/SimpleButton/SimpleButton';

<UploadButton
  onChange={e => {
    alert('You uploaded ' + e.target.files[0].name);
  }}
>
  <SimpleButton>Upload</SimpleButton>
</UploadButton>
```

```jsx
import UploadButton from '@terrestris/react-geo/dist/Button/UploadButton/UploadButton';

<UploadButton
  onChange={e => {
    alert('You uploaded ' + e.target.files[0].name);
  }}
>
  <span style={{fontWeight: 'bold'}}>Click me to upload!</span>
</UploadButton>
```

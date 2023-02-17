This is a example using a toolbar having vertically and horizontally aligned child elements (buttons in this example).

```jsx
import SimpleButton from '@terrestris/react-geo/dist/Button/SimpleButton/SimpleButton';
import Toolbar from '@terrestris/react-geo/dist/Toolbar/Toolbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faInfo } from '@fortawesome/free-solid-svg-icons';

<div>
  <Toolbar>
    <SimpleButton
      type="primary"
      shape="circle"
      icon={
        <FontAwesomeIcon
          icon={faSearch}
        />
      }
    />
    <SimpleButton
      type="primary"
      shape="circle"
      icon={
        <FontAwesomeIcon
          icon={faSearch}
        />
      }
    />
    <SimpleButton
      type="primary"
      shape="circle"
      icon={
        <FontAwesomeIcon
          icon={faSearch}
        />
      }
    />
  </Toolbar>

  <hr
    style={{
      margin: '1em'
    }}
  />

  <Toolbar
    alignment="vertical"
    style={{
      position: 'unset'
    }}
  >
    <SimpleButton
      type="primary"
      shape="circle"
      icon={
        <FontAwesomeIcon
          icon={faInfo}
        />
      }
    />
    <SimpleButton
      type="primary"
      shape="circle"
      icon={
        <FontAwesomeIcon
          icon={faInfo}
        />
      }
    />
    <SimpleButton
      type="primary"
      shape="circle"
      icon={
        <FontAwesomeIcon
          icon={faInfo}
        />
      }
    />
  </Toolbar>
</div>
```

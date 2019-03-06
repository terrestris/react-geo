This is a example using a toolbar having vertically and horizontally aligned child elements (buttons in this example).

```jsx
import SimpleButton from '@terrestris/react-geo/Button/SimpleButton/SimpleButton';
import Toolbar from '@terrestris/react-geo/Toolbar/Toolbar';

<div>
  <Toolbar>
    <SimpleButton type="primary" shape="circle" icon="search" />
    <SimpleButton type="primary" shape="circle" icon="search" />
    <SimpleButton type="primary" shape="circle" icon="search" />
  </Toolbar>

  <hr
    style={{
      margin: '1em'
    }}
  />

  <Toolbar alignment="vertical" style={{
    position: 'unset'
  }}>
    <SimpleButton type="primary" shape="circle" icon="info" />
    <SimpleButton type="primary" shape="circle" icon="info" />
    <SimpleButton type="primary" shape="circle" icon="info" />
  </Toolbar>
</div>
```

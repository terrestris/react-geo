This is a example using a toolbar having vertically and horizontally aligned child elements (buttons in this example).

```jsx
import SimpleButton from '@terrestris/react-geo/Button/SimpleButton/SimpleButton';
import Toolbar from '@terrestris/react-geo/Toolbar/Toolbar';

<div>
  <Toolbar>
    <SimpleButton type="primary" shape="circle" iconName="search" />
    <SimpleButton type="primary" shape="circle" iconName="search" />
    <SimpleButton type="primary" shape="circle" iconName="search" />
  </Toolbar>

  <hr
    style={{
      margin: '1em'
    }}
  />

  <Toolbar alignment="vertical" style={{
    position: 'unset'
  }}>
    <SimpleButton type="primary" shape="circle" iconName="info" />
    <SimpleButton type="primary" shape="circle" iconName="info" />
    <SimpleButton type="primary" shape="circle" iconName="info" />
  </Toolbar>
</div>
```

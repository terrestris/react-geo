This example shows the usage of the VisibleComponent HOC (High Order Component) to
determine the visibility of a component based on a `activeModules` property. Typically
this property is managed globally by `react-redux` (or similiar).

In the example below you see three components wrapped by the use of
`isVisibleComponent`. As the second one's name isn't listed in the activeModules,
it won't be rendered.

```jsx
import Button from 'antd/lib/button';

import { isVisibleComponent } from '@terrestris/react-geo/HigherOrderComponent/VisibleComponent/VisibleComponent';

// Enhance (any) Component by wrapping it using isVisibleComponent().
const VisibleButton = isVisibleComponent(Button);

// The activeModules is a whitelist of components (identified by it's names) to
// render.
const activeModules = [{
  name: 'visibleButtonName'
}, {
  name: 'anotherVisibleButtonName'
}];

<div>
  <VisibleButton
    name="visibleButtonName"
    activeModules={activeModules}
    type="primary"
    shape="circle"
    icon="search"
  />
  <VisibleButton
    name="notVisibleButtonName"
    activeModules={activeModules}
    type="primary"
    shape="circle"
    icon="search"
  />
  <VisibleButton
    name="anotherVisibleButtonName"
    activeModules={activeModules}
    type="primary"
    shape="circle"
    icon="poweroff"
  />
</div>
```

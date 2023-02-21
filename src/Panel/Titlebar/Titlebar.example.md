This example demonstrates the Titlebar.

Just a Titlebar:

```jsx
import Titlebar from '@terrestris/react-geo/dist/Panel/Titlebar/Titlebar';

<Titlebar />
```

A Titlebar with a title:

```jsx
import Titlebar from '@terrestris/react-geo/dist/Panel/Titlebar/Titlebar';

<Titlebar>
  Title
</Titlebar>
```

A Titlebar with a title and tools

```jsx
import SimpleButton from '@terrestris/react-geo/dist/Button/SimpleButton/SimpleButton';
import Titlebar from '@terrestris/react-geo/dist/Panel/Titlebar/Titlebar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

<Titlebar
  tools={[
    <SimpleButton
      icon={
        <FontAwesomeIcon
          icon={faGlobe}
        />
      }
      tooltip="globe-tool"
      key="globe-tool"
      size="small"
    />
  ]}
>
  A Titlebar with a title and tools
</Titlebar>
```

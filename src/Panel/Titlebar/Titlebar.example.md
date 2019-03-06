This example demonstrates the Titlebar.

Just a Titlebar:

```jsx
import Titlebar from '@terrestris/react-geo/Panel/Titlebar/Titlebar';

<Titlebar />
```

A Titlebar with a title:

```jsx
import Titlebar from '@terrestris/react-geo/Panel/Titlebar/Titlebar';

<Titlebar>
  Title
</Titlebar>
```

A Titlebar with a title and tools

```jsx
import SimpleButton from '@terrestris/react-geo/Button/SimpleButton/SimpleButton';
import Titlebar from '@terrestris/react-geo/Panel/Titlebar/Titlebar';

<Titlebar
  tools={[
    <SimpleButton
      icon="globe"
      tooltip="globe-tool"
      key="globe-tool"
      size="small"
    />
  ]}
>
  A Titlebar with a title and tools
</Titlebar>
```
This demonstrates the use of ToggleButtons.

A ToggleButton without the basic configuration:

```jsx
import ToggleButton from '@terrestris/react-geo/dist/Button/ToggleButton/ToggleButton';
import * as React from 'react';

const StandaloneToggleButton = () => {
  const [pressed, setPressed] = React.useState();

  return (
    <ToggleButton
      pressed={pressed}
      onChange={() => setPressed(!pressed)}
    >
      Toggle me
    </ToggleButton>
  );
};

<StandaloneToggleButton />
```

A ToggleButton initially pressed:

```jsx
import ToggleButton from '@terrestris/react-geo/dist/Button/ToggleButton/ToggleButton';
import * as React from 'react';

const StandaloneToggleButton = () => {
  const [pressed, setPressed] = React.useState(true);

  return (
    <ToggleButton
      pressed={pressed}
      onChange={() => setPressed(!pressed)}
    >
      Toggle me
    </ToggleButton>
  );
};

<StandaloneToggleButton />
```

A ToggleButton with an icon and a pressedIcon:

```jsx
import { faFaceFrown, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleButton from '@terrestris/react-geo/dist/Button/ToggleButton/ToggleButton';
import * as React from 'react';

const StandaloneToggleButton = () => {
  const [pressed, setPressed] = React.useState();

  return (
    <ToggleButton
      pressed={pressed}
      onChange={() => setPressed(!pressed)}
      icon={
        <FontAwesomeIcon
          icon={faFaceFrown}
        />
      }
      pressedIcon={
        <FontAwesomeIcon
          icon={faFaceSmile}
        />
      }
    />
  );
};

<StandaloneToggleButton />
```

A ToggleButton with a different type and a customized theme:

```jsx
import ToggleButton from '@terrestris/react-geo/dist/Button/ToggleButton/ToggleButton';
import {ConfigProvider} from 'antd';
import * as React from 'react';

const StandaloneToggleButton = () => {
  const [pressed, setPressed] = React.useState();

  return (
    <ConfigProvider theme={{
      cssVar: true,
      components: {
        Button: {
          defaultActiveBg: 'lightgreen'
        }
      },
      token: {
        colorBgBase: 'lightblue'
      }
    }}>
      <ToggleButton
        type="dashed"
        pressed={pressed}
        onChange={() => setPressed(!pressed)}
      >
        Toggle me
      </ToggleButton>
    </ConfigProvider>
  );
};

<StandaloneToggleButton />
```

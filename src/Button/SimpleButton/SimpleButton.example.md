This demonstrates the use of `SimpleButton`. Please have a look at [https://ant.design/components/button/](https://ant.design/components/button/)
for more documentation and examples.

Just a SimpleButton without any configuration:

```jsx
import SimpleButton from '@terrestris/react-geo/dist/Button/SimpleButton/SimpleButton';

<SimpleButton>
  Click me
</SimpleButton>
```

A SimpleButton with a `tooltip` and a `tooltipPlacement`:

```jsx
import SimpleButton from '@terrestris/react-geo/dist/Button/SimpleButton/SimpleButton';

<SimpleButton
  tooltip="bottom tooltip"
  tooltipPlacement="bottom"
>
  Click me
</SimpleButton>
```

A SimpleButton with a Font Awesome icon.

```jsx
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleButton from '@terrestris/react-geo/dist/Button/SimpleButton/SimpleButton';

<SimpleButton
  icon={
    <FontAwesomeIcon
      icon={faCoffee}
    />
  }
/>
```

A round SimpleButton using shape config:

```jsx
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleButton from '@terrestris/react-geo/dist/Button/SimpleButton/SimpleButton';

<SimpleButton
  icon={<FontAwesomeIcon
    icon={faDownload}
  />}
  shape="circle"
/>
```

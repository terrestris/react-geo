This demonstrates the use of `SimpleButton`. Please have a look at [https://ant.design/components/button/](https://ant.design/components/button/)
for more documentation and examples.

Just a SimpleButton without any configuration:

```jsx
import SimpleButton from '@terrestris/react-geo/Button/SimpleButton/SimpleButton';

<SimpleButton />
```

A SimpleButton with a `tooltip` and a `tooltipPlacement`:

```jsx
import SimpleButton from '@terrestris/react-geo/Button/SimpleButton/SimpleButton';

<SimpleButton
  tooltip="bottom tooltip"
  tooltipPlacement="bottom"
/>
```

A SimpleButton with an icon. Just use the font-awesome name:

```jsx
import SimpleButton from '@terrestris/react-geo/Button/SimpleButton/SimpleButton';

<SimpleButton
  icon="bullhorn"
/>
```

A round SimpleButton using shape config:

```jsx
import SimpleButton from '@terrestris/react-geo/Button/SimpleButton/SimpleButton';

<SimpleButton
  icon="bullhorn"
  shape="circle"
/>
```

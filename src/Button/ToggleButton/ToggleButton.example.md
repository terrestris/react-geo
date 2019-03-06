This demonstrates the use of ToggleButtons.

A ToggleButton without any configuration:

```jsx
import ToggleButton from '@terrestris/react-geo/Button/ToggleButton/ToggleButton';

<ToggleButton
  onToggle={()=>{}}
/>
```

A ToggleButton initially pressed:

```jsx
import ToggleButton from '@terrestris/react-geo/Button/ToggleButton/ToggleButton';

<ToggleButton
  pressed={true}
  onToggle={()=>{}}
/>
```

A ToggleButton with an icon and a pressedIcon:

```jsx
import ToggleButton from '@terrestris/react-geo/Button/ToggleButton/ToggleButton';

<ToggleButton
  icon="frown-o"
  pressedIcon="smile-o"
  onToggle={()=>{}}
/>
```

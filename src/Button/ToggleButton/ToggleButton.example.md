This demonstrates the use of ToggleButtons.

A ToggleButton without any configuration:

```jsx
import ToggleButton from '@terrestris/react-geo/Button/ToggleButton/ToggleButton';

<ToggleButton
  onToggle={()=>{}}
>
  Toggle me
</ToggleButton>
```

A ToggleButton initially pressed:

```jsx
import ToggleButton from '@terrestris/react-geo/Button/ToggleButton/ToggleButton';

<ToggleButton
  pressed={true}
  onToggle={()=>{}}
>
  Toggle me
</ToggleButton>
```

A ToggleButton with an icon and a pressedIcon:

```jsx
import ToggleButton from '@terrestris/react-geo/Button/ToggleButton/ToggleButton';

<ToggleButton
  iconName="frown-o"
  pressedIconName="smile-o"
  onToggle={()=>{}}
/>
```

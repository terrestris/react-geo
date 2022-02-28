This demonstrates the use of ToggleGroups.

```jsx
import ToggleGroup from '@terrestris/react-geo/Button/ToggleGroup/ToggleGroup';
import ToggleButton from '@terrestris/react-geo/Button/ToggleButton/ToggleButton';

<ToggleGroup
  allowDeselect={true}
  selectedName="one"
>
  <ToggleButton
    name="one"
    iconName="frown"
    pressedIconName="smile"
    onToggle={()=>{}}
  />
  <ToggleButton
    name="two"
    iconName="frown"
    pressedIconName="smile"
    onToggle={()=>{}}
  />
  <ToggleButton
    name="three"
    iconName="frown"
    pressedIconName="smile"
    onToggle={()=>{}}
  />
</ToggleGroup>
```

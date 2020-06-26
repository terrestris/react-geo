This demonstrates the use of ToggleGroups.

```jsx
import ToggleGroup from '@terrestris/react-geo/Button/ToggleGroup/ToggleGroup';
import ToggleButton from '@terrestris/react-geo/Button/ToggleButton/ToggleButton';

const onChange = (pressed, evt) => {
  console.info('ToggleGroup changed', pressed, evt);
};

<ToggleGroup
  allowDeselect={true}
  selectedName="one"
  onChange={onChange}
>
  <ToggleButton
    name="one"
    iconName="frown-o"
    pressedIconName="smile-o"
    onToggle={()=>{}}
  />
  <ToggleButton
    name="two"
    iconName="frown-o"
    pressedIconName="smile-o"
    onToggle={()=>{}}
  />
  <ToggleButton
    name="three"
    iconName="frown-o"
    pressedIconName="smile-o"
    onToggle={()=>{}}
  />
</ToggleGroup>
```
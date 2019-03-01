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
    icon="frown-o"
    pressedIcon="smile-o"
    onToggle={()=>{}}
  />
  <ToggleButton
    name="two"
    icon="frown-o"
    pressedIcon="smile-o"
    onToggle={()=>{}}
  />
  <ToggleButton
    name="three"
    icon="frown-o"
    pressedIcon="smile-o"
    onToggle={()=>{}}
  />
</ToggleGroup>
```
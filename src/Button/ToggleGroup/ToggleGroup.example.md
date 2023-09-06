This demonstrates the use of ToggleGroups.

```jsx
import { faFaceFrown, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleButton from '@terrestris/react-geo/dist/Button/ToggleButton/ToggleButton';
import ToggleGroup from '@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup';

<ToggleGroup
  allowDeselect={true}
  selectedName="one"
>
  <ToggleButton
    name="one"
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
    onToggle={()=>{}}
  />
  <ToggleButton
    name="two"
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
    onToggle={()=>{}}
  />
  <ToggleButton
    name="three"
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
    onToggle={()=>{}}
  />
</ToggleGroup>
```

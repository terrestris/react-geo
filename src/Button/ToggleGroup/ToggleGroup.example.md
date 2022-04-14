This demonstrates the use of ToggleGroups.

```jsx
import ToggleGroup from '@terrestris/react-geo/Button/ToggleGroup/ToggleGroup';
import ToggleButton from '@terrestris/react-geo/Button/ToggleButton/ToggleButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown, faFaceSmile } from '@fortawesome/free-solid-svg-icons';

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

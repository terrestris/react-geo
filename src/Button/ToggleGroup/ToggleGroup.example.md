This demonstrates the use of ToggleGroups.

```jsx
import { faFaceFrown, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleButton from '@terrestris/react-geo/dist/Button/ToggleButton/ToggleButton';
import ToggleGroup from '@terrestris/react-geo/dist/Button/ToggleGroup/ToggleGroup';
import * as React from 'react';

const ToggleGroupExample = () => {
  const [selected, setSelected] = React.useState();

  return (
    <ToggleGroup
      selected={selected}
      onChange={(evt, value) => {
        setSelected(value)
      }}
    >
      <ToggleButton
        value="one"
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
      <ToggleButton
        value="two"
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
      <ToggleButton
        value="three"
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
    </ToggleGroup>
  );
};

<ToggleGroupExample />
```

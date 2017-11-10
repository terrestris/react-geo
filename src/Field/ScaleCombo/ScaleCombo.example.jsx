import React from 'react';
import { render } from 'react-dom';

import {
  ScaleCombo
} from '../../index.js';

render(
  <ScaleCombo
    map={__EXAMPLE_MAP__}
    style={{'margin': '5px', 'width': '300px'}}
  />,
  document.getElementById('exampleContainerInMap')
);

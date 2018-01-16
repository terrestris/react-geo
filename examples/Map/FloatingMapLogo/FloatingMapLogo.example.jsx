import React from 'react';
import { render } from 'react-dom';

import logo from '../../UserChip/user.png';
import { FloatingMapLogo } from '../../index.js';

render(
  <FloatingMapLogo imageSrc={logo} />,
  document.getElementById('exampleContainerInMap')
);

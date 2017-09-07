import React from 'react';
import { render } from 'react-dom';
import logo from './user.png';
import UserChip from './UserChip.jsx'; //@react-geo@

render(
  <div>
    <UserChip userName="John Doe" />
    <UserChip userName="John Doe" imageSrc={logo} style={{marginTop: '10px'}} />
  </div>,
  document.getElementById('exampleContainer')
);

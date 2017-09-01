import React from 'react';
import { render } from 'react-dom';
import UserChip from '../src/UserChip/UserChip.jsx';

render(
  <div>
    <div>
      <UserChip userName="John Doe"/>
    </div>
    <div style={{marginTop: '10px'}}>
      <UserChip userName="John Doe" imageSrc="./user.png"/>
    </div>
  </div>,
  document.getElementById('exampleContainer')
);

import React from 'react';
import { render } from 'react-dom';
import UserChip from '../src/UserChip/UserChip.jsx';

render(
  <div>
    <UserChip userName="John Doe"/>
    <UserChip userName="John Doe" imageSrc="./user.png" style={{marginTop: '10px'}}/>
  </div>,
  document.getElementById('exampleContainer')
);

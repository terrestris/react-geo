import React from 'react';
import { render } from 'react-dom';
import FloatingMapLogo from './FloatingMapLogo.jsx'; //@react-geo@

render(
  <FloatingMapLogo imageSrc="logo.png"/>,
  document.getElementById('exampleContainerInMap')
);

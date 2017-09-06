import React from 'react';
import { render } from 'react-dom';
import SimpleButton from '../Button/SimpleButton/SimpleButton.jsx'; //@react-geo@
import Toolbar from './Toolbar.jsx'; //@react-geo@

render(
  <div>
    <Toolbar>
      <SimpleButton type="primary" shape="circle" icon="search" />
      <SimpleButton type="primary" shape="circle" icon="search" />
      <SimpleButton type="primary" shape="circle" icon="search" />
    </Toolbar>
    <hr
      style={{
        margin: '1em'
      }}
    />
    <Toolbar alignment="vertical" style={{
      position: 'unset'
    }}>
      <SimpleButton type="primary" shape="circle" icon="info" />
      <SimpleButton type="primary" shape="circle" icon="info" />
      <SimpleButton type="primary" shape="circle" icon="info" />
    </Toolbar>
  </div>,
  document.getElementById('exampleContainer')
);

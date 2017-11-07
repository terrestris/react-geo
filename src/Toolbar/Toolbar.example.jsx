import React from 'react';
import { render } from 'react-dom';
import {
  SimpleButton,
  Toolbar
} from '../index.js';

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

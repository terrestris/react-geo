import React from 'react';
import { render } from 'react-dom';
import { Button } from 'antd';
import Toolbar from './Toolbar.jsx'; //@react-geo@

render(
  <div>
    <Toolbar>
      <Button type="primary" shape="circle" icon="search" />
      <Button type="primary" shape="circle" icon="search" />
      <Button type="primary" shape="circle" icon="search" />
    </Toolbar>
    <hr style="margin: 1em"/>
    <Toolbar alignment="vertical" style={{
      position: 'unset'
    }}>
      <Button type="primary" shape="circle" icon="info" />
      <Button type="primary" shape="circle" icon="info" />
      <Button type="primary" shape="circle" icon="info" />
    </Toolbar>
  </div>,
  document.getElementById('exampleContainer')
);

import React from 'react';
import { render } from 'react-dom';
import SimpleButton from '../../Button/SimpleButton/SimpleButton.jsx'; //@react-geo@

import Titlebar from './Titlebar.jsx'; //@react-geo@

render(
  <div>
    <div className="example-block">
      <span>Just a Titlebar:</span>

      <Titlebar />

    </div>


    <div className="example-block">
      <span>A Titlebar with a title:</span>

      <Titlebar>
        Title
      </Titlebar>

    </div>

    <div className="example-block">
      <span>A Titlebar with a title and tools</span>

      <Titlebar
        tools={[
          <SimpleButton
            icon="globe"
            tooltip="globe-tool"
            key="globe-tool"
            size="small"
          />
        ]}
      >
        A Titlebar with a title and tools
      </Titlebar>

    </div>

  </div>,
  document.getElementById('exampleContainer')
);

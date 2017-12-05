/* eslint-disable no-console */
import React from 'react';
import { render } from 'react-dom';
import { ToggleButton } from '../../index.js';

render(
  <div>
    <div className="example-block">
      <span>Just a ToggleButton:</span>
      <ToggleButton onToggle={()=>null} />

    </div>

    <div className="example-block">
      <span>Initialy pressed ToggleButton:</span>
      <ToggleButton
        // eslint-disable-next-line
        onToggle={()=>{console.log('I start pressed.')}}
        pressed={true}
      />

    </div>

    <div className="example-block">
      <span>pressedIcon:</span>

      {/* A ToggleButton with an icon and a pressedIcon*/}
      <ToggleButton
        onToggle={()=>null}
        icon="frown-o"
        pressedIcon="smile-o"
      />

    </div>

  </div>,
  document.getElementById('exampleContainer')
);

import React from 'react';
import { render } from 'react-dom';
import {
  ToggleButton,
  Logger
} from '../../index.js';

render(
  <div>
    <div className="example-block">
      <span>Just a ToggleButton:</span>

      {/* A ToggleButton without any configuration*/}
      <ToggleButton
        onToggle={()=>{}}
      />

    </div>

    <div className="example-block">
      <span>Initialy pressed ToggleButton:</span>

      {/* A ToggleButton without any configuration*/}
      <ToggleButton
        pressed={true}
        onToggle={()=>{Logger.info('I start pressed.');}}
      />

    </div>

    <div className="example-block">
      <span>pressedIcon:</span>

      {/* A ToggleButton with an icon and a pressedIcon*/}
      <ToggleButton
        icon="frown-o"
        pressedIcon="smile-o"
        onToggle={()=>{}}
      />

    </div>

  </div>,
  document.getElementById('exampleContainer')
);

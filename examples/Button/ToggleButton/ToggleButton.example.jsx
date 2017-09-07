import React from 'react';
import { render } from 'react-dom';
import ToggleButton from './ToggleButton.jsx'; //@react-geo@

render(
  <div>
    <div className="example-block">
      <span>Just a ToggleButton:</span>

      {/* A ToggleButton without any configuration*/}
      <ToggleButton />

    </div>

    <div className="example-block">
      <span>Initialy pressed ToggleButton:</span>

      {/* A ToggleButton without any configuration*/}
      <ToggleButton
        pressed={true}
      />

    </div>

    <div className="example-block">
      <span>pressedIcon:</span>

      {/* A ToggleButton with an icon and a pressedIcon*/}
      <ToggleButton
        icon="frown-o"
        pressedIcon="smile-o"
      />

    </div>

  </div>,
  document.getElementById('exampleContainer')
);

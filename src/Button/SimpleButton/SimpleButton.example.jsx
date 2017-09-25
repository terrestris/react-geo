import React from 'react';
import { render } from 'react-dom';
import { SimpleButton } from '../../index.js'; //@react-geo@

render(
  <div>
    <div className="example-block">
      <span>Just a SimpleButton:</span>

      {/* A SimpleButton without any configuration*/}
      <SimpleButton />

    </div>
    <div className="example-block">
      <span>Tooltip:</span>

      {/* A SimpleButton with a tooltip and a tooltipPlacement*/}
      <SimpleButton
        tooltip="bottom tooltip"
        tooltipPlacement="bottom"
      />

    </div>
    <div className="example-block">
      <span>Icon:</span>

      {/* A SimpleButton with an icon. Just use the font-awesome name.*/}
      <SimpleButton
        icon="bullhorn"
      />

    </div>

    <div className="example-block">
      <span>Icon:</span>

      {/* A round SimpleButton.*/}
      <SimpleButton
        icon="bullhorn"
        shape="circle"
      />

    </div>
  </div>,
  document.getElementById('exampleContainer')
);

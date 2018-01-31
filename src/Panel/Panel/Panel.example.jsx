import React from 'react';
import { render } from 'react-dom';
import {
  Panel
} from '../../index.js';

render(
  <div style={{
    height: '500px'
  }}>

    <div className="example-block">
      <span>Panels:</span>

      <Panel
        x={0}
        y={20}
        title="Collapsible"
        collapsible={true}
      >
        Content
      </Panel>

      <Panel
        x={200}
        y={20}
        collapsible={true}
        title="Tooltip"
        collapseTooltip="Einklappen"
      >
        Content
      </Panel>

      <Panel
        x={400}
        y={20}
        title="Children"
      >
        <div>Im a div but i can be any node.</div>
      </Panel>

      <Panel
        x={700}
        y={20}
        title="Resizable"
        resizeOpts={true}
      >
        <img src="http://www.koeln.de/files/images/Karnevalstrikot_Spieler_270.jpg" />
      </Panel>

      <Panel
        x={1000}
        y={20}
        title="Resizeopts"
        resizeOpts={{
          bottom: true,
          bottomLeft: false,
          bottomRight: true,
          left: false,
          right: true,
          top: false,
          topLeft: false,
          topRight: false,
        }}
      >
        <img src="http://www.koeln.de/files/images/Karnevalstrikot_Spieler_270.jpg" />
      </Panel>

      <Panel
        x={0}
        y={220}
        title="Intial size (673 * 134)"
        resizeOpts={true}
        width={673}
        height={134}
      />

    </div>

  </div>,
  document.getElementById('exampleContainer')
);

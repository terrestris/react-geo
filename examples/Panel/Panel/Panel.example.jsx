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
        title="Children"
      >
        <div style={{padding: '5px'}}>
          Im a div but i can be any node.
        </div>
      </Panel>

      <Panel
        x={250}
        y={20}
        title="Collapsible"
        collapsible={true}
      >
        <div style={{padding: '5px'}}>
          Content
        </div>
      </Panel>

      <Panel
        x={420}
        y={20}
        width={160}
        collapsible={true}
        title="Tooltip"
        collapseTooltip="Einklappen"
      >
        <div style={{padding: '5px'}}>
          You can set the tooltip for the collapse icon with the prop `collapseTooltip`.
        </div>
      </Panel>

      <Panel
        x={700}
        y={20}
        title="resizeopts (right & bottom)"
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
        x={1000}
        y={20}
        title="resizeopts={true}"
        resizeOpts={true}
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

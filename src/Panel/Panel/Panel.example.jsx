import React from 'react';
import { render } from 'react-dom';
import {
  SimpleButton,
  Panel
} from '../../index.js';

render(
  <div style={{
    height: '500px'
  }}>
    <div className="example-block">
      <span>Click to show window:</span>

      <SimpleButton tooltip="Click me to show a window" onClick={() => {
        Panel.showWindow({
          x: 200,
          y: 200,
          containerId: 'exampleContainer',
          width: 200,
          height: 200,
          title: 'Drag me'
        });
      }} />

    </div>

    <div className="example-block">
      <span>Panels:</span>


      <Panel
        x={0}
        y={20}
        title="Collapsible"
        collapsible={true}
      />

      <Panel
        x={200}
        y={20}
        closable={true}
        collapsible={true}
        title="Tooltips"
        compressTooltip="Einklappen"
        closeTooltip="Schließen"
      />

      <Panel
        x={400}
        y={20}
        title="Children"
      >
        <div>Im a div but i can be any node.</div>
      </Panel>

      <Panel
        x={600}
        y={20}
        title="Resizable"
        resizeOpts={true}
      >
        <img src="http://www.koeln.de/files/images/Karnevalstrikot_Spieler_270.jpg" />
      </Panel>

      <Panel
        x={800}
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
        title="Custom size"
        width={673}
        height={134}
      />

    </div>

  </div>,
  document.getElementById('exampleContainer')
);

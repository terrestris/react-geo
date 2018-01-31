import React from 'react';
import { render } from 'react-dom';
import {
  Window,
  SimpleButton
} from '../index.js';

let windowOpen = false;

/**
 *
 */
const triggerRerenderingWithInvertedVisibility = () => {
  windowOpen = !windowOpen;
  doRender();
};

/**
 *
 */
const doRender = () => {
  render(
    <div style={{
      height: '100px'
    }}>

      <div className="example-block">
        <span>Click to open window:</span>
        <SimpleButton
          tooltip="Click me to show/hide a window"
          onClick={triggerRerenderingWithInvertedVisibility}
        />

        {
          windowOpen ?
            <Window
              parentId="exampleContainer"
              title="This is the window title"
              width={300}
              height={150}
              tools={[
                <SimpleButton
                  key="closeButton"
                  icon="close"
                  size="small"
                  tooltip="Close"
                  onClick={triggerRerenderingWithInvertedVisibility}
                />
              ]}
            >
              This is the content of the window.
            </Window> :
            null
        }

      </div>

    </div>,
    document.getElementById('exampleContainer')
  );
};

doRender();

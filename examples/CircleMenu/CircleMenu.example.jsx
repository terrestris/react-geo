import React from 'react';
import { render } from 'react-dom';
import {
  CircleMenu,
  SimpleButton
} from '../index.js';

let visible = false;

/**
 * The wrapper is needed to reRender the DomTree. Don't worry about it.
 * You probably won't need it in your application.
 */
const doRender = () => {
  render(
    <div>
      <div className="example-block" style={{
        width: 500,
        height: 500
      }}>
        <span>CircleMenu</span>
        <SimpleButton onClick={() => {
          visible = !visible;
          doRender();
        }}>
          Toggle CircleMenu
        </SimpleButton>
        {visible ?
          <CircleMenu
            position={[100, 100]}
            diameter={80}
            animationDuration={500}
          >
            <SimpleButton icon="bullhorn" shape="circle" />
            <SimpleButton icon="bullhorn" shape="circle" />
            <SimpleButton icon="bullhorn" shape="circle" />
            <SimpleButton icon="bullhorn" shape="circle" />
            <SimpleButton icon="bullhorn" shape="circle" />
          </CircleMenu>
          : null
        }
      </div>
    </div>,
    // Target
    document.getElementById('exampleContainer')
  );
};

doRender();

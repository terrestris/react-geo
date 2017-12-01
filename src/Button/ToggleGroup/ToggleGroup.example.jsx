/* eslint-disable no-console */
import React from 'react';
import { render } from 'react-dom';
import {
  ToggleGroup,
  ToggleButton
} from '../../index.js';

/**
 * A simple handler.
 * @param {*} pressed
 * @param {*} evt
 */
const onChange = (pressed, evt) => {
  console.log('ToggleGroup changed', pressed, evt);
};

render(
  <div>
    <div className="example-block">
      <span>Just a ToggleGroup:</span>

      <ToggleGroup
        selectedName="one"
        onChange={onChange}
      >
        <ToggleButton
          className="button-one"
          name="one"
          icon="frown-o"
          pressedIcon="smile-o"
          onToggle={(pressed)=>{console.log(`button-one toggled --> ${pressed}`);}}
        />
        <ToggleButton
          className="button-two"
          name="two"
          icon="frown-o"
          pressedIcon="smile-o"
          onToggle={(pressed)=>{console.log(`button-two toggled --> ${pressed}`);}}
        />
        <ToggleButton
          className="button-three"
          name="three"
          icon="frown-o"
          pressedIcon="smile-o"
          onToggle={(pressed)=>{console.log(`button-three toggled --> ${pressed}`);}}
        />
      </ToggleGroup>

    </div>

  </div>,
  document.getElementById('exampleContainer')
);

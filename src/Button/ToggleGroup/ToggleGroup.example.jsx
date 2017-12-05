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
        allowDeselect={true}
        selectedName="one"
        onChange={onChange}
      >
        <ToggleButton
          name="one"
          icon="frown-o"
          pressedIcon="smile-o"
          onToggle={(pressed)=>{console.log(`one toggled --> ${pressed}`);}}
        />
        <ToggleButton
          name="two"
          icon="frown-o"
          pressedIcon="smile-o"
          onToggle={(pressed)=>{console.log(`two toggled --> ${pressed}`);}}
        />
        <ToggleButton
          name="three"
          icon="frown-o"
          pressedIcon="smile-o"
          onToggle={(pressed)=>{console.log(`three toggled --> ${pressed}`);}}
        />
      </ToggleGroup>

    </div>

  </div>,
  document.getElementById('exampleContainer')
);

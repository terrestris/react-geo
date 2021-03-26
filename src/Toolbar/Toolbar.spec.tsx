import * as React from 'react';
import { render, screen } from '@testing-library/react';

import Toolbar from './Toolbar';

const testChildren = [
  <div key="testdiv1" id="testdiv1" />,
  <div key="testdiv2" id="testdiv2" />,
  <div key="testdiv3" id="testdiv3" />
];

describe('<Toolbar />', () => {

  it('is defined', () => {
    expect(Toolbar).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<Toolbar />);
    expect(container).toBeVisible();
  });

  it('contains div having class "horizontal-toolbar" by default', () => {
    render(<Toolbar />);
    const toolBar = screen.getByRole('toolbar');
    expect(toolBar).toHaveClass('horizontal-toolbar');
  });

});

describe('<Toolbar /> - CSS-class "vertical-toolbar"', () => {

  it('contains div having class "vertical-toolbar"', () => {
    render(<Toolbar alignment="vertical" />);
    const toolBar = screen.getByRole('toolbar');
    expect(toolBar).toHaveClass('vertical-toolbar');
  });

  it('contains three child elements', () => {
    render(
      <Toolbar alignment="vertical">
        {testChildren}
      </Toolbar>
    );
    const children = screen.getByRole('toolbar').children;
    expect(children).toHaveLength(3);
  });
});

describe('<Toolbar /> - CSS-class "horizontal-toolbar"', () => {

  it('contains div having class "horizontal-toolbar"', () => {
    render(<Toolbar alignment="horizontal" />);
    const toolBar = screen.getByRole('toolbar');
    expect(toolBar).toHaveClass('horizontal-toolbar');
  });

  it('contains three child elements', () => {
    render(
      <Toolbar alignment="horizontal">
        {testChildren}
      </Toolbar>
    );
    const children = screen.getByRole('toolbar').children;
    expect(children).toHaveLength(3);
  });
});

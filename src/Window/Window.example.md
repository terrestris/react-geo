This example demonstrates the usage of a Window component.

Click to open window:

```jsx
import React from 'react';

import SimpleButton from '@terrestris/react-geo/Button/SimpleButton/SimpleButton';
import Window from '@terrestris/react-geo/Window/Window';

class WindowExample extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      simpleWinIsVisible: false,
      escWinIsVisible: false
    };
  }

  onClickSimple() {
    this.setState({
      simpleWinIsVisible: !this.state.simpleWinIsVisible
    });
  }

  onClickEsc() {
    this.setState({
      escWinIsVisible: !this.state.escWinIsVisible
    });
  }

  render() {
    return(
      <div>
        <SimpleButton
          onClick={this.onClickSimple.bind(this)}
        >
          {`${this.state.simpleWinIsVisible ? 'Hide' : 'Show'} a window`}
        </SimpleButton>
        <SimpleButton
          onClick={this.onClickEsc.bind(this)}
        >
          {`${this.state.escWinIsVisible ? 'Hide' : 'Show'} a window with bound 'keydown' listener`}
        </SimpleButton>

        {
          this.state.simpleWinIsVisible ?
            <Window
              parentId="rsg-root"
              title="This is the window title"
              width={300}
              height={150}
              x={(window.innerWidth / 2 - 150) / 2}
              y={(window.innerHeight / 2 - 75) / 2}
              style={{
                position: 'fixed',
                boxShadow: '5px 5px 5px 0px #888888'
              }}
              tools={[
                <SimpleButton
                  key="closeButton"
                  icon="close"
                  size="small"
                  tooltip="Close"
                  onClick={this.onClickSimple.bind(this)}
                />
              ]}
            >
              This is the content of the window.
            </Window> :
            null
        }
        {
          this.state.escWinIsVisible ?
            <Window
              parentId="rsg-root"
              title="This is the window title"
              onEscape={this.onClickEsc.bind(this)}
              width={300}
              height={150}
              x={(window.innerWidth / 2 - 150) / 2}
              y={(window.innerHeight / 2 - 75) / 2}
              style={{
                position: 'fixed',
                boxShadow: '5px 5px 5px 0px #888888'
              }}
              tools={[
                <SimpleButton
                  key="closeButton"
                  icon="close"
                  size="small"
                  tooltip="Close"
                  onClick={this.onClickEsc.bind(this)}
                />
              ]}
            >
              Press <b>escape</b> to close me.
            </Window> :
            null
        }
      </div>
    );
  }
}

<WindowExample />;
```

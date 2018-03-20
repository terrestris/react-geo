This example demonstrates the usage of a Window component.

Click to open window:

```jsx
const React = require('react');
const {
  Window,
  SimpleButton
} = require('../index.js');

class WindowExample extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      windowIsVisible: false
    };
  }

  onClick() {
    this.setState({
      windowIsVisible: !this.state.windowIsVisible
    });
  }

  render() {
    return(
      <div>
        <SimpleButton
          tooltip="Click me to show/hide a window"
          onClick={this.onClick.bind(this)}
        />

        {
          this.state.windowIsVisible ?
            <Window
              parentId="app"
              title="This is the window title"
              width={300}
              height={150}
              tools={[
                <SimpleButton
                  key="closeButton"
                  icon="close"
                  size="small"
                  tooltip="Close"
                  onClick={this.onClick.bind(this)}
                />
              ]}
            >
              This is the content of the window.
            </Window> :
            null
        }
      </div>
    );
  }
}

<WindowExample />;
```

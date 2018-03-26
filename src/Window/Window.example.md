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
          onClick={this.onClick.bind(this)}
        >
          {`Click me to ${this.state.windowIsVisible ? 'hide' : 'show'} a window.`}
        </SimpleButton>

        {
          this.state.windowIsVisible ?
            <Window
              parentId="rsg-root"
              title="This is the window title"
              width={300}
              height={150}
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

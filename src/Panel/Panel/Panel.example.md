This example demonstrates the use of Panels

```jsx
<Panel
  style={{position: 'relative'}}
  x={0}
  y={0}
  title="Children"
>
  <div style={{padding: '5px'}}>
    Im a div but i can be any node.
  </div>
</Panel>
```

```jsx
<Panel
  style={{position: 'relative'}}
  x={0}
  y={0}
  title="Collapsible"
  collapsible={true}
>
  <div style={{padding: '5px'}}>
    Content
  </div>
</Panel>
```

```jsx
<Panel
  style={{position: 'relative'}}
  x={0}
  y={0}
  width={160}
  collapsible={true}
  title="Tooltip"
  collapseTooltip="Einklappen"
>
  <div style={{padding: '5px'}}>
    You can set the tooltip for the collapse icon with the prop `collapseTooltip`.
  </div>
</Panel>
```

```jsx
<Panel
  style={{position: 'relative'}}
  x={0}
  y={0}
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
  <img src="https://www.koeln.de/files/images/Karnevalstrikot_Spieler_270.jpg" />
</Panel>
```

```jsx
<Panel
  style={{position: 'relative'}}
  x={0}
  y={0}
  title="resizeopts={true}"
  resizeOpts={true}
>
  <img src="https://www.koeln.de/files/images/Karnevalstrikot_Spieler_270.jpg" />
</Panel>
```

```jsx
<Panel
  style={{position: 'relative'}}
  x={0}
  y={0}
  title="Initial size (673 * 134)"
  resizeOpts={true}
  width={673}
  height={134}
>
  Panel with initial size.
</Panel>
```

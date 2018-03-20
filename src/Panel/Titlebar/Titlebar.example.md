This example demonstrates the Titlebar.

Just a Titlebar:

```jsx
<Titlebar />
```

A Titlebar with a title:

```jsx
<Titlebar>
  Title
</Titlebar>
```

A Titlebar with a title and tools

```jsx
<Titlebar
  tools={[
    <SimpleButton
      icon="globe"
      tooltip="globe-tool"
      key="globe-tool"
      size="small"
    />
  ]}
>
  A Titlebar with a title and tools
</Titlebar>
```
This example demonstrates the use of the `UploadButton`.

UploadButton:

```jsx
<UploadButton
  onChange={e => {
    alert('You uploaded ' + e.target.files[0].name);
  }}
  icon="upload"
/>
```

UploadButton with a texted SimpleButton as child:

```jsx
<UploadButton
  onChange={e => {
    alert('You uploaded ' + e.target.files[0].name);
  }}
>
  <SimpleButton>Upload</SimpleButton>
</UploadButton>
```

```jsx
<UploadButton
  onChange={e => {
    alert('You uploaded ' + e.target.files[0].name);
  }}
>
  <span style={{fontWeight: 'bold'}}>Click me to upload!</span>
</UploadButton>
```
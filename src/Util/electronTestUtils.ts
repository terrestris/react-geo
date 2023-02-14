import {
  act
} from 'react-dom/test-utils';

export async function type(element: HTMLElement, sequence: string): Promise<void> {
  element.focus();
  const webContents = (await (import('@electron/remote'))).getCurrentWebContents();
  const promises = Array.from(sequence).map(keyCode =>
    ['keyDown', 'char', 'keyUp'].map(eventType => new Promise(resolve => {
      webContents.sendInputEvent({
        type: eventType as 'keyDown'|'char'|'keyUp',
        keyCode
      });
      setTimeout(resolve, 16);
    }))).flat();
  await act(async () => {
    await Promise.all(promises);
  });
}

export async function click(element: HTMLElement): Promise<void> {
  await act(async () => new Promise(resolve => {
    element.click();
    setTimeout(resolve, 16);
  }));
}

export async function clickCenter(element: HTMLElement): Promise<void> {
  const { top, left, width, height } = element.getBoundingClientRect();
  await clickCoordinate(left + width / 2, top + height / 2);
}

export async function clickCoordinate(x: number, y: number): Promise<void> {
  await act(async () => new Promise(async resolve => {
    const webContents = (await (import('@electron/remote'))).getCurrentWebContents();
    webContents.sendInputEvent({
      type: 'mouseDown',
      x,
      y
    });
    webContents.sendInputEvent({
      type: 'mouseUp',
      x,
      y
    });
    setTimeout(resolve, 16);
  }));
}

export async function doubleClickCoordinate(x: number, y: number): Promise<void> {
  await act(async () => new Promise(async resolve => {
    const webContents = (await (import('@electron/remote'))).getCurrentWebContents();
    webContents.sendInputEvent({
      type: 'mouseDown',
      x,
      y
    });
    webContents.sendInputEvent({
      type: 'mouseUp',
      x,
      y
    });
    webContents.sendInputEvent({
      type: 'mouseDown',
      x,
      y
    });
    webContents.sendInputEvent({
      type: 'mouseUp',
      x,
      y
    });
    setTimeout(resolve, 16);
  }));
}

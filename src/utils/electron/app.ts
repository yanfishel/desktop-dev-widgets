import {BrowserWindow, Notification} from "electron";
import { register } from 'electron-localshortcut';

/**
 * Registers a keyboard shortcut to open the dev tools when pressing F12.
 * @export
 * @param {BrowserWindow} win - The BrowserWindow instance.
 */
export function openDevToolsWithShortcut(win: BrowserWindow) {
  register(win, 'F12', () => {
    win.webContents.openDevTools()
  })
}

export function showNotification(
  NOTIFICATION_TITLE: string,
  NOTIFICATION_BODY = '',
) {
  new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY,
  }).show()
}

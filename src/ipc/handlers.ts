import { ipcMain, shell, dialog } from 'electron'

import {IpcChannels} from "./channels";
import { resizeMainWindow } from "../main/window";


ipcMain.handle(IpcChannels.WIDGET_SIZE, (event, size:TWidgetsSize) => resizeMainWindow(size))

// Handles the 'open-external-link' IPC message by opening the provided URL in the default browser.
ipcMain.handle(IpcChannels.OPEN_EXTERNAL, async (_event, url: string) => {
  try {
    await shell.openExternal(url)
  } catch (error) {
    console.error('Error opening external link:', error)
    dialog.showErrorBox('Error opening external link', `${error}`)
  }
})
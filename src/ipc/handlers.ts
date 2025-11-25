import { ipcMain, shell, dialog } from 'electron'
import { fsSize, getStaticData, getDynamicData, currentLoad, mem, networkStats, networkInterfaceDefault, networkInterfaces } from 'systeminformation'

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

ipcMain.handle(IpcChannels.GET_SYSTEM_INFO, async () => {

  const [info, memory] = await Promise.all([ currentLoad(), mem() ])

  return { info, memory }
})

ipcMain.handle(IpcChannels.GET_NETWORK_STATS_INFO, async () => {

  const [stats, iface] = await Promise.all([ networkStats(), networkInterfaces('default') ])

  return {stats, iface}
})

ipcMain.handle(IpcChannels.GET_DISK_USAGE, async () => {

  const data = await fsSize()

  return data
})
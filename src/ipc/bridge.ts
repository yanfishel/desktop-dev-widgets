import { contextBridge, ipcRenderer } from 'electron'
import {IpcChannels} from "./channels";


/**
 * Exposes Electron API to the main world.
 */
contextBridge.exposeInMainWorld('electronAPI', {

  setWidgetsSize: (size: string) => ipcRenderer.invoke(IpcChannels.WIDGET_SIZE, size),

  onWidgetsResize: (callback:any) => ipcRenderer.on(IpcChannels.WIDGET_SIZE, callback)

})

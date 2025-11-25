import { contextBridge, ipcRenderer } from 'electron'
import {IpcChannels} from "./channels";


/**
 * Exposes Electron API to the main world.
 */
contextBridge.exposeInMainWorld('electronAPI', {

  setWidgetsSize: (size: string) =>
    ipcRenderer.invoke(IpcChannels.WIDGET_SIZE, size),

  openExternal: (path: string) =>
    ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL, path),

  getDiskUsage: () => ipcRenderer.invoke(IpcChannels.GET_DISK_USAGE),
  getSystemInfo: () => ipcRenderer.invoke(IpcChannels.GET_SYSTEM_INFO),

  getNetworkStatsInfo: () => ipcRenderer.invoke(IpcChannels.GET_NETWORK_STATS_INFO),


  onWidgetsResize: (callback:any) =>
    ipcRenderer.on(IpcChannels.WIDGET_SIZE, callback),

  onPowerMonitorEvent: (callback:any) =>
    ipcRenderer.on(IpcChannels.POWER_MONITOR_EVENT, callback),

})

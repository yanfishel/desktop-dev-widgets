import { contextBridge, ipcRenderer } from 'electron'
import {IpcChannels} from "./channels";


/**
 * Exposes Electron API to the main world.
 */
contextBridge.exposeInMainWorld('electronAPI', {

  setWidgetsSize: (size: string) =>
    ipcRenderer.invoke(IpcChannels.WIDGET_SIZE, size),

  setLockPosition: (locked: boolean) =>
    ipcRenderer.invoke(IpcChannels.LOCK_POSITION, locked),

  openExternal: (path: string) =>
    ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL, path),

  openAboutWinow: () =>
    ipcRenderer.invoke(IpcChannels.OPEN_ABOUT_WINDOW),

  getAppInfo: () => ipcRenderer.invoke(IpcChannels.GET_APP_INFO),
  getDiskUsage: () => ipcRenderer.invoke(IpcChannels.GET_DISK_USAGE),
  getSystemInfo: () => ipcRenderer.invoke(IpcChannels.GET_SYSTEM_INFO),
  getPublicIP: () => ipcRenderer.invoke(IpcChannels.GET_PUBLIC_IP),
  getNetworkStatsInfo: () => ipcRenderer.invoke(IpcChannels.GET_NETWORK_STATS_INFO),

  onWidgetsResize: (callback:any) =>
    ipcRenderer.on(IpcChannels.WIDGET_SIZE, callback),

  onLockPosition: (callback:any) =>
    ipcRenderer.on(IpcChannels.LOCK_POSITION, callback),

  onPowerMonitorEvent: (callback:any) =>
    ipcRenderer.on(IpcChannels.POWER_MONITOR_EVENT, callback),

})

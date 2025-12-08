import { contextBridge, ipcRenderer } from 'electron'
import {IpcChannels} from "./channels";


/** -- Exposes Electron API to the main world. - */
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

  mockServerStart: () => ipcRenderer.invoke(IpcChannels.MOCK_SERVER_START),
  mockServerStop: () => ipcRenderer.invoke(IpcChannels.MOCK_SERVER_STOP),
  mockServerTest: (port:number) => ipcRenderer.invoke(IpcChannels.MOCK_SERVER_TEST, port),

  onMockServerResponse: (callback:(response:any)=>void) => ipcRenderer.on(IpcChannels.MOCK_SERVER_RESPONSE, callback),
  onMockServerError: (callback:(response:any)=>void) => ipcRenderer.on(IpcChannels.MOCK_SERVER_ERROR, callback),

  onWidgetsResize: (callback:()=>void) =>
    ipcRenderer.on(IpcChannels.WIDGET_SIZE, callback),

  onLockPosition: (callback:()=>void) =>
    ipcRenderer.on(IpcChannels.LOCK_POSITION, callback),

  onPowerMonitorEvent: (callback:()=>void) =>
    ipcRenderer.on(IpcChannels.POWER_MONITOR_EVENT, callback)

})

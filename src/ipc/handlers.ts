import { ipcMain, shell, dialog, powerMonitor } from 'electron'
import { fsSize, currentLoad, mem, networkStats, networkInterfaces } from 'systeminformation'

import {IpcChannels} from "./channels";
import winController from "../electron/windows";


ipcMain.handle(IpcChannels.WIDGET_SIZE, (event, size:TWidgetsSize) => winController.resize(size))

ipcMain.handle(IpcChannels.LOCK_POSITION, (_event, locked) => winController.lock(locked) )

ipcMain.handle(IpcChannels.OPEN_EXTERNAL, async (_event, url: string) => {
  try {
    await shell.openExternal(url)
  } catch (error) {
    console.error('Error opening external link:', error)
    dialog.showErrorBox('Error opening external link', `${error}`)
  }
})

ipcMain.handle(IpcChannels.OPEN_ABOUT_WINDOW, async () => winController.createAbout())

ipcMain.handle(IpcChannels.GET_APP_INFO, async () => {
  try {
    const versions = ['electron', 'chrome', 'node', 'v8'].map(e => [e, process.versions[e]]);
    const packageJson = await import('../../package.json')
    return { packageJson, versions }
  } catch (error) {
    console.error('Error getting app info:', error)
  }
})

ipcMain.handle(IpcChannels.GET_SYSTEM_INFO, async () => {
  try {
    const [info, memory] = await Promise.all([ currentLoad(), mem() ])
    return { info, memory }
  } catch (e) {
    console.log('Error get Load', e);
  }

})

ipcMain.handle(IpcChannels.GET_NETWORK_STATS_INFO, async () => {
  try {
    const [stats, iface] = await Promise.all([ networkStats(), networkInterfaces('default') ])
    return {stats, iface}
  } catch (e) {
    console.log('Error get Statistic', e);
  }
})

ipcMain.handle(IpcChannels.GET_PUBLIC_IP, async () => {
  try {
    const ip = await fetch('https://api.ipify.org?format=json').then(res => res.json())
    return ip.ip
  } catch (e) {
    console.log('Error get IP', e);
  }
})

ipcMain.handle(IpcChannels.GET_DISK_USAGE, async () => {
  try {
    return await fsSize()
  } catch (e) {
    console.log('Error get Disk usage', e);
  }

})

// Power Monitor Events
powerMonitor.addListener('lock-screen', () => {
  winController.sendToMain(IpcChannels.POWER_MONITOR_EVENT, 'lock')
});
powerMonitor.addListener('unlock-screen', () => {
  winController.sendToMain(IpcChannels.POWER_MONITOR_EVENT, 'unlock')
});
powerMonitor.addListener('suspend', () => {
  winController.sendToMain(IpcChannels.POWER_MONITOR_EVENT, 'suspend')
});
powerMonitor.addListener('resume', () => {
  winController.sendToMain(IpcChannels.POWER_MONITOR_EVENT, 'resume')
});
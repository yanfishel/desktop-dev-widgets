import { ipcMain, powerMonitor } from 'electron'

import {IpcChannels} from "./channels";
import winController from "../electron/windows";
import {getDiskUsage, getNetworkStats, getPackageJson, getPublicIP, getSystemInfo, openExternalLink} from "../electron/services";
import serverController from "../electron/server";


ipcMain.handle(IpcChannels.WIDGET_SIZE, (_event, size:TWidgetsSize) => winController.resize(size))

ipcMain.handle(IpcChannels.LOCK_POSITION, (_event, locked) => winController.lock(locked) )

ipcMain.handle(IpcChannels.OPEN_EXTERNAL, async (_event, url: string) => openExternalLink(url))

ipcMain.handle(IpcChannels.OPEN_ABOUT_WINDOW, async () => winController.createAbout())

ipcMain.handle(IpcChannels.GET_APP_INFO, async () => getPackageJson())

ipcMain.handle(IpcChannels.GET_SYSTEM_INFO, async () => getSystemInfo())

ipcMain.handle(IpcChannels.GET_NETWORK_STATS_INFO, async () => getNetworkStats())

ipcMain.handle(IpcChannels.GET_PUBLIC_IP, async () => getPublicIP())

ipcMain.handle(IpcChannels.GET_DISK_USAGE, async () => getDiskUsage())

// MOCK SERVER
ipcMain.handle(IpcChannels.MOCK_SERVER_START, () => serverController.startServer())
ipcMain.handle(IpcChannels.MOCK_SERVER_STOP, () => serverController.stopServer())
ipcMain.handle(IpcChannels.MOCK_SERVER_TEST, (_event, port) => serverController.testServer(port))

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
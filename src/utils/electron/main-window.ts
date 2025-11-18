import {BrowserWindow, screen, powerMonitor } from "electron";
import * as path from "node:path";
import is from 'electron-is'
import { fsSize, getStaticData, getDynamicData, currentLoad, mem } from 'systeminformation'

import {APP_WIDTH} from "../../constans";
import {config} from "../../config";
import {IpcChannels} from "../../ipc/channels";
import {openDevToolsWithShortcut, showNotification} from "./app";
import {getAppSettings, setAppSettings} from "./app-settings";
import {destroyTray, registerTray} from "./tray";


declare const MAIN_WINDOW_WEBPACK_NAME: string;
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow | null = null

/**
 * Creates the main browser window.
 * Sets up the window with default dimensions and preferences. Loads either
 * the local dev server URL or built HTML file depending on environment.
 * Also opens the DevTools for development.
 */
export function createMainWindow() {
  if (mainWindow !== null) {
    mainWindow.show()
    return
  }

  const appSettings = getAppSettings()

  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: config.applicationName,
    x: appSettings.x !== undefined ? appSettings.x : undefined,
    y: appSettings.y !== undefined ? appSettings.y : undefined,
    width: appSettings.width || APP_WIDTH.LARGE, // Set the initial width of the window
    height: appSettings.height || APP_WIDTH.LARGE, // Set the initial height of the window
    minHeight: APP_WIDTH.LARGE,
    minWidth: appSettings.width || APP_WIDTH.LARGE,
    center: false,
    type:'desktop',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // Path to preload script
    },
    transparent: true,
    autoHideMenuBar: true, // Hide the menu bar
    titleBarStyle: 'hidden', // Hide the title bar
    fullscreenable: false, // Disable fullscreen
    maximizable: false, // Disable maximize
    minimizable: false,
    skipTaskbar: true,
    hasShadow: false,
    resizable: false,
    thickFrame: false,
    frame: false,
    movable: true,
    icon: config.iconPath, // Set the icon for the app
  })

  mainWindow.setSkipTaskbar(true)

  // Hide the traffic light buttons (minimize, maximize, close)
  is.macOS() && mainWindow.setWindowButtonVisibility(false)

  // Load the main window content
  if (MAIN_WINDOW_WEBPACK_ENTRY) {
    // If a dev server URL is provided, load it
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  } else {
    // Otherwise, load the index.html from the file system
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_WEBPACK_NAME}/index.html`),
    )
  }


  mainWindow.on('closed', () => {
    mainWindow = null
    if (BrowserWindow.getAllWindows().length !== 0) {
      showNotification(
        config.applicationName,
        'The application is still running in the background.',
      )
    }
  }).on('moved', () => {

    const [x, y] = mainWindow.getPosition()
    const [w] = mainWindow.getSize()

    const displays = screen.getAllDisplays()
    const display = displays.find(display => display.nativeOrigin.x <= x && display.nativeOrigin.y <= y)
    if(display) {
      const height = display.workAreaSize.height - y
      mainWindow.setBounds({ x, y, width: w, height })
      const settings = {
        ...appSettings,
        x, y, height
      }
      setAppSettings(settings)
    }

  })

  powerMonitor.addListener('lock-screen', () => {
    mainWindow.webContents.send(IpcChannels.POWER_MONITOR_EVENT, 'lock')
  });
  powerMonitor.addListener('unlock-screen', () => {
    mainWindow.webContents.send(IpcChannels.POWER_MONITOR_EVENT, 'unlock')
  });
  powerMonitor.addListener('suspend', () => {
    mainWindow.webContents.send(IpcChannels.POWER_MONITOR_EVENT, 'suspend')
  });
  powerMonitor.addListener('resume', () => {
    mainWindow.webContents.send(IpcChannels.POWER_MONITOR_EVENT, 'resume')
  });

  info()

  // Open the DevTools for debugging
  // mainWindow.webContents.openDevTools();
  openDevToolsWithShortcut(mainWindow)
}


async function info() {
  const info = await currentLoad()
  const memory = await mem()
  console.log(info, memory)
}

export function resizeMainWindow(size:TWidgetsSize) {

  let mainWindow:BrowserWindow | null = null

  BrowserWindow.getAllWindows().forEach(win => {
    if (win.title === config.applicationName) mainWindow = win;
  })

  if(!mainWindow) return

  destroyTray()

  const appSettings = getAppSettings()
  const newWidth = size === 'small' ? APP_WIDTH.SMALL : size === 'medium' ? APP_WIDTH.MEDIUM : APP_WIDTH.LARGE

  let bounds = mainWindow.getBounds()
  bounds = {...bounds, width: newWidth}
  // Calculate the new bounds based on the size
  const screens = screen.getAllDisplays()
  const maxX = screens.reduce((max, screen) => Math.max(max, screen.bounds.x + screen.bounds.width), 0)
  if(bounds.x + newWidth > maxX) {
    bounds = { ...bounds, x: maxX - newWidth }
  }
  mainWindow.setBounds(bounds)
  mainWindow.webContents.send(IpcChannels.WIDGET_SIZE, size)
  const settings = {
    ...appSettings,
    x:bounds.x, y:bounds.y, width:bounds.width, height:bounds.height
  }
  setAppSettings(settings)

  registerTray()

}
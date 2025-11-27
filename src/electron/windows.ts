import {app, BrowserWindow, Notification, screen} from "electron";
import { register } from 'electron-localshortcut';
import is from 'electron-is'

import {config} from "../config";
import {APP_WIDTH} from "../constants";
import {getAppSettings, setAppSettings} from "./settings";
import trayController from "./tray";
import {IpcChannels} from "../ipc/channels";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const ABOUT_WINDOW_WEBPACK_ENTRY: string;
declare const ABOUT_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

class WinController {
  static instance: WinController | null = null

  appSettings:IAppSettings
  mainWindow: BrowserWindow | null = null
  aboutWindow: BrowserWindow | null = null

  constructor() {
    this.appSettings = getAppSettings()
  }

  static getInstance() {
    if (!WinController.instance) {
      WinController.instance = new WinController()
    }

    return WinController.instance
  }

  createMain(){
    if (this.mainWindow !== null) {
      this.mainWindow.show()
      return
    }

    // Create the browser window.
    this.mainWindow = new BrowserWindow({
      title: config.applicationName,
      x: this.appSettings.x !== undefined ? this.appSettings.x : undefined,
      y: this.appSettings.y !== undefined ? this.appSettings.y : undefined,
      width: this.appSettings.width || APP_WIDTH.LARGE, // Set the initial width of the window
      height: this.appSettings.height || APP_WIDTH.LARGE, // Set the initial height of the window
      minHeight: APP_WIDTH.LARGE,
      minWidth: this.appSettings.width || APP_WIDTH.LARGE,
      center: false,
      //type:'desktop',
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

    this.mainWindow
      .on('closed', () => this.onMainWinowClosed())
      .on('moved', () => this.onMainWinowMoved())

    this.mainWindow.setSkipTaskbar(true)

    // Hide the traffic light buttons (minimize, maximize, close)
    is.macOS() && this.mainWindow.setWindowButtonVisibility(false)

    // Load the main window content
    if (MAIN_WINDOW_WEBPACK_ENTRY) {
      this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
    }

    // Reasign DevTools for debugging
    this.reasignDevTools()

    trayController.init()

  }

  reasignDevTools() {
    register(this.mainWindow, 'F12', () => {
      this.mainWindow.webContents.openDevTools()
    })
  }

  sendToMain(channel:string, value:any) {
    if(!this.mainWindow) return
    this.mainWindow.webContents.send(channel, value)
  }

  onMainWinowMoved() {
    const [x, y] = this.mainWindow.getPosition()
    const [w] = this.mainWindow.getSize()

    const displays = screen.getAllDisplays()
    const display = displays.find(display => display.nativeOrigin.x <= x && display.nativeOrigin.y <= y)
    if(display) {
      const height = display.workAreaSize.height - y
      this.mainWindow.setBounds({ x, y, width: w, height })
      const settings = {
        ...this.appSettings,
        x, y, height
      }
      setAppSettings(settings)
    }
  }

  onMainWinowClosed() {
    this.mainWindow = null
    if (BrowserWindow.getAllWindows().length !== 0) {
      this.notification(
        config.applicationName,
        'The application is still running in the background.',
      )
    }
  }

  resize(size:TWidgetsSize){
    if(!this.mainWindow){
      return
    }

    const newWidth = size === 'small' ? APP_WIDTH.SMALL : size === 'medium' ? APP_WIDTH.MEDIUM : APP_WIDTH.LARGE

    let bounds = this.mainWindow.getBounds()
    bounds = {...bounds, width: newWidth }
    // Calculate the new bounds based on the size
    const screens = screen.getAllDisplays()
    const maxX = screens.reduce((max, screen) => Math.max(max, screen.bounds.x + screen.bounds.width), 0)
    if(bounds.x + newWidth > maxX) {
      bounds = { ...bounds, x: maxX - newWidth }
    }
    this.mainWindow.setBounds(bounds)
    this.sendToMain(IpcChannels.WIDGET_SIZE, size)
    const settings = {
      ...this.appSettings,
      x:bounds.x, y:bounds.y, width:bounds.width, height:bounds.height
    }
    setAppSettings(settings)

    // Rebuild the tray
    trayController.rebuild()

  }

  lock(locked:boolean){
    if(!this.mainWindow) return

    this.sendToMain(IpcChannels.LOCK_POSITION, locked)
    const appSettings = getAppSettings()
    const settings = { ...appSettings, locked }
    setAppSettings(settings)

    // Rebuild the tray
    trayController.rebuild()
  }

  createAbout(){
    if (this.aboutWindow !== null) {
      this.aboutWindow.show()
      return
    }

    this.aboutWindow = new BrowserWindow({
      title: `About ${config.applicationName}`,
      width: 400, // Set the initial width of the window
      height: 400, // Set the initial height of the window
      minHeight: 400,
      minWidth: 400,
      center: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: true,
        preload: ABOUT_WINDOW_PRELOAD_WEBPACK_ENTRY, // Path to preload script
      },
      autoHideMenuBar: true,
      fullscreenable: false, // Disable fullscreen
      maximizable: false, // Disable maximize
      minimizable: false,
      skipTaskbar: true,
      resizable: false,
      movable: true,
      icon: config.iconPath, // Set the icon for the app
    }).on('closed', () => {
      this.aboutWindow = null
    })
    // Hide the traffic light buttons (minimize, maximize, close)
    is.macOS() && this.aboutWindow.setWindowButtonVisibility(false)

    this.aboutWindow.loadURL(ABOUT_WINDOW_WEBPACK_ENTRY)

    this.aboutWindow.webContents.once('dom-ready', () => {
        const app_name = app.name || app.getName();
        const version = app.getVersion();
        this.aboutWindow.webContents.send('info', app_name, version);
    })

    register(this.aboutWindow, 'F12', () => {
      this.aboutWindow.webContents.openDevTools()
    })
  }

  notification( title: string, body = '' ) {
    new Notification({ title, body }).show()
  }

}

const winController = WinController.getInstance()
export default winController
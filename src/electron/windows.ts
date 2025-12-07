import {app, BrowserWindow, Notification, screen} from "electron";
import { register } from 'electron-localshortcut';
import is from 'electron-is'

import {config} from "../config";
import {APP_WIDTH} from "../constants";
import {IpcChannels} from "../ipc/channels";
import appSettings from "./settings";
import trayController from "./tray";
import serverController from "./server";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const ABOUT_WINDOW_WEBPACK_ENTRY: string;
declare const ABOUT_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

class WinController {
  static instance: WinController | null = null

  #mainWindow: BrowserWindow | null = null
  #aboutWindow: BrowserWindow | null = null

  static getInstance() {
    if (!WinController.instance) {
      WinController.instance = new WinController()
    }

    return WinController.instance
  }

  public createMain(){
    if (this.#mainWindow !== null) {
      this.#mainWindow.show()
      return
    }

    const settings = appSettings.settings

    // Create the browser window.
    this.#mainWindow = new BrowserWindow({
      title: config.applicationName,
      x: settings.x !== undefined ? settings.x : undefined,
      y: settings.y !== undefined ? settings.y : undefined,
      width: settings.width || APP_WIDTH.LARGE, // Set the initial width of the window
      height: settings.height || APP_WIDTH.LARGE, // Set the initial height of the window
      minHeight: APP_WIDTH.LARGE,
      minWidth: settings.width || APP_WIDTH.LARGE,
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

    this.#mainWindow
      .on('closed', () => this.onMainWinowClosed())
      .on('moved', () => this.onMainWinowMoved())

    this.#mainWindow.setSkipTaskbar(true)

    // Hide the traffic light buttons (minimize, maximize, close)
    is.macOS() && this.#mainWindow.setWindowButtonVisibility(false)

    // Load the main window content
    if (MAIN_WINDOW_WEBPACK_ENTRY) {
      this.#mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
    }

    this.#mainWindow.webContents.once('did-finish-load', () => {
      this.sendToMain(IpcChannels.LOCK_POSITION, settings.locked)
      this.sendToMain(
        IpcChannels.WIDGET_SIZE,
        settings.width === APP_WIDTH.SMALL ? 'small' : settings.width === APP_WIDTH.MEDIUM ? 'medium' : 'large'
      )
    })

    // Reasign DevTools for debugging
    this.reasignDevTools()

    trayController.init()

    //serverController.startServer()

  }

  public reasignDevTools() {
    if(process.env.NODE_ENV !== 'development') return
    register(this.#mainWindow, 'F12', () => {
      this.#mainWindow.webContents.openDevTools()
    })
  }

  public sendToMain(channel:string, value:any) {
    if(!this.#mainWindow) return
    this.#mainWindow.webContents.send(channel, value)
  }

  private onMainWinowMoved() {
    if(!this.#mainWindow){
      return
    }
    const [x, y] = this.#mainWindow.getPosition()
    const [w] = this.#mainWindow.getSize()

    const displays = screen.getAllDisplays()
    const display = displays.find(display => display.nativeOrigin.x <= x && display.nativeOrigin.y <= y)
    if(display) {
      const height = display.workAreaSize.height - y
      this.#mainWindow.setBounds({ x, y, width: w, height })

      const settings = appSettings.settings
      const updated = {
        ...settings,
        x, y, height
      }
      appSettings.save(updated)
    }
  }

  private onMainWinowClosed() {
    this.#mainWindow = null
    if (BrowserWindow.getAllWindows().length !== 0) {
      this.notification(
        config.applicationName,
        'The application is still running in the background.',
      )
    }
  }

  public resize(size:TWidgetsSize){
    if(!this.#mainWindow){
      return
    }

    const newWidth = size === 'small' ? APP_WIDTH.SMALL : size === 'medium' ? APP_WIDTH.MEDIUM : APP_WIDTH.LARGE

    let bounds = this.#mainWindow.getBounds()
    bounds = {...bounds, width: newWidth }
    // Calculate the new bounds based on the size
    const screens = screen.getAllDisplays()
    const maxX = screens.reduce((max, screen) => Math.max(max, screen.bounds.x + screen.bounds.width), 0)
    if(bounds.x + newWidth > maxX) {
      bounds = { ...bounds, x: maxX - newWidth }
    }
    this.#mainWindow.setBounds(bounds)
    this.sendToMain(IpcChannels.WIDGET_SIZE, size)

    const settings = appSettings.settings
    const updated = {
      ...settings,
      x:bounds.x, y:bounds.y, width:bounds.width, height:bounds.height
    }
    appSettings.save(updated)

    // Rebuild the tray
    trayController.rebuild()
  }

  public lock(locked:boolean){
    if(!this.#mainWindow) return

    this.sendToMain(IpcChannels.LOCK_POSITION, locked)
    const settings = appSettings.settings
    const upadated = { ...settings, locked }
    appSettings.save(upadated)

    // Rebuild the tray
    trayController.rebuild()
  }

  public setOpenAtLogin(open:boolean){
    if(!this.#mainWindow) return
    const settings = appSettings.settings
    const upadated = { ...settings, openAtLogin: open }
    appSettings.save(upadated)

    // Rebuild the tray
    trayController.rebuild()
  }

  public createAbout(){
    if (this.#aboutWindow !== null) {
      this.#aboutWindow.show()
      return
    }

    this.#aboutWindow = new BrowserWindow({
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
      this.#aboutWindow = null
    })
    // Hide the traffic light buttons (minimize, maximize, close)
    is.macOS() && this.#aboutWindow.setWindowButtonVisibility(false)

    this.#aboutWindow.loadURL(ABOUT_WINDOW_WEBPACK_ENTRY)

    this.#aboutWindow.webContents.once('dom-ready', () => {
        const app_name = app.name || app.getName();
        const version = app.getVersion();
        this.#aboutWindow.webContents.send('info', app_name, version);
    })

    register(this.#aboutWindow, 'F12', () => {
      this.#aboutWindow.webContents.openDevTools()
    })
  }

  public notification( title: string, body = '' ) {
    new Notification({ title, body }).show()
  }

}

const winController = WinController.getInstance()
export default winController
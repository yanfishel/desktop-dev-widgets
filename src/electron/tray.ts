import { app, Menu, nativeImage, screen, Tray } from 'electron'
import is from 'electron-is'

import {config} from "../config";
import {APP_WIDTH} from "../constants";
import appSettings from "./settings";
import winController from "./windows";


class TrayController {
  static instance: TrayController | null = null

  tray:Tray

  static getInstance() {
    if (!TrayController.instance) {
      TrayController.instance = new TrayController()
    }

    return TrayController.instance
  }

  init(){
    // Create a new tray instance with the tray icon
    this.tray = new Tray(this.icon)

    // Set the tooltip for the tray
    this.tray.setToolTip(config.applicationName)

    // Set the context menu for the tray
    this.tray.setContextMenu(this.menu)

    this.tray.on('click', () => {
      this.tray.popUpContextMenu(this.menu)
    })
  }

  rebuild(){
    this.destroy()
    this.init()
  }

  destroy(){
    this.tray.destroy()
  }

  get menu() {
    // Create a context menu for the tray
    const contextMenu = Menu.buildFromTemplate([
      { type: 'header', label: config.applicationName },
      { type: 'separator' },
      { label: 'Options', submenu: [
          { label: 'Lock position', type:'checkbox', checked: this.appLocked,  click: (menuItem) => {
            winController.lock(menuItem.checked)
          } },
          { label: 'Size', submenu: [
              { label: 'Small', type: 'radio', checked: this.appSize === 'small', click: () => winController.resize('small') },
              { label: 'Medium', type: 'radio', checked: this.appSize === 'medium', click: () => winController.resize('medium') },
              { label: 'Large', type: 'radio', checked: this.appSize === 'large', click: () => winController.resize('large') }
            ]
          }
      ]},
      { label: 'About', click: () => winController.createAbout() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() },
    ])

    return contextMenu
  }

  get icon() {
    // Get the pixel ratio based on the platform
    const pixelRatio = is.windows()
      ? screen.getPrimaryDisplay().scaleFactor || 1
      : 1

    // Create a tray icon from the specified path and resize it
    return nativeImage.createFromPath(config.iconPath).resize({
      width: 16 * pixelRatio,
      height: 16 * pixelRatio,
    })
  }

  get appSize() {
    const settings = appSettings.settings
    return settings.width === APP_WIDTH.SMALL ? 'small' : settings.width === APP_WIDTH.MEDIUM ? 'medium' : 'large'
  }

  get appLocked() {
    const settings = appSettings.settings
    return settings.locked
  }

}

const trayController = TrayController.getInstance()
export default trayController

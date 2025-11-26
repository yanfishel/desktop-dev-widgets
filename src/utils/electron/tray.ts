import { app, Menu, nativeImage, screen, Tray } from 'electron'
import is from 'electron-is'
import {config} from "../../config";
import {getAppSettings} from "./app-settings";
import {APP_WIDTH} from "../../constants";
import {resizeMainWindow} from "./main-window";
import NativeImage = Electron.NativeImage;



const checkSize = () => {
  const appSettings = getAppSettings()
  return appSettings.width === APP_WIDTH.SMALL ? 'small' : appSettings.width === APP_WIDTH.MEDIUM ? 'medium' : 'large'
}

let tray:Tray

/**
 * Registers the tray icon and sets up the tray functionality.
 */
export const registerTray = () => {
  // Get the pixel ratio based on the platform
  const pixelRatio = is.windows()
    ? screen.getPrimaryDisplay().scaleFactor || 1
    : 1

  // Create a tray icon from the specified path and resize it
  const trayIcon = nativeImage.createFromPath(config.iconPath).resize({
    width: 16 * pixelRatio,
    height: 16 * pixelRatio,
  })

  // Create a new tray instance with the tray icon
  tray = new Tray(trayIcon)

  // Create a context menu for the tray
  const contextMenu = Menu.buildFromTemplate([
    { type: 'header', label: config.applicationName },
    { type: 'separator' },
    /*{ label: 'Open', click: () => createMainWindow() },
    { label: 'Show All', click: () => windowManager.showAllWindows() },*/
    { label: 'Widgets size', submenu: [
        { label: 'Small', type: 'radio', checked: checkSize() === 'small', click: () => resizeMainWindow('small') },
        { label: 'Medium', type: 'radio', checked: checkSize() === 'medium', click: () => resizeMainWindow('medium') },
        { label: 'Large', type: 'radio', checked: checkSize() === 'large', click: () => resizeMainWindow('large') }
      ]
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ])

  // Set the tooltip for the tray
  tray.setToolTip(config.applicationName)

  // Set the context menu for the tray
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    tray.popUpContextMenu(contextMenu)
  })

}

export const destroyTray = () => {
  tray.destroy()
}
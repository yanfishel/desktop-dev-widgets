import {dialog, screen} from "electron";
import * as path from "node:path";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import {config} from "@config";
import {APP_SETTINGS_DEFAULT, APP_WIDTH } from "@constants";



export const getAppSettings = ():IAppSettings => {
  try {
    const settingsDataRaw = readFileSync(config.appSettingsPath, 'utf-8')
    const settingsData = JSON.parse(settingsDataRaw)
    return settingsData
  } catch (error: any) {
    // If the app-settings.json file is missing, initialize it from the public template
    // or create an empty config so the app can start gracefully.
    if (error && error.code === 'ENOENT') {
      try {
        const targetDir = path.dirname(config.appSettingsPath)
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true })
        }

        let initial = {...APP_SETTINGS_DEFAULT}

        const primaryDisplay = screen.getPrimaryDisplay()
        if(primaryDisplay) {
          const { width, height } = primaryDisplay.workAreaSize
          initial = {
            ...initial,
            height,
            x: width - APP_WIDTH.LARGE
          }
        }
        writeFileSync(config.appSettingsPath, JSON.stringify(initial, null, 2))
        return initial
      } catch (initErr) {
        dialog.showErrorBox('Failed to initialize settings', `${initErr}`)
        throw initErr
      }
    }
    dialog.showErrorBox('Failed to read data', `${error}`)
    throw error
  }
}


export const setAppSettings = ( settings: IAppSettings) => {
  try {
    writeFileSync(config.appSettingsPath, JSON.stringify(settings, null, 2))
  } catch (err) {
    dialog.showErrorBox('Error writing to data', `${err}`)
  }
}

import {dialog, screen} from "electron";
import * as path from "node:path";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import {config} from "../config";
import {T_AppSettings} from "../types";
import {APP_SETTINGS_DEFAULT, APP_WIDTH} from "../constans";


/**
 * Reads the app-settings.json file and returns its contents as a string.
 * @returns The contents of the app-settings.json file as a string.
 * @throws If an error occurs while reading the file.
 */
export const getAppSettings = ():T_AppSettings => {
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
            x: width - APP_WIDTH.MEDIUM
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


/**
 * Writes the given JSON data to the app-settings.json file located at the given path.
 * @param jsonData - The JSON data to write.
 */
export const setAppSettings = ( jsonData: T_AppSettings) => {
  try {
    writeFileSync(config.appSettingsPath, JSON.stringify(jsonData, null, 2))
  } catch (err) {
    dialog.showErrorBox('Error writing to data', `${err}`)
  }
}
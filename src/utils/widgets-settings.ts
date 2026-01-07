import {getStorageItem, setStorageItem} from "../utils";
import { STORAGE_KEYS, WIDGETS_SETTINGS_DEFAULT} from "../constants";

let localSettings:IWidgetsSettings

export const getWidgetsSettings = ():IWidgetsSettings => {
  if(localSettings) return localSettings
  const settings = getStorageItem(STORAGE_KEYS.WIDGETS_SETTINGS)
  if(settings) {
    const parsedSettings = JSON.parse(settings)
    return {
      ...WIDGETS_SETTINGS_DEFAULT,
      ...parsedSettings,
      widgets: {
        ...WIDGETS_SETTINGS_DEFAULT.widgets,
        ...parsedSettings.widgets
      }
    }
  }
  const defaultSettings = WIDGETS_SETTINGS_DEFAULT
  setWidgetsSettings(defaultSettings)
  return defaultSettings
}


export const setWidgetsSettings = (settings:IWidgetsSettings) => {
  localSettings = settings
  const settingsString = JSON.stringify(settings)
  setStorageItem(STORAGE_KEYS.WIDGETS_SETTINGS, settingsString)
}

export const setWidgetsSetting = (key: keyof IWidgetsSettings, value:unknown):IWidgetsSettings => {
  const settings = {...getWidgetsSettings(), [key]: value }
  localSettings = settings
  setWidgetsSettings(settings)
  return settings
}

export const setWidgetsWidgetSetting = (key: string, value:TWidget) => {
  const current = getWidgetsSettings()
  const settings = {
    ...current,
    widgets: {
      ...current.widgets,
      [key]: value
    }
  }
  setWidgetsSettings(settings)
  return settings
}
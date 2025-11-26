import {getStorageItem, setStorageItem} from "./storage";
import {SETTINGS_STORE_KEY, WIDGETS_SETTINGS_DEFAULT} from "../constants";

let localSettings:IWidgetsSettings

export const getWidgetsSettings = ():IWidgetsSettings => {
  if(localSettings) return localSettings
  const settings = getStorageItem(SETTINGS_STORE_KEY)
  if(settings) {
    return {...WIDGETS_SETTINGS_DEFAULT, ...JSON.parse(settings)}
  }
  const defaultSettings = WIDGETS_SETTINGS_DEFAULT
  setWidgetsSettings(defaultSettings)
  return defaultSettings
}


export const setWidgetsSettings = (settings:IWidgetsSettings) => {
  localSettings = settings
  const settingsString = JSON.stringify(settings)
  setStorageItem(SETTINGS_STORE_KEY, settingsString)
}

export const setWidgetsSetting = (key: keyof IWidgetsSettings, value: any):IWidgetsSettings => {
  const settings = {...getWidgetsSettings(), [key]: value }
  localSettings = settings
  setWidgetsSettings(settings)
  return settings
}
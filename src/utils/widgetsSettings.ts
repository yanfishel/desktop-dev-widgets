import {getStorageItem, setStorageItem} from "./storage";
import {SETTINGS_STORE_KEY, WIDGETS_SETTINGS_DEFAULT} from "../constans";


export const getWidgetsSettings = ():IWidgetsSettings => {
  const settings = getStorageItem(SETTINGS_STORE_KEY)
  if(settings) {
    return {...WIDGETS_SETTINGS_DEFAULT, ...JSON.parse(settings)}
  }
  const defaultSettings = WIDGETS_SETTINGS_DEFAULT
  setWidgetsSettings(defaultSettings)
  return defaultSettings
}


export const setWidgetsSettings = (settings:IWidgetsSettings) => {
  const settingsString = JSON.stringify(settings)
  setStorageItem(SETTINGS_STORE_KEY, settingsString)
}

export const setWidgetsSetting = (key: keyof IWidgetsSettings, value: any):IWidgetsSettings => {
  const settings = {...getWidgetsSettings(), [key]: value }
  setWidgetsSettings(settings)
  return settings
}
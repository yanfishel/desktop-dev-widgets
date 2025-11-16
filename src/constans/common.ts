
export const APP_WIDTH = {
  SMALL: 320,
  MEDIUM: 380,
  LARGE: 450,
}

export const APP_SETTINGS_DEFAULT = {
  width: APP_WIDTH.MEDIUM,
  height: APP_WIDTH.MEDIUM,
  x: 0,
  y: 0,
  alwaysOnTop: false
}

export const WIDGETS_SETTINGS_DEFAULT:IWidgetsSettings = {
  theme: 'system',
  locked: false,
  weather: {
    active: true
  },
  dailyWeather: {
    active: true
  },
  notes: {
    active: true,
    order: 0
  },
  autoGeoPosition: true,
  geoInfo: null,
  geoManual: { name:'', lat: 0, lon: 0 }
}

export const NOTES_PLACEHOLDER = 'TYPE YOUR NOTES HERE'

export const SETTINGS_STORE_KEY = 'dev-widgets-settings'
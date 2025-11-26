
export const APP_WIDTH = {
  SMALL: 300,
  MEDIUM: 360,
  LARGE: 440,
}

export const APP_SETTINGS_DEFAULT = {
  width: APP_WIDTH.LARGE,
  height: APP_WIDTH.LARGE,
  x: 0,
  y: 0,
  alwaysOnTop: false
}

export const WIDGETS_SETTINGS_DEFAULT:IWidgetsSettings = {
  theme: 'system',
  size: 'large',
  locked: false,
  weather: {
    active: true
  },
  dailyWeather: {
    active: true,
    order: 1
  },
  webSearch: {
    active: true,
    order: 2
  },
  devUtils: {
    active: true,
    order: 3
  },
  notes: {
    active: true,
    order: 4
  },
  autoGeoPosition: true,
  location: { name:'', lat: 0, lon: 0 }
}

export const NOTES_PLACEHOLDER = 'TYPE YOUR NOTES HERE'

export const IMAGES_MIME = ['image/jpeg', 'image/png', 'image/apng', 'image/gif', 'image/bmp', 'image/webp', 'svg+xml']

export const SETTINGS_STORE_KEY = 'dev-widgets-settings'
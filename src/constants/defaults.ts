
export const APP_WIDTH = {
  SMALL: 300,
  MEDIUM: 360,
  LARGE: 440,
}

export const APP_SETTINGS_DEFAULT:IAppSettings = {
  width: APP_WIDTH.LARGE,
  height: APP_WIDTH.LARGE,
  x: 0,
  y: 0,
  locked: false,
  openAtLogin: false
}

export const WIDGETS_SETTINGS_DEFAULT:IWidgetsSettings = {
  theme: 'system',
  size: 'large',
  locked: false,
  weather: {
    id: 'widget-weather',
    active: true
  },
  autoGeoPosition: true,
  location: { name:'', lat: 0, lon: 0 },
  widgets: {
    dailyWeather: {
      id: 'widget-daily-weather',
      active: true,
      order: 1
    },
    webSearch: {
      id: 'widget-web-search',
      active: true,
      order: 2
    },
    systemInfo: {
      id: 'widget-system-info',
      active: true,
      order: 3
    },
    mockServer: {
      id: 'widget-mock-server',
      active: true,
      order: 4
    },
    devUtils: {
      id: 'widget-dev-utils',
      active: true,
      order: 5
    },
    notes: {
      id: 'widget-notes',
      active: true,
      order: 6
    }
  }
}

export const MOCK_SERVER_SCHEME_DEFAULT = [
  {
    path: '/',
    scheme: [
      { name: '', value:'', type: 'string' }
    ]
  }
]
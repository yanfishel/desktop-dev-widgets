
interface IAppSettings {
  width: number
  height: number
  x: number
  y: number
  alwaysOnTop: boolean
}

type TTheme = 'system' | 'light' | 'dark'

type TWidgetsSize = 'small' | 'medium' | 'large'

type TWidget = {
  active: boolean
  order: number
}


interface IWidgetsSettings {
  theme: TTheme
  size: TWidgetsSize
  locked: boolean,
  weather: { active: boolean }
  dailyWeather: TWidget
  webSearch: TWidget
  devUtils: TWidget
  notes: TWidget
  autoGeoPosition: boolean
  location: { name: string, lat: number, lon: number } | null
}

interface Window {
  electronAPI: {
    setWidgetsSize: (size: string) => void
    openExternal: (url: string) => Promise<void>

    onWidgetsResize: (callback: (_event: any, size: TWidgetsSize) => void) => void
    onPowerMonitorEvent: (callback: (_event: any, name:string ) => void) => void
  }
}
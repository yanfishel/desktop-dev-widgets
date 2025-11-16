
interface IAppSettings {
  width: number
  height: number
  x: number
  y: number
  alwaysOnTop: boolean
}

type TTheme = 'system' | 'light' | 'dark'

type TWidget = {
  active: boolean
  order: number
}

type TGeoInfo = {
  country: string,
  countryCode: string,
  region: string,
  regionName: string,
  city: string,
  lat: number,
  lon: number
}

interface IWidgetsSettings {
  theme: TTheme
  locked: boolean,
  weather: { active: boolean }
  dailyWeather: { active: boolean }
  notes: TWidget
  autoGeoPosition: boolean
  geoInfo: TGeoInfo | null
  geoManual: { name: string, lat: number, lon: number } | null
}

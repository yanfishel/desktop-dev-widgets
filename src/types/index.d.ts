
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

interface IWidgetsSettings {
  theme: TTheme
  locked: boolean,
  notes: TWidget
}

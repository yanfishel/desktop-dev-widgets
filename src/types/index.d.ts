// types.d.ts
interface IAppSettings {
  width: number
  height: number
  x: number
  y: number
  locked: boolean
  alwaysOnTop: boolean
}

type TTheme = 'system' | 'light' | 'dark'

type TWidgetsSize = 'small' | 'medium' | 'large'

type TWidget = {
  id: string
  active: boolean
  order: number
}

type TOrder = { [key: string]: number }


interface IWidgetsSettings {
  theme: TTheme
  size: TWidgetsSize
  locked: boolean,
  weather: { id:string, active: boolean }
  dailyWeather: TWidget
  webSearch: TWidget
  systemInfo: TWidget
  devUtils: TWidget
  notes: TWidget
  autoGeoPosition: boolean
  location: { name: string, lat: number, lon: number } | null
}

interface Window {
  electronAPI: {
    setWidgetsSize: (size: string) => void
    setLockPosition: (locked: boolean) => void
    openExternal: (url: string) => Promise<void>

    getDiskUsage: () => Promise< Systeminformation.FsSizeData[] >
    getSystemInfo: () => Promise< { info:Systeminformation.CurrentLoadData, memory:Systeminformation.MemData } >
    getPublicIP: () => Promise<string>
    getNetworkStatsInfo: () => Promise<{ stats:Systeminformation.NetworkStatsData[], iface:Systeminformation.NetworkInterfacesData } >

    onWidgetsResize: (callback: (_event: any, size: TWidgetsSize) => void) => void
    onLockPosition: (callback: (_event: any, locked: boolean) => void) => void
    onPowerMonitorEvent: (callback: (_event: any, name:string ) => void) => void
  }
}
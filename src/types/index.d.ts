// types.d.ts

interface IAppSettings {
  width: number
  height: number
  x: number
  y: number
  locked: boolean
  openAtLogin: boolean
}

type TTheme = 'system' | 'light' | 'dark'

type TWidgetsSize = 'small' | 'medium' | 'large'

type TWidget = {
  id: string
  active: boolean
  order: number
}

type TWidgets = {
  dailyWeather: TWidget
  webSearch: TWidget
  systemInfo: TWidget
  devUtils: TWidget
  mockServer: TWidget
  notes: TWidget
}

interface IPackageJson {
  productName?: string;
  version?: string;
  description?: string;
  homepage?: string;
  author?: { name: string; email: string };
  bugs?: { url: string };
  license?: string | LicenseEntry;
}

interface IWidgetsSettings {
  theme: TTheme
  size: TWidgetsSize
  locked: boolean,
  weather: { id:string, active: boolean }
  autoGeoPosition: boolean
  location: { name: string, lat: number, lon: number } | null
  widgets: TWidgets
}


type S_NetworkStatsData = Systeminformation.NetworkStatsData

type S_NetworkInterfacesData = Systeminformation.NetworkInterfacesData

type S_CurrentLoadData = Systeminformation.CurrentLoadData

type S_MemData = Systeminformation.MemData

type S_FsSizeData = Systeminformation.FsSizeData


interface Window {
  electronAPI: {
    setWidgetsSize: (size: string) => void
    setLockPosition: (locked: boolean) => void
    openExternal: (url: string) => Promise<void>
    openAboutWinow: () => Promise<void>
    getAppInfo: () => Promise<{ packageJson:IPackageJson, versions:string[][] }>
    getDiskUsage: () => Promise< S_FsSizeData[] >
    getSystemInfo: () => Promise< { info:S_CurrentLoadData, memory:S_MemData } >
    getPublicIP: () => Promise<string>
    getNetworkStatsInfo: () => Promise<{ stats:S_NetworkStatsData[], iface:S_NetworkInterfacesData } >

    mockServerTest: (port:number) => void
    mockServerStart: (port:number) => void
    mockServerStop: () => void

    onMockServerResponse: (callback: (_event: unknown, response:string) => void) => void
    onMockServerError: (callback: (_event: unknown, error:string) => void) => void

    onWidgetsResize: (callback: (_event: unknown, size: TWidgetsSize) => void) => void
    onLockPosition: (callback: (_event: unknown, locked: boolean) => void) => void
    onPowerMonitorEvent: (callback: (_event: unknown, name:string ) => void) => void
  }
}

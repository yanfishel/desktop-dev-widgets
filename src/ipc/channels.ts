// IPC channels
export enum IpcChannels {
  WIDGET_SIZE = 'widget-size',
  POWER_MONITOR_EVENT = 'power-monitor-event',
  LOCK_POSITION = 'lock-position',
  GET_APP_INFO = 'get-app-info',
  OPEN_EXTERNAL = 'open-external',
  OPEN_ABOUT_WINDOW = 'open-about-window',
  GET_DISK_USAGE = 'get-disk-usage',
  GET_SYSTEM_INFO = 'get-system-info',
  GET_NETWORK_STATS_INFO = 'get-network-stats-info',
  GET_PUBLIC_IP = 'get-public-ip',

  MOCK_SERVER_TEST = 'mock-server-test',
  MOCK_SERVER_START = 'mock-server-start',
  MOCK_SERVER_STOP = 'mock-server-stop',
  MOCK_SERVER_RESPONSE = 'mock-server-response',
  MOCK_SERVER_ERROR = 'mock-server-error'
}
